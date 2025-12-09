import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface CollectionCardProps {
  title: string
  description: string
  imageUrl: string
  price: string
  percentageChange: string
  percentageChangeColor?: 'positive' | 'negative' | 'neutral'
  onClick?: () => void
}

export default function CollectionCard({
  title,
  description,
  imageUrl,
  price,
  percentageChange,
  percentageChangeColor = 'neutral',
  onClick
}: CollectionCardProps) {
  const getPercentageColor = () => {
    switch (percentageChangeColor) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <Card className="py-2.5 my-1.5 border-0 shadow-none cursor-pointer hover:bg-secondary transition-colors" onClick={onClick}>
      <CardContent className="flex items-center">
        <Avatar className="rounded-none w-10 h-10 mr-3">
          <AvatarImage src={imageUrl} alt={title} />
          <AvatarFallback>{title.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-col ml-auto">
          <span>{price}</span>
          <span className={`text-sm text-muted-foreground ${getPercentageColor()}`}>{percentageChange}</span>
        </div>
      </CardContent>
    </Card>
  )
}