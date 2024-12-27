"use client"
import Image from 'next/image'
import cn from 'classnames'
import { Song } from '@/store'

interface SongItemProps {
  song: Song
  size?: 'default' | 'mini'
  onClick?: () => void
}

export default function SongItem({
  song,
  size = 'default',
  onClick
}: SongItemProps) {


  const { cover, name, artist } = song

  const clickHandler = () => {
    onClick?.()
  }


  const styleBySize = size === 'mini' ? {
    wrapper: 'grid-cols-[5.5rem_1fr_90px]',
    title: 'text-[12px] font-bold truncate',
    img: 'h-11 w-[44px]'
  } : {
    wrapper: 'grid-cols-[5.5rem_1fr_90px]',
    title: 'text-[16px] font-bold truncate',
    img: 'h-11 w-[44px]'
  }

  return (
    <div className={cn('flex gap-3 h-15 w-full mb-3', styleBySize.wrapper)} onClick={clickHandler}>
      <Image
        src={cover}
        alt={name}
        width={44}
        height={44}
        className={cn(styleBySize.img, 'rounded-sm object-cover')}
        style={{ width: 'auto', height: 'auto' }}
      />
      <div className="w-full overflow-auto" title={name}>
        <div className="h-15 pt-1">
          <div
            className={styleBySize.title}
            dangerouslySetInnerHTML={{ __html: name }}
          />
          <div className="flex gap-2">
            <span className="text-xs opacity-50">
              {artist}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .song-item {
          display: grid;
          overflow: hidden;
          align-items: center;
          flex-shrink: 0;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  )
}
