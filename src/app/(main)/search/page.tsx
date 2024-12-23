"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search as SearchIcon } from "lucide-react"
import { api } from '@/lib/apiClient'
import SongItem from "@/components/bus/SongItem";
import { addHttps } from "@/lib/utils"
import { Song } from "@/store"
import useStore from "@/store"
import { toast } from "sonner"

import Vconsole from 'vconsole'
const commonSearch = [
  { label: "周杰伦", value: "周杰伦" },
  { label: "五月天", value: "五月天" },
  { label: "林俊杰", value: "林俊杰" },
  { label: "陈奕迅", value: "陈奕迅" },
  { label: "邓紫棋", value: "邓紫棋" },
  { label: "李宗盛", value: "李宗盛" },
  { label: "王菲", value: "王菲" },
  { label: "张学友", value: "张学友" },
  { label: "王心凌", value: "王心凌" },
  { label: "蔡依林", value: "蔡依林" },
  { label: "张惠妹", value: "张惠妹" },
  { label: "孙燕姿", value: "孙燕姿" },
  { label: "梁静茹", value: "梁静茹" },
]


type SearchResult = {
  id: string
  title: string
  author: string
  cover: string
  viewCount: string
  duration: string
  pic: string
  bvid: string
  aid: string
}

const Search = () => {
  const { addSongToPlayList } = useStore()

  const [keyword, setKeyword] = useState("")
  const [videos, setVideos] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      // 这里替换成实际的 B 站 API 调用
      const data = await api.video.search(keyword)

      const newData = data.map((item: SearchResult) => ({
        id: item.id,
        name: item.title,
        artist: item.author,
        cover: addHttps(item.cover) || addHttps(item.pic),
        ids: {
          bvid: item.bvid,
          aid: item.aid,
        }
      }))
      setVideos(newData)
    } catch (error) {
      console.error("搜索失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const vconsole = new Vconsole()
    return () => {
      vconsole.destroy()
    }
  }, [])

  const handleAddToPlayList = (song: Song) => {
    addSongToPlayList(song)
    toast.success('已添加到播放列表')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex gap-2 mb-8 h-15 w-full">
        <Input
          placeholder="输入关键词搜索视频..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}

        />
        <Button onClick={handleSearch} disabled={loading}>
          <SearchIcon className="w-4 h-4 mr-2" />
          搜索
        </Button>
      </div>
      {/* 常见搜索 */}
      {videos.length === 0 && (
        <>
          <div className="text-lg font-bold min-w-20">常见搜索</div>
          <div className="flex gap-4">
            <div className="flex gap-2 flex-wrap">
              {commonSearch.map((item) => (
                <Button key={item.value} variant="outline" size="sm" onClick={() => {
                  setKeyword(item.value)
                  handleSearch()
                }}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <SongItem key={video.id} song={video} onClick={() => handleAddToPlayList(video)} />
          ))}
        </div>
      </ScrollArea>
      {loading && (
        <div className="text-center py-8">
          正在加载...
        </div>
      )}
    </div>
  )
}

export default Search
