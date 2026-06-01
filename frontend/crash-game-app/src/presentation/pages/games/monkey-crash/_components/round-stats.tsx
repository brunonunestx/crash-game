import { Trophy, TrendingUp, Users, Wifi } from 'lucide-react'

type RoundStatsProps = {
  currentMultiplier: number
  latencyMs: number
}

export function RoundStats({ currentMultiplier, latencyMs }: RoundStatsProps) {
  return (
    <div className="w-full flex items-center justify-around bg-background-variant rounded-lg px-4 py-2">
      <Stat icon={<Wifi className="w-3 h-3" />} label="LATÊNCIA" value={`${latencyMs}ms`} />
      <Stat icon={<TrendingUp className="w-3 h-3" />} label="MULTIPLICADOR" value={`${currentMultiplier.toFixed(2)}x`} />
      <Stat icon={<Users className="w-3 h-3" />} label="JOGADORES" value="0" />
      <Stat icon={<Trophy className="w-3 h-3" />} label="MAIOR APOSTA" value="R$ 0,00" />
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground-variant">{icon}</span>
      <div className="flex flex-col">
        <span className="text-foreground-variant text-[10px] leading-none">{label}</span>
        <span className="text-foreground text-xs font-semibold">{value}</span>
      </div>
    </div>
  )
}
