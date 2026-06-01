# Crash Game — Jungle Gaming

Plataforma de Crash Game multiplayer em tempo real. Um multiplicador sobe a partir de `1.00x` e pode crashar a qualquer momento. Jogadores apostam durante a fase de apostas e precisam sacar antes do crash para garantir os ganhos.

---

## Setup e execução

### Pré-requisitos

- Bun >= 1.x
- Docker & Docker Compose

### Subir tudo

```bash
bun run docker:up
```

O comando sobe toda a infraestrutura e os serviços automaticamente:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Kong (API Gateway) | http://localhost:8000 |
| Game Service (direto) | http://localhost:4001 |
| Wallet Service (direto) | http://localhost:4002 |
| Keycloak | http://localhost:8080 |
| RabbitMQ UI | http://localhost:15672 |

### Usuário de teste

| Campo | Valor |
|---|---|
| Usuário | `player` |
| Senha | `player123` |
| Email | `player@crash-game.dev` |
| Saldo inicial | R$ 1.000,00 |

### Outros comandos

```bash
bun run docker:down    # Para os containers
bun run docker:prune   # Remove tudo (containers, volumes, imagens)
```

---

## Rodando os testes

### Backend — Games Service

```bash
cd services/games

# Unitários
bun test tests/unit

# E2E (requer docker:up rodando)
bun run test:e2e
```

### Backend — Wallet Service

```bash
cd services/wallets

# Unitários
bun test tests/unit
```

### Frontend

```bash
cd frontend

bun test
```

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│              Frontend (TanStack Start)       │
│         React + Tailwind CSS + Socket.IO     │
└────────────────┬──────────────┬─────────────┘
            HTTP/REST       WebSocket
                 │               │
┌────────────────▼───────────────▼─────────────┐
│                 Kong (API Gateway)            │
│          DB-less / Declarativo                │
└──────────────┬────────────────┬──────────────┘
               │                │
┌──────────────▼──┐    ┌────────▼──────────────┐
│   Game Service  │    │    Wallet Service      │
│   (NestJS/Bun)  │    │    (NestJS/Bun)        │
│   porta 4001    │    │    porta 4002          │
└──────┬──────────┘    └────────┬───────────────┘
       │                        │
       └───────────┬────────────┘
                   │
        ┌──────────▼──────────┐
        │     PostgreSQL      │
        │  games | wallets    │
        └─────────────────────┘
                   │
        ┌──────────▼──────────┐
        │      RabbitMQ       │
        │  (eventos de aposta)│
        └─────────────────────┘

┌─────────────────────────────┐
│   Keycloak (IdP — OIDC)     │
└─────────────────────────────┘
```

---

## Decisões arquiteturais

### Outbox/Inbox Pattern (at-least-once delivery)

A comunicação assíncrona entre Game Service e Wallet Service usa o padrão Outbox/Inbox para garantir entrega confiável de eventos sem perda de mensagens.

**Game Service (Outbox):**
- Quando uma aposta é resolvida (ganho, perda ou cancelamento), a use case salva uma entrada na tabela `Outbox` dentro da mesma transação de banco
- Um worker (`SendMessageWorker`) roda a cada 5s, lê entradas não processadas e publica no RabbitMQ, marcando-as como processadas

**Wallet Service (Inbox):**
- Um subscriber consome os eventos do RabbitMQ e salva na tabela `Inbox` (deduplicação por ID da mensagem)
- Um worker (`InboxWorker`) roda a cada 1s, processa as mensagens pendentes e chama `CreateLedgerItemUseCase`
- O processamento é marcado como concluído apenas após sucesso

Isso garante **at-least-once delivery**: se o serviço cair após publicar mas antes de marcar como processado, a mensagem é reprocessada. O Inbox deduplica para evitar efeitos colaterais.

---

### Ledger Pattern (precisão monetária)

O saldo do usuário nunca é armazenado apenas como um número — cada movimentação financeira gera uma entrada imutável na tabela `Ledger`.

- Cada evento (`DEPOSIT`, `WITHDRAW`, `WIN`, `LOSS`) cria uma linha no Ledger com o valor em **centavos inteiros** (`INT`)
- O saldo atual é calculado via `SUM(CASE WHEN type IN ('WITHDRAW', 'LOSS') THEN -amount ELSE amount END)`
- A tabela `Wallet` armazena o `balance` como cache calculado após cada transação
- **Nunca** há ponto flutuante para valores monetários — todo o stack usa centavos como unidade base

Isso garante auditabilidade completa, saldo nunca negativo e precisão monetária.

---

### Provably Fair

O crash point de cada rodada é determinístico e verificável pelo jogador.

**Geração:**
1. O server gera um seed aleatório (`randomBytes(32)`)
2. Computa `hashedSeed = SHA-256(seed)` e exibe no frontend antes da rodada começar
3. O crash point é calculado via `HMAC-SHA256(seed, nounce)` — o jogador não conhece o seed durante a rodada

**Verificação:**
1. Após o crash, o seed é revelado via `GET /games/rounds/:roundId/verify`
2. O jogador verifica que `SHA-256(seed) == hashedSeed` exibido antes da rodada
3. O jogador recalcula o crash point e confirma que não houve manipulação

Endpoint de verificação: `GET /games/rounds/:roundId/verify`

---

### Round Engine

A engine de jogo roda dentro do Game Service em loop contínuo:

```
STARTING → BETTING (10s) → PLAYING → ENDED → STARTING (próxima rodada)
```

- O estado da rodada é persistido no PostgreSQL a cada transição
- O multiplicador é incrementado em centavos a cada tick (100 = 1.00x)
- O crash point é pré-calculado no início e nunca alterado
- Atualizações são broadcast via WebSocket (`round:update`) para todos os clientes conectados
- Na conexão, o cliente recebe o estado atual via `round:sync`

---

### Autenticação

- **Frontend ↔ Backend**: JWT emitido pelo Keycloak, validado via JWKS em cada requisição
- **Backend ↔ Backend**: API Key via header `x-api-key` para rotas de comunicação interna
- Os certs do Keycloak são buscados no startup (`OnModuleInit`) e renovados a cada 5s via cron

---

### Separação de bounded contexts

| Contexto | Responsabilidade |
|---|---|
| **Game Service** | Ciclo de vida da rodada, apostas, crash point, WebSocket, Provably Fair |
| **Wallet Service** | Saldo, carteira, ledger, processamento de eventos financeiros |

Os serviços não compartilham banco de dados. A consistência eventual é garantida pelo Outbox/Inbox com deduplicação.

---

## Variáveis de ambiente

Cada serviço tem um `.env.example`:

```bash
cp services/games/.env.example services/games/.env
cp services/wallets/.env.example services/wallets/.env
```

As variáveis de infra (PostgreSQL, RabbitMQ, Keycloak) já estão hardcoded no `docker-compose.yml` para desenvolvimento local.
