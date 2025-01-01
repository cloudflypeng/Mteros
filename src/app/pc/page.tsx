'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Player } from '@/block/player'
import Library from '@/block/Library'
import useStore from '@/store'
import useBlockStore, { BlockType } from '@/store/block'
import { Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

import SingerDetail from '@/block/SingerDetail'
import Search from '@/block/Search'
import Collection from '@/block/Collection'

const BlockMap = {
  'SingerDetail': <SingerDetail />,
  'Search': <Search />,
  'Library': null,
  'Collection': <Collection />,
}


export default function PC() {
  const router = useRouter()

  const { userInfo } = useStore()
  const { block, setBlock } = useBlockStore()

  const closeBlock = (b: BlockType) => {
    setBlock(block.filter(item => item !== b))
  }

  const goSetting = () => {
    router.push('/setting')
  }


  return (
    <section className='pc h-screen w-screen dark bg-background text-foreground'>
      {/* header */}
      <section className='h-[3rem] w-screen bg-white/10 flex items-center px-5 gap-5'>
        <Image src={userInfo?.face || '/next.svg'} alt="avatar" width={32} height={32} className='rounded-full hover:scale-110 transition-all duration-200' />
        {/* <Button>
          安装到桌面
        </Button> */}
        <Button onClick={goSetting}>
          <Settings />
        </Button>
        <button className='text-xs' onClick={() => setBlock(['Search', 'SingerDetail'])}>
          刷新block
        </button>
      </section>
      <section className='flex h-[calc(100vh-3rem-80px)] w-[calc(100vw-0rem)] p-[1rem] gap-4'>
        <Library />
        <div className='flex-1 flex rounded-md gap-4 w-[calc(100vw-10rem)]'>
          {block.map((item, index) => (
            <div
              key={index}
              style={{
                transition: 'width 300ms ease-in-out',
                width: `calc(${100 / block.length}% - ${block.length > 1 ? '0.5rem' : '0px'})`
              }}
              className={cn(
                'bg-white/10 rounded-md relative',
                'shrink-0'  // 防止元素收缩
              )}
            >
              {BlockMap[item]}
              <div className='absolute top-1 right-2 cursor-pointer' onClick={() => closeBlock(item)}>
                <X />
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* fixed */}
      <Player />
    </section>
  )
}
