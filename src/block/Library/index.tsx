import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useStore, { Song, Singer } from '@/store'
import { useTransition, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/apiClient'

import { ScrollArea } from '@/components/ui/scroll-area'
import SongItem from '@/components/bus/SongItem'
import SingerCard from '@/components/bus/SingerCard'
import ColllectionItem from '@/components/bus/Colllection'
import CreateCollection from './create'

import useBlockStore from '@/store/block'

export default function Library() {

  const { playList, setCurrentSong, followUsers, userInfo, collection, setCollection } = useStore()
  const { block, setBlock, setCurrentSingerMid, setCurrentCollectionId } = useBlockStore()
  const [isPending, startTransition] = useTransition()

  // 获取收藏夹
  useEffect(() => {
    startTransition(() => {
      const mid = userInfo?.mid as number
      api.collection.getCollection(mid).then(res => {
        setCollection(res)
      })
    })
  }, [userInfo])

  const clickSong = (song: Song) => {
    setCurrentSong(song)
  }

  const clickSinger = (singer: Singer) => {

    if (block.length === 1) {
      setBlock(['SingerDetail'])
      setCurrentSingerMid(String(singer.mid))
    } else {
      // 判断是否已经存在
      if (block.includes('SingerDetail')) {
        setCurrentSingerMid(String(singer.mid))
      } else {
        // 替换掉第二个
        setBlock([...block.slice(0, 1), 'SingerDetail'])
        setCurrentSingerMid(String(singer.mid))
      }
    }

  }

  const clickCollection = (id: string) => {
    setCurrentCollectionId(id)
    const newBlock = [...block]
    newBlock[newBlock.length - 1] = 'Collection'
    setBlock(newBlock)
  }

  return <section className="w-96 bg-black/3 h-[calc(100vh-5rem-80px)] rounded-md bg-white/10">
    <div className="title flex justify-between items-center px-5 py-2 h-[3rem]">
      <h1>我的音乐</h1>
      <CreateCollection />
    </div>
    {/* 标签切换 */}
    <Tabs defaultValue="playlist" className="w-full flex-1">
      <TabsList className="grid w-[70%] h-[2rem] ml-5 grid-cols-3">
        <TabsTrigger className='text-xs' value="collection">收藏夹</TabsTrigger>
        <TabsTrigger className='text-xs' value="playlist">播放列表</TabsTrigger>
        <TabsTrigger className='text-xs' value="follow">关注歌手</TabsTrigger>
      </TabsList>
      <TabsContent value="playlist">
        <ScrollArea className="h-[calc(100vh-12rem-80px)] px-3">
          <div className="px-2">
            {playList.map(item => <SongItem key={item.id} song={item} onClick={() => clickSong(item)} />)}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="collection">
        <ScrollArea className="h-[calc(100vh-12rem-80px)] px-3">
          <div className="px-2">
            {isPending && <div className="flex items-center justify-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>}
            {!isPending && collection.map(item => <ColllectionItem key={item.id} collention={item} onClick={() => clickCollection(String(item.id))} />)}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="follow">
        <ScrollArea className="h-[calc(100vh-12rem-80px)] px-3">
          <div className="px-2">
            {followUsers.map(item => <SingerCard key={item.mid} cover={item.upic} name={item.uname} desc={item.fans} size='sm' onClick={() => clickSinger(item)} />)}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  </section>
}
