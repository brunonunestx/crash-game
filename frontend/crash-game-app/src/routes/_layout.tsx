import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Sidebar } from '#/presentation/components/sidebar'
import { Header } from '#/presentation/components/header'

export const Route = createFileRoute('/_layout')({ component: Layout })

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 h-screen min-w-0">
        <div className="md:hidden shrink-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="flex-1 overflow-auto bg-background-variant">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
