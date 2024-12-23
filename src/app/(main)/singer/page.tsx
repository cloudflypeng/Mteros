

'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { api } from '@/lib/apiClient'
import { useState } from 'react'
import { addHttps } from '@/lib/utils'

type Singer = {
  mid: number
  uname: string
  upic: string
  usign: string
  fans: number
  videos: number
}

export default function SingerPage() {

  const [keyword, setKeyword] = useState('')
  const [singers, setSingers] = useState<Singer[]>([])

  const handleSearch = async () => {
    const list = await api.user.search(keyword)
    setSingers(list.map((item: Singer) => ({
      mid: item.mid,
      uname: item.uname,
      upic: addHttps(item.upic),
      usign: item.usign,
      fans: item.fans,
      videos: item.videos
    })))
  }

  return (
    <div className="container py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="搜索歌手"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <ScrollArea className="h-screen pb-[80px]">
        {/* 歌手卡片占位 */}
        <div className="flex gap-5 flex-wrap w-full mb-[100px]">
          {singers.map((singer) => (
            <Card
              key={singer.mid}
              className="w-full flex items-center gap-2 rounded-lg"
            >
              <Image src={singer.upic} alt={singer.uname} className="object-cover rounded-lg" width={100} height={100} />
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold">{singer.uname}</div>
                <div className="text-xs text-muted-foreground">{singer.usign}</div>
                <div className="flex items-center gap-2">
                  <span>粉丝</span>
                  <span>{singer.fans}</span>
                  <span>视频</span>
                  <span>{singer.videos}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </ScrollArea>
    </div>
  )
}
