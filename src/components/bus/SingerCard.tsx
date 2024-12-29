import Image from 'next/image'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface SingerCardProps {
  'cover': string
  'name': string
  'desc': number
  'size'?: 'sm' | 'md'
  onClick?: () => void
  onFollow?: () => void
}

const SingerCard = ({ cover, name, desc, onClick, onFollow, size = 'md' }: SingerCardProps) => {

  const handleClick = () => {
    onClick?.()
  }

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onFollow?.()
  }

  if (size === 'sm') {
    return (
      <div className='flex h-[4rem] w-full p-[0.5rem] rounded-md relative group hover:bg-muted/50 cursor-pointer' onClick={handleClick}>
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
        <div className="flex-1 relative left-0 top-0 transition-all duration-300 scale-100 group-hover:scale-105">
          <div className='w-full absolute truncate'>{name}</div>
          <div className='w-full absolute bottom-1 text-xs text-muted-foreground truncate'>{desc}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col hover:bg-white/10 rounded-lg p-4 pb-1 w-48 group relative" onClick={handleClick} >
      <div className="relative aspect-square w-full mb-2">
        <Image
          src={cover}
          alt={name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="text-muted-foreground opacity-80">{name}</div>
      <div className="text-muted-foreground opacity-50">{desc}</div>
      <Button className="w-14 h-14 flex items-center justify-center rounded-full bg-green-600
        absolute transition-all duration-300
        bottom-5 right-2 opacity-0 
        group-hover:opacity-100
        group-hover:bottom-10
        group-hover:right-2
       "
        onClick={handleFollow}
      >
        <Star className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default SingerCard
