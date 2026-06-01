type GameCardProps = {
  title: string
  description: string
  imageUrl: string
  disabled?: boolean
  onClick?: () => void
}

export function GameCard({
  title,
  description,
  imageUrl,
  disabled = false,
  onClick,
}: GameCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative bg-golden w-60 md:w-90 h-full shrink-0 text-white p-3 rounded-xl shadow-lg transition-transform ${
        disabled
          ? 'opacity-40 grayscale cursor-not-allowed'
          : 'cursor-pointer hover:scale-105'
      }`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full object-cover rounded-t-xl"
      />
      <div>
        <h2 className="text-xl font-bold mt-2 text-primary">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
      {disabled && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 rounded-xl">
          <span className="text-xs font-semibold text-white/70 bg-black/50 px-3 py-1 rounded-full">
            Em breve
          </span>
        </div>
      )}
    </div>
  )
}
