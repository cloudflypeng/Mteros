"use client"
import Image from 'next/image'
import { Song } from '@/store'
import { Play } from 'lucide-react'

interface SongItemProps {
  song: Song
  onClick?: () => void
}

export default function SongItem({
  song,
  onClick
}: SongItemProps) {


  const { cover, name, artist } = song

  const clickHandler = () => {
    onClick?.()
  }

  const cleanName = name?.replace(/<[^>]*>/g, '') || ''

  return (
    <div className='flex h-[4rem] w-full p-[0.5rem] rounded-md relative group hover:bg-muted/50 cursor-pointer transition-all duration-300 translate-x-0 hover:translate-x-4' onClick={clickHandler}>
      <div className="relative aspect-square w-[3rem] mr-2">
        <Image
          src={cover}
          alt={name}
          fill
          className="object-cover rounded-full group-hover:opacity-50 transition-all duration-300 "
          sizes="(max-width: 50px) 100vw, 33vw"
        />
        <Play className="w-5 h-5 absolute top-4 left-4 opacity-0 group-hover:opacity-100" />
      </div>
      <div className="flex-1 relative left-0 top-0">
        <div className='w-full absolute truncate'>{cleanName}</div>
        <div className='w-full absolute bottom-1 text-xs text-muted-foreground truncate'>{artist}</div>
      </div>
    </div>
  )
}
