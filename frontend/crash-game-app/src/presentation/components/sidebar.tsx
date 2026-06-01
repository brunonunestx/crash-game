import { useWallet } from '#/data/queries/wallets/use-wallet'
import { routesConfig } from '#/routes/routes.config'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function Sidebar() {
  const navigate = useNavigate()
  const { useBalance } = useWallet()
  return (
    <div className="w-64 h-[100dvh] flex flex-col justify-between bg-background text-white p-4">
      <div>
        <img
          src="/sidebar_top2.png"
          alt="Logo"
          className="w-full ml-auto mr-auto h-auto mb-6"
        />
        <ul>
          {Object.values(routesConfig)
            .filter((route) => route.showInSidebar)
            .map((route) => (
              <li key={route.path} className="mb-2">
                <div
                  onClick={() => navigate({ to: route.path })}
                  className="hover:bg-gray-700 rounded-xl flex items-center justify-start px-4 py-2 w-full"
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
        <div className="hover:bg-gray-700 rounded-xl flex flex-col items-left justify-start px-4 py-2 w-full">
          <div>
            {routesConfig.profile.icon && (
              <routesConfig.profile.icon className="inline-block mr-2" />
            )}
            {routesConfig.profile.name}
          </div>

          <p className="text-gray-400 text-sm">
            {useBalance.isLoading
              ? '...'
              : `R$ ${useBalance.data?.toFixed(2) ?? '--'}`}
          </p>
        </div>
        <div className="hover:bg-gray-700 rounded-xl flex items-center justify-start px-4 py-2 w-full">
          <LogOutIcon className="inline-block mr-2" />
          Sair
        </div>
      </div>
    </div>
  )
}
