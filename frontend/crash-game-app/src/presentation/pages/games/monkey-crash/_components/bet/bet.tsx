import { Button } from '#/presentation/components/button'
import { Input } from '#/presentation/components/input'
import { RoundStatus, type IRound } from '@crash-game/types'
import { useEffect, useState } from 'react'

type BetProps = {
  round: IRound | null
}

export const Bet = ({ round }: BetProps) => {
  const [betAmount, setBetAmount] = useState<number>(0)
  const [userAlreadyBet, setUserAlreadyBet] = useState<boolean>(false)
  const [label, setLabel] = useState<string>('Aguardar')

  useEffect(() => {
    if (round?.status === RoundStatus.STARTING) {
      setUserAlreadyBet(false)
      setBetAmount(0)
      setLabel('Aguardar')
    }

    if (round?.status === RoundStatus.BETTING) {
      userAlreadyBet ? setLabel('Aguardar') : setLabel('Apostar')
    }

    if (round?.status === RoundStatus.PLAYING) {
      userAlreadyBet ? setLabel('Cash Out') : setLabel('Aguardar')
    }

    if (round?.status === RoundStatus.ENDED) {
      setUserAlreadyBet(false)
      setBetAmount(0)
      setLabel('Aguardar')
    }
  }, [round?.status])

  function makeBet() {
    setUserAlreadyBet(true)
  }

  function cashOut() {
    console.log('Cash out:', betAmount)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        id="manual-bet"
        className="flex items-center gap-2 bg-background-variant p-4 rounded-lg"
      >
        <Input
          value={betAmount}
          onChange={(amount) => setBetAmount(Number(amount))}
        />
        <Button
          label={label}
          variant="bet"
          onClick={round?.status === RoundStatus.BETTING ? makeBet : cashOut}
          className="cursor-pointer"
          disabled={
            round?.status === RoundStatus.ENDED ||
            round?.status === RoundStatus.STARTING ||
            userAlreadyBet
          }
        ></Button>
      </div>
      <div id="auto-bet" className="flex items-center gap-2"></div>
    </div>
  )
}
