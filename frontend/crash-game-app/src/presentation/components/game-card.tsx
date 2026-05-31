type GameCardProps = {
  title: string
  description: string
  imageUrl: string
  onClick?: () => void
}

export function GameCard({
  title,
  description,
  imageUrl,
  onClick,
}: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-golden max-w-sm h-full shrink-0 text-white p-4 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105"
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
    </div>
  )
}
