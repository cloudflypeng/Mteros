import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { api } from '@/lib/apiClient'
import { addHttps } from '@/lib/utils'
import { Singer, Song } from '@/store/index'
import cn from 'classnames'
import { useIsMobile } from '@/hooks/use-mobile'

import { Button } from '@/components/ui/button'
import SongItem from '@/components/bus/SongItem'
import SingerCard from '@/components/bus/SingerCard'
import useStore from '@/store'

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


export default function Search() {

  const { addSongToPlayList } = useStore()
  const [keyword, setKeyword] = useState('')
  const [searchType, setSearchType] = useState<'song' | 'singer'>('song')
  const [singers, setSingers] = useState<Singer[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)

  const isMobile = useIsMobile()


  const handleSearchSinger = async () => {
    if (!keyword.trim()) return
    try {
      const users = await api.user.search(keyword)
      const newUsers = users.map((item: Singer) => ({
        mid: item.mid,
        uname: item.uname,
        upic: addHttps(item.upic),
        usign: item.usign,
        fans: item.fans,
        videos: item.videos
      }))
      setSingers(newUsers)
    } catch (error) {
      console.error("搜索失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSong = async () => {
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
      setSongs(newData)
    } catch (error) {
      console.error("搜索失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    if (searchType === 'song') {
      handleSearchSong()
    } else {
      handleSearchSinger()
    }
  }

  const handleAddSong = (song: Song) => {
    addSongToPlayList(song)
  }

  return <div className={cn('flex flex-col w-full h-full p-5 pt-10', isMobile ? 'pb-[50px]' : '')}>
    <Input
      placeholder='搜索'
      className='bg-white/20'
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <div className='flex flex-row gap-4 my-4'>
      <Button size='sm' className={searchType === 'song' ? '' : 'bg-white/10'} onClick={() => setSearchType('song')}>歌曲</Button>
      <Button size='sm' className={searchType === 'singer' ? '' : 'bg-white/10'} onClick={() => setSearchType('singer')}>歌手</Button>
    </div>
    <div className='flex flex-1 relative'>
      <div className='absolute top-0 left-0 w-full h-full overflow-y-auto'>
        {
          loading ? <div>loading</div>
            : searchType === 'song' ?
              songs.map((song) => <SongItem key={song.id} song={song} onClick={() => handleAddSong(song)} />)
              : singers.map((singer) => <SingerCard key={singer.mid} cover={singer.upic} name={singer.uname} desc={singer.fans} size='sm' />)}
      </div>
    </div>
  </div>
}
