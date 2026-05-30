import { repositories } from '#/data/repositories'
import { Box } from '#/presentation/components/box'
import { Button } from '#/presentation/components/button'
import { Input } from '#/presentation/components/input'
import { User, Lock } from 'lucide-react'
import { useState } from 'react'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    repositories.keyCloak.auth.login(username, password)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/bg-jungle-gaming.png)' }}
    >
      <div className="relative">
        <img
          src="/jungle_cassinos_wbg.png"
          alt="Jungle Cassino's Logo"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-54 h-54 object-contain"
        />
        <Box className="w-128 h-130 pt-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-primary mt-4 mb-2">
              Bem vindo ao Jungle Cassino's!
            </h1>
            <h2 className="text-md text-foreground mb-4">
              Ingresse com sua conta e venha se divertir.
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-[90%]">
            <div className="flex flex-col w-full gap-2">
              <p className="flex items-center gap-2 w-full text-left text-primary">
                <User />
                Usuario
              </p>
              <Input
                value={username}
                onChange={setUsername}
                className="w-full"
              ></Input>
            </div>

            <div className="flex flex-col w-full gap-2">
              <p className="flex items-center gap-2 w-full text-left text-primary">
                <Lock />
                Senha
              </p>
              <Input
                value={password}
                type="password"
                onChange={setPassword}
                className="w-full"
              ></Input>
              <p className="text-primary text-sm cursor-pointer">
                Esqueceu sua senha?
              </p>
            </div>
          </div>

          <Button
            variant="gradient"
            label="Login"
            height="40px"
            onClick={handleLogin}
            className="w-[90%] mt-6"
          />
          <p className="text-foreground">
            Não possui conta?{' '}
            <a href="/register" className="text-primary">
              Cadastre-se
            </a>
          </p>
        </Box>
      </div>
    </div>
  )
}
