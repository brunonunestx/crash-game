import { MonkeyCrashPage } from '#/presentation/pages/games/monkey-crash'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/games/monkey-crash')({
  component: MonkeyCrashPage,
})
