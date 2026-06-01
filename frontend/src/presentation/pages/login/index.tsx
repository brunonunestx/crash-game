import { repositories } from '#/data/repositories'
import { Box } from '#/presentation/components/box'
import { Button } from '#/presentation/components/button'
import { Input } from '#/presentation/components/input'
import { Toast } from '#/presentation/components/toast'
import { User, Lock } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { routesConfig } from '#/routes/routes.config'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setIsLoading(true)
    try {
      await repositories.keyCloak.auth.login(username, password)
      navigate({ to: routesConfig.home.path })
    } catch (error: any) {
      toast.custom(() => <Toast message={error.message} type="error"></Toast>)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-16"
      style={{ backgroundImage: 'url(/bg-jungle-gaming.png)' }}
    >
      <div className="relative w-full max-w-md">
        <img
          src="/jungle_cassinos_wbg.png"
          alt="Jungle Cassino's Logo"
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-36 h-36 md:w-44 md:h-44 object-contain"
        />
        <Box className="w-full pt-20 md:pt-24 gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
              Bem vindo ao Jungle Cassino's!
            </h1>
            <h2 className="text-sm md:text-md text-foreground">
              Ingresse com sua conta e venha se divertir.
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col w-full gap-2">
              <p className="flex items-center gap-2 w-full text-left text-primary">
                <User size={18} />
                Usuario
              </p>
              <Input value={username} onChange={setUsername} className="w-full" />
            </div>

            <div className="flex flex-col w-full gap-2">
              <p className="flex items-center gap-2 w-full text-left text-primary">
                <Lock size={18} />
                Senha
              </p>
              <Input
                value={password}
                type="password"
                onChange={setPassword}
                className="w-full"
              />
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
            className="w-full"
            isLoading={isLoading}
          />
          <p className="text-foreground text-sm">
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
