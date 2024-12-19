"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  cover: string
  author: string
  viewCount: string
  duration: string
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
      const response = await fetch(`/api/bilibili/search?keyword=${encodeURIComponent(keyword)}`)
      const data = await response.json()
      setVideos(data.videos)
    } catch (error) {
      console.error("搜索失败:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-2 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border rounded-lg overflow-hidden">
            <img 
              src={video.cover} 
              alt={video.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium line-clamp-2">{video.title}</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>{video.author}</p>
                <div className="flex justify-between">
                  <span>{video.viewCount}播放</span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          正在加载...
        </div>
      )}
    </div>
  )
}

export default Search
