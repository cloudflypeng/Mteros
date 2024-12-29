import useBlockStore from '@/store/block'
import useStore, { Singer, Song } from '@/store'
import { useEffect, useState } from 'react'
import { api } from '@/lib/apiClient'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import SongItem from '@/components/bus/SongItem'

export default function SingerDetail() {
  const { currentSingerMid } = useBlockStore()
  const [info, setInfo] = useState<Singer | null>(null)
  const [videos, setVideos] = useState<Song[]>([])
  const { followUsers, setFollowUsers, userInfo, setCurrentSong } = useStore()

  useEffect(() => {
    api.user.getInfo(currentSingerMid).then((res) => {

      const newInfo: Singer = {
        mid: res.card.mid,
        uname: res.card.name,
        upic: res.card.face,
        usign: res.card.sign,
        fans: res.card.fans,
        videos: res.card.videos,
      }
      setInfo(newInfo)
    })
  }, [currentSingerMid])

  useEffect(() => {
    if (!info) return
    const wbi_img = userInfo?.wbi_img
    api.user.getVideos({ mid: Number(currentSingerMid) }, wbi_img).then((res) => {
      console.log(res, 'res')
      const list = res.vlist?.map((item: any): Song => ({
        id: item.bvid,
        name: item.title,
        cover: item.pic,
        artist: item.author,
        url: '',
        ids: {
          bvid: item.bvid,
        }
      })) || []
      setVideos(list)
    })
  }, [info])

  // const handleFollow = () => {
  //   if (!info) return
  //   setFollowUsers([...followUsers, info])
  //   toast.success('关注成功' + info.uname)
  // }

  const clickSong = (song: Song) => {
    console.log(song, 'song')
    setCurrentSong(song)
  }



  return <div className='flex flex-col w-full h-full rounded-md overflow-hidden'>
    <div className="flex items-center gap-2 h-[20vh] bg-yellow-700 p-10 text-white">
      <Image src={info?.upic || ''} alt='头像' width={100} height={100} className="rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold flex items-center gap-2">
          {info?.uname || ''}
          {/* 关注 */}
        </div>
        <div className="text-sm text-muted-foreground text-white">{info?.usign || ''}</div>
      </div>
    </div>
    {/* 歌曲 */}
    <div className='flex relative flex-1 w-full h-full'>
      <div className="flex flex-col gap-2 absolute top-0 left-0 w-full h-full overflow-auto">
        <div className='px-2'>
          {videos.map((item) => (
            <SongItem key={item.id} song={item} onClick={() => clickSong(item)} />
          ))}
        </div>
      </div>
    </div>
  </div>
}
