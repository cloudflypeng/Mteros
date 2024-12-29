/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { use, useEffect, useState } from 'react'
import { api } from '@/lib/apiClient'
import { Song } from '@/store/index'
import SongItem from '@/components/bus/SongItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useStore, { Singer } from '@/store/index'
import { toast } from 'sonner'

interface Props {
  params: {
    id: string
  }
}

// 创建一个类型安全的工具函数
function useParams<T>(params: T): T {
  return use(params as any)
}

export default function SingerPage({ params }: Props) {
  const { id } = useParams(params)
  const [info, setInfo] = useState<Singer | null>(null)
  const [videos, setVideos] = useState<Song[]>([])
  const { followUsers, setFollowUsers, userInfo } = useStore()

  useEffect(() => {
    api.user.getInfo(id).then((res) => {

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
  }, [])

  useEffect(() => {
    if (!info) return
    const wbi_img = userInfo?.wbi_img
    api.user.getVideos({ mid: Number(id) }, wbi_img).then((res) => {
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

  const alreadyFollow = !!followUsers.find((user) => user.mid === info?.mid)

  const handleFollow = () => {
    if (!info) return
    setFollowUsers([...followUsers, info])
    toast.success('关注成功' + info.uname)
  }

  if (!info) return null

  return (
    <div className="flex flex-col px-4">
      <div className="flex items-center gap-2 h-[20vh] bg-yellow-700 p-10 text-white">
        <Image src={info.upic} alt='头像' width={100} height={100} className="rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold flex items-center gap-2">
            {info.uname}
            {/* 关注 */}
            <Button size="sm" disabled={alreadyFollow} onClick={handleFollow}>{alreadyFollow ? '已关注' : '关注'}</Button>
          </div>
          <div className="text-sm text-muted-foreground text-white">{info.usign}</div>
        </div>
      </div>
      {/* 歌曲 */}
      <ScrollArea className="h-[80vh]">
        <div className="flex flex-col gap-2">
          {videos.map((item) => (
            <SongItem key={item.id} song={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
