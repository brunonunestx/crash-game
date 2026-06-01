import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/games/')({
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})
