import {
  HomeIcon,
  CircleUserRoundIcon,
  SettingsIcon,
  Wallet2Icon,
  Gamepad2Icon,
  ScrollTextIcon,
} from 'lucide-react'

export const routesConfig = {
  base: { path: '/', icon: null, showInSidebar: false, name: 'Base' },
  login: { path: '/login', icon: null, showInSidebar: false, name: 'Login' },
  home: { path: '/home', icon: HomeIcon, showInSidebar: true, name: 'Home' },
  games: {
    path: '/games',
    icon: Gamepad2Icon,
    showInSidebar: false,
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
  betHistory: {
    path: '/bet-history',
    icon: ScrollTextIcon,
    showInSidebar: true,
    name: 'Histórico',
  },
  settings: {
    path: '/settings',
    icon: SettingsIcon,
    showInSidebar: false,
    name: 'Configurações',
  },
  profile: {
    path: '/profile',
    icon: CircleUserRoundIcon,
    showInSidebar: false,
    name: 'Perfil',
  },
}
