'use client'

import Image from "next/image"
import { ArrowUpDown } from "lucide-react"
import useStore from "@/store"

export function SongInfo() {

  const { currentSong } = useStore()

  return (
    <div className="flex items-center gap-4 w-1/3 min-w-[120px] h-[calc(100%-16px)] bg-background/80 backdrop-blur px-3 py-1 rounded-md">
      {/* 主要信息 */}
      <div className="relative shrink-0 cursor-pointer group">
        <Image
          id="curcover"
          src={currentSong?.cover || '/next.svg'}
          alt="cover"
          className="rounded-md object-cover"
          width={80}
          height={80}
        />
        <div className="absolute inset-0 bg-black/30 justify-center items-center hidden group-hover:flex">
          <ArrowUpDown className="h-6 w-6 text-gray-300" />
        </div>
      </div>

      <div className="truncate flex-1">
        <div className="text-sm text-bold truncate" dangerouslySetInnerHTML={{ __html: currentSong?.name || '暂无歌曲' }}></div>
        <div className="text-sm text-muted-foreground">{currentSong?.artist || '暂无歌手'}</div>
      </div>
    </div>
  )
}
