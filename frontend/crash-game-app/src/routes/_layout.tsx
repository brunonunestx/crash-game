import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '#/presentation/components/sidebar'

export const Route = createFileRoute('/_layout')({ component: Layout })

function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen">
        <main className="flex-1 h-full bg-background-variant">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
