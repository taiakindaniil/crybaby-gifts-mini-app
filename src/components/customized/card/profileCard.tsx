import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function ProfileCard() {
  return (
    <Card className="w-fit h-auto flex justify-center my-4 p-0 border-0 shadow-none">
      <CardContent className="inline-flex items-center border border-secondary rounded-2xl px-3 py-2 shadow-none">
        <Avatar className="rounded-none w-6 h-6 mr-2">
          <AvatarImage src="" alt="asas" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <CardTitle>@taiakin • 0.00 TON •</CardTitle>
        <span className="ml-1 text-orange-500 font-bold text-sm">🎁 0</span>
      </CardContent>
    </Card>
  )
}