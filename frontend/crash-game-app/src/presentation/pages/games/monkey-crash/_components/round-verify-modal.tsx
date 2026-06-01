import { X, ShieldCheck, ShieldAlert, Copy, Check, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRoundVerify } from '#/data/queries/games/use-round-verify'

type Props = {
  roundId: string
  onClose: () => void
}

async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacSha256(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const buffer = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function deriveCrashPoint(seed: string, nounce: number): Promise<number> {
  const hmac = await hmacSha256(seed, nounce.toString())
  const int = parseInt(hmac.slice(0, 13), 16)
  const e = Math.pow(2, 52)
  return Math.floor((100 * e) / (e - int))
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 text-foreground-variant hover:text-foreground transition-colors"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function HashField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-foreground-variant text-xs">{label}</span>
      <div className="flex items-center bg-background rounded-lg px-3 py-2 border border-white/5">
        <span className="text-foreground text-xs font-mono truncate">{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  )
}

type VerifyResult = {
  seedMatchesHash: boolean
  crashPointMatches: boolean
  derivedBreakPoint: number
}

export function RoundVerifyModal({ roundId, onClose }: Props) {
  const { data, isLoading, isError } = useRoundVerify(roundId)
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const formattedBreakPoint = useMemo(() => {
    if (!data) return null
    return (data.breakPoint / 100).toFixed(2)
  }, [data])

  useEffect(() => {
    if (!data) return

    async function runVerification() {
      const hashed = await sha256(data!.seed)
      const derived = await deriveCrashPoint(data!.seed, data!.nounce)

      setVerifyResult({
        seedMatchesHash: hashed === data!.hashedSeed,
        crashPointMatches: derived === data!.breakPoint,
        derivedBreakPoint: derived,
      })
    }

    runVerification()
  }, [data])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-background-variant border border-golden/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground-variant hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
          <div>
            <h2 className="text-foreground font-bold text-base">Verificação Provably Fair</h2>
            <p className="text-foreground-variant text-xs">Rodada #{roundId.slice(0, 8)}</p>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {isLoading && (
          <div className="flex items-center justify-center py-6 gap-2 text-foreground-variant text-sm">
            <Loader2 size={16} className="animate-spin" />
            Carregando dados da rodada...
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 text-red-400 text-sm py-4">
            <ShieldAlert size={16} />
            Não foi possível carregar os dados desta rodada.
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-3">
            <HashField label="Hash publicado antes da rodada" value={data.hashedSeed} />
            <HashField label="Semente revelada após a rodada" value={data.seed} />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-foreground-variant text-xs">Nounce</span>
                <div className="bg-background rounded-lg px-3 py-2 border border-white/5">
                  <span className="text-foreground text-xs font-mono">{data.nounce}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground-variant text-xs">Crash point</span>
                <div className="bg-background rounded-lg px-3 py-2 border border-white/5">
                  <span className="text-foreground text-xs font-mono">{formattedBreakPoint}x</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {!verifyResult && (
              <div className="flex items-center gap-2 text-foreground-variant text-xs py-1">
                <Loader2 size={12} className="animate-spin" />
                Verificando...
              </div>
            )}

            {verifyResult && (
              <div className="flex flex-col gap-2">
                <VerifyRow
                  ok={verifyResult.seedMatchesHash}
                  label="SHA256(semente) == hash publicado"
                />
                <VerifyRow
                  ok={verifyResult.crashPointMatches}
                  label={`HMAC-SHA256(semente, ${data.nounce}) → ${(verifyResult.derivedBreakPoint / 100).toFixed(2)}x`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function VerifyRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <ShieldCheck size={14} className="text-green-400 shrink-0" />
      ) : (
        <ShieldAlert size={14} className="text-red-400 shrink-0" />
      )}
      <span className={`text-xs ${ok ? 'text-green-400' : 'text-red-400'}`}>{label}</span>
    </div>
  )
}
