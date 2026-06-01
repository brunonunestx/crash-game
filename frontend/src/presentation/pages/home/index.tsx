import { GameCard } from '#/presentation/components/game-card'
import { useState, useEffect } from 'react'
import { mockedGames } from './mocks'
import { useNavigate } from '@tanstack/react-router'
import { routesConfig } from '#/routes/routes.config'

export function HomePage() {
  const [games, setGames] = useState<
    { id: string; title: string; description: string; imageUrl: string; disabled: boolean }[]
  >([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setGames(mockedGames)
      setLoading(false)
    }, 1000)
  }, [])

  function renderGames(gameId: string) {
    const route = `${routesConfig.games.path}/${gameId}`
    navigate({ to: route })
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
        Jogos no estilo Crash
      </h2>
      <section className="bg-background flex flex-nowrap gap-4 h-[35dvh] md:h-[40dvh] text-white p-4 md:p-8 rounded-xl shadow-lg overflow-x-auto styled-scrollbar">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)
          : games.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                disabled={game.disabled}
                onClick={() => renderGames(game.id)}
              />
            ))}
      </section>
    </div>
  )
}

function GameCardSkeleton() {
  return (
    <div className="w-70 md:w-60 h-full shrink-0 bg-golden/20 rounded-xl p-3 flex flex-col gap-3 animate-pulse">
      <div className="flex-1 bg-golden/20 rounded-lg" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-3/4 bg-golden/20 rounded-md" />
        <div className="h-3 w-full bg-golden/20 rounded-md" />
        <div className="h-3 w-2/3 bg-golden/20 rounded-md" />
      </div>
    </div>
  )
}
