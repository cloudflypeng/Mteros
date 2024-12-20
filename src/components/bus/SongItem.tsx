"use client"

import Image from 'next/image'
import cn from 'classnames'

interface SongItemProps {
  song: {
    cover: string
    title: string 
    author: string
    pic: string
  }
  size?: 'default' | 'mini'
}

export default function SongItem({
  song,
  size = 'default'
}: SongItemProps) {
  const { cover, title, author, pic } = song
  let url = pic || cover || '/next.svg'
  if(url.startsWith('//')) {
    url = `https:${url}`
  }


  const styleBySize = size === 'mini' ? {
    wrapper: 'grid-cols-[5.5rem_1fr_90px]',
    title: 'text-[12px] font-bold w-full truncate',
    img: 'h-11 rounded-2 object-cover'
  } : {
    wrapper: 'grid-cols-[5.5rem_1fr_90px]', 
    title: 'text-[16px] font-bold truncate',
    img: 'h-11 rounded-2 object-cover'
  }

  return (
    <div className={cn('flex gap-3 h-15', styleBySize.wrapper)}>
      <Image 
        src={url}
        alt={title}
        width={88}
        height={44}
        className={styleBySize.img}
      />
      <div className="w-full overflow-auto" title={title}>
        <div className="h-15 pt-1">
          <div 
            className={styleBySize.title}
            dangerouslySetInnerHTML={{__html: title}}
          />
          <div className="flex gap-2">
            <span className="text-xs opacity-50">
              {author}
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
