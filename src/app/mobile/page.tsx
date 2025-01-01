'use client'
import Tab from './tab'
import Library from '@/block/Library'
import Search from '@/block/Search'
import SingerDetail from '@/block/SingerDetail'
import Collection from '@/block/Collection'
import { Player } from '@/block/player'
import { useEffect } from 'react'

import useBlockStore from '@/store/mblock'
import VConsole from 'vconsole';


const blockMap = {
  'Library': <Library />,
  'Search': <Search />,
  'SingerDetail': <SingerDetail />,
  'Collection': <Collection />,
}

export default function Mobile() {
  const blockHistory = useBlockStore((state) => state.blockHistory)

  const currentBlock = blockHistory[blockHistory.length - 1]

  useEffect(() => {
    new VConsole()
  }, [])

  return (
    <section className='flex flex-col h-screen'>
      <div className='flex-1'>
        {currentBlock && blockMap[currentBlock]}
      </div>
      <Tab />
      <Player />
    </section>
  )

}
