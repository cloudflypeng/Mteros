"use client"

import Image from 'next/image'
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search as SearchIcon } from "lucide-react"
import { api } from '@/lib/apiClient'
import SongItem from "@/components/bus/SongItem";

interface VideoItem {
  id: string
  title: string
  cover: string
  author: string
  viewCount: string
  duration: string
  pic: string
}

const Search = () => {
  const [keyword, setKeyword] = useState("")
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      // 这里替换成实际的 B 站 API 调用
      const data = await api.video.search(keyword)
      console.log(data)
      setVideos(data)
    } catch (error) {
      console.error("搜索失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/loginlocal')
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-2 mb-8 h-15">
        <Input
          placeholder="输入关键词搜索视频..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-xl"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <SearchIcon className="w-4 h-4 mr-2" />
          搜索
        </Button>

      </div>

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <SongItem key={video.id} song={video} />
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
