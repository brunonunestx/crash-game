import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/presentation/pages/home'

export const Route = createFileRoute('/_layout/home')({ component: HomePage })
