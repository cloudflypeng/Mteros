'use client'

import { Singer } from "@/store"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"
interface SingerItemProps {
  singer: Singer
  children?: React.ReactNode
}

const SingerItem: React.FC<SingerItemProps> = ({ singer, children }) => {

  const router = useRouter()

  const handleClick = () => {
    router.push(`/singer/${singer.mid}`)
  }

  return (
    <Card
      className="w-full flex items-center gap-2 rounded-lg"
      onClick={handleClick}
    >
      <Image src={singer.upic || '/next.svg'} alt={singer.uname} className="object-cover rounded-lg" width={100} height={100} />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">{singer.uname}</div>
        <div className="text-xs text-muted-foreground">{singer.usign}</div>
        <div className="flex items-center gap-2">
          <span>粉丝</span>
          <span>{singer.fans}</span>
          <span>视频</span>
          <span>{singer.videos}</span>
        </div>
      </div>
      {children}
    </Card>
  )
}

export default SingerItem
