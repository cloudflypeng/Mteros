"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Search as SearchIcon } from "lucide-react"
import { toast } from "sonner"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { api } from '@/lib/apiClient'
import { addHttps } from "@/lib/utils"
import { Song, Singer } from "@/store"
import useStore from "@/store"
import SongItem from "@/components/bus/SongItem"
import SingerCard from "@/components/bus/SingerCard"

import Vconsole from 'vconsole'

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
  const { addSongToPlayList, setFollowUsers, followUsers } = useStore()
  const router = useRouter()

  const [keyword, setKeyword] = useState("")
  const [videos, setVideos] = useState<Song[]>([])
  const [users, setUsers] = useState<Singer[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'video' | 'bili_user'>('video')

  const handleSearchVideo = async () => {
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
  const handleSearchUser = async () => {
    if (!keyword.trim()) return
    const users = await api.user.search(keyword)
    const newUsers = users.map((item: Singer) => ({
      mid: item.mid,
      uname: item.uname,
      upic: addHttps(item.upic),
      usign: item.usign,
      fans: item.fans,
      videos: item.videos
    }))
    setUsers(newUsers)
    setLoading(true)
  }

  const handleSearch = () => {
    if (searchType === 'video') {
      handleSearchVideo()
    } else {
      handleSearchUser()
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

  const handleSearchTypeChange = (value: 'video' | 'bili_user') => {
    if (value === 'video') {
      setSearchType('video')
      if (keyword) {
        handleSearchVideo()
      }
    } else {
      setSearchType('bili_user')
      if (keyword) {
        handleSearchUser()
      }
    }
  }

  const handleFollow = (user: Singer) => {
    // 校验是否已关注
    const isFollowed = followUsers.some(u => u.mid === user.mid)
    if (isFollowed) {
      toast.error('已关注')
      return
    }
    setFollowUsers([...followUsers, user])
    toast.success('关注成功' + user.uname)
  }

  const handleUserClick = (user: Singer) => {
    router.push(`/singer/${user.mid}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 w-screen">
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
      {/* 切换搜索的类型 */}
      <Tabs defaultValue="video" value={searchType} onValueChange={handleSearchTypeChange as (value: string) => void}>
        <TabsList>
          <TabsTrigger value="video">视频</TabsTrigger>
          <TabsTrigger value="bili_user">用户</TabsTrigger>
        </TabsList>
        <TabsContent value="video">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-4 w-full">
              {videos.map((video) => (
                <SongItem key={video.id} song={video} onClick={() => handleAddToPlayList(video)} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="bili_user">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="flex flex-wrap gap-4">
              {users.map((user) => (
                <SingerCard key={user.mid} cover={user.upic} name={user.uname} desc={user.fans} onClick={() => handleUserClick(user)} onFollow={() => handleFollow(user)} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      {/* 常见搜索 */}

      {loading && (
        <div className="text-center py-8">
          正在加载...
        </div>
      )}
    </div>
  )
}

export default Search
