import { GameCard } from '#/presentation/components/game-card'
import { useState, useEffect } from 'react'
import { mockedGames } from './mocks'
import { useNavigate } from '@tanstack/react-router'
import { routesConfig } from '#/routes/routes.config'

export function HomePage() {
  const [games, setGames] = useState<
    { id: string; title: string; description: string; imageUrl: string }[]
  >([])
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setGames(mockedGames)
    }, 1000)
  }, [])

  function renderGames(gameId: string) {
    const route = `${routesConfig.games.path}/${gameId}`
    navigate({ to: route })
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Jogos no estilo Crash
      </h2>
      <section className="bg-background flex flex-nowrap gap-4 h-[40dvh] text-white p-8 rounded-xl shadow-lg overflow-x-auto styled-scrollbar">
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            imageUrl={game.imageUrl}
            onClick={() => renderGames(game.id)}
          />
        ))}
      </section>
    </div>
  )
}
