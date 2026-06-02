import { useWallet } from '#/data/queries/wallets/use-wallet'
import { keyCloakRepositories } from '#/data/repositories/keycloak'
import { routesConfig } from '#/routes/routes.config'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [userName, setUserName] = useState<string | null>(null)
  const navigate = useNavigate()
  const { useBalance } = useWallet()

  useEffect(() => {
    const tokens = localStorage.getItem('user_tokens')
    console.log(JSON.parse(tokens || '{}'))
    const accessToken = tokens ? JSON.parse(tokens).access_token : null

    const parsedPayload = JSON.parse(atob(accessToken.split('.')[1]))

    setUserName(parsedPayload.preferred_username ?? parsedPayload.email)
  }, [])

  function handleNavigate(path: string) {
    navigate({ to: path })
    onClose()
  }

  function handleLogout() {
    keyCloakRepositories.auth.logout()
    navigate({ to: routesConfig.login.path })
  }

  return (
    <div
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-[100dvh] flex flex-col justify-between
        bg-background text-white p-4
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div>
        <img
          src="/sidebar_top2.png"
          alt="Logo"
          className="w-full h-auto mb-6"
        />
        <ul>
          {Object.values(routesConfig)
            .filter((route) => route.showInSidebar)
            .map((route) => (
              <li key={route.path} className="mb-2">
                <div
                  onClick={() => handleNavigate(route.path)}
                  className="hover:bg-gray-700 text-sm cursor-pointer rounded-xl flex items-center justify-start px-4 py-2 text-primary w-full"
                >
                  {route.icon && <route.icon className="inline-block mr-2" />}
                  {route.name}
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex flex-col items-center">
        <hr className="border-golden my-4 w-full" />
        <div className="text-primary rounded-xl text-sm flex flex-col items-left justify-start px-4 py-2 w-full">
          <div className="flex items-center">
            <routesConfig.profile.icon className="inline-block mr-2" />
            <div>{userName}</div>
          </div>

          <p className="text-gray-400 text-sm">
            {useBalance.isLoading
              ? '...'
              : `R$ ${useBalance.data?.toFixed(2) ?? '--'}`}
          </p>
        </div>
        <div
          onClick={handleLogout}
          className="hover:bg-gray-700 text-sm cursor-pointer text-primary rounded-xl flex items-center justify-start px-4 py-2 w-full"
        >
          <LogOutIcon className="inline-block mr-2" />
          Sair
        </div>
      </div>
    </div>
  )
}
