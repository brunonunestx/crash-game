import {
  HomeIcon,
  CircleUserRoundIcon,
  SettingsIcon,
  Wallet2Icon,
  Gamepad2Icon,
} from 'lucide-react'

export const routesConfig = {
  base: { path: '/', icon: null, showInSidebar: false, name: 'Base' },
  login: { path: '/login', icon: null, showInSidebar: false, name: 'Login' },
  home: { path: '/home', icon: HomeIcon, showInSidebar: true, name: 'Home' },
  games: {
    path: '/games',
    icon: Gamepad2Icon,
    showInSidebar: true,
    name: 'Jogos',
    options: {
      crash: { path: '/monkey-crash', name: 'Crash' },
    },
  },
  wallet: {
    path: '/wallet',
    icon: Wallet2Icon,
    showInSidebar: true,
    name: 'Carteira',
  },
  settings: {
    path: '/settings',
    icon: SettingsIcon,
    showInSidebar: true,
    name: 'Configurações',
  },
  profile: {
    path: '/profile',
    icon: CircleUserRoundIcon,
    showInSidebar: false,
    name: 'Perfil',
  },
}
