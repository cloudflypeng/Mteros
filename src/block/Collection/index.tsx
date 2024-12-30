import useBlockStore from '@/store/block'
import useStore from '@/store'
import { Song } from '@/store'
import { api } from '@/lib/apiClient'
import { useEffect, useState } from 'react'
import SongItem from '@/components/bus/SongItem'
import { addHttps } from '@/lib/utils'
import { Play } from 'lucide-react'

interface CollectionInfo {
  id: number
  mid: number
  title: string
  cover: string
  attr: string
}

export default function Collection() {
  const { setPlayList, setCurrentSong } = useStore()
  const { currentCollectionId } = useBlockStore()

  const [info, setInfo] = useState<CollectionInfo | null>(null)
  const [videos, setVideos] = useState<Song[]>([])

  useEffect(() => {
    api.collection.getCollectionVideos(Number(currentCollectionId), 1, 20).then(res => {
      const { info, medias } = res
      setInfo(info)
      setVideos(medias.map(item => {
        return {
          id: item.bvid || item.bv_id,
          ids: {
            bvid: item.bvid || item.bv_id,
          },
          name: item.title,
          cover: addHttps(item.cover),
          artist: item.upper?.name || '',
          desc: item.intro,
        }
      }))
    })
  }, [currentCollectionId])

  const handleReplacePlayList = () => {
    setPlayList(videos)
    setCurrentSong(videos[0])
  }

  return <div className='flex flex-col gap-2 w-full h-full p-5'>
    <div className='text-2xl font-bold flex items-center gap-2'>
      {info?.title}
      <Play className='w-6 h-6 cursor-pointer' onClick={handleReplacePlayList} />
    </div>
    <div className='flex flex-col gap-2 relative flex-1'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/50 overflow-y-auto'>
        {videos.map(item => {
          return <SongItem key={item.id} song={item} />
        })}
      </div>
    </div>
  </div>
}
