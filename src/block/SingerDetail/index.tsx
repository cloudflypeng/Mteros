import useBlockStore from '@/store/block'
import { Singer, Song } from '@/store'
import { useEffect, useState } from 'react'
import { api } from '@/lib/apiClient'
import Image from 'next/image'
import SongItem from '@/components/bus/SongItem'
import useStore from '@/store'
import { useInView } from 'react-intersection-observer'
import { PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Vlist {
  bvid: string
  title: string
  pic: string
  author: string
}

export default function SingerDetail() {
  const { userInfo, setCurrentSong, setPlayList } = useStore()
  const { currentSingerMid } = useBlockStore()
  const [info, setInfo] = useState<Singer | null>(null)

  // index代表页数
  const [content, setContent] = useState<Song[][]>([])

  const renderContent = content.flat()

  const [page, setPage] = useState({
    ps: 20,
    pn: 1,
  })

  const resetPage = () => {
    setPage({
      ps: 20,
      pn: 1,
    })
  }

  // 添加加载状态
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 添加 intersection observer
  const { ref, inView } = useInView()

  useEffect(() => {
    resetPage()
    if (!currentSingerMid) return
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
      setTimeout(() => {
        getVideos()
      }, 1000)
    })
  }, [currentSingerMid])

  // 修改获取视频的函数
  const getVideos = async () => {
    console.log('getVideos', info, loading, hasMore)
    if (!info || loading || !hasMore) return

    const wbi_img = userInfo?.wbi_img
    if (!wbi_img) return

    setLoading(true)
    try {
      const res = await api.user.getVideos({ mid: Number(currentSingerMid), ps: page.ps, pn: page.pn }, wbi_img)
      const list = res.vlist?.map((item: Vlist): Song => ({
        id: item.bvid,
        name: item.title,
        cover: item.pic,
        artist: item.author,
        url: '',
        ids: {
          bvid: item.bvid,
        }
      })) || []

      if (list.length < page.ps) {
        setHasMore(false)
      }

      const newContent = [...content]
      newContent[page.pn - 1] = list
      setContent(newContent)
      setPage(prev => ({ ...prev, pn: prev.pn + 1 }))
    } finally {
      setLoading(false)
    }
  }

  // 添加监听滚动的 effect
  useEffect(() => {
    if (inView) {
      getVideos()
    }
  }, [inView, info])

  // const handleFollow = () => {
  //   if (!info) return
  //   setFollowUsers([...followUsers, info])
  //   toast.success('关注成功' + info.uname)
  // }

  const clickSong = (song: Song) => {
    console.log(song, 'song')
    setCurrentSong(song)
  }

  // 添加播放全部函数
  const playAll = () => {
    if (renderContent.length === 0) return
    // 设置播放列表
    setPlayList(renderContent)
    // 播放第一首歌
    setCurrentSong(renderContent[0])
  }

  return <div className='flex flex-col w-full h-full rounded-md overflow-hidden'>
    <div className="flex items-center gap-2 h-[20vh] bg-yellow-700 p-10">
      <Image src={info?.upic || '/next.svg'} alt='头像' width={100} height={100} className="rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold flex items-center gap-2">
          {info?.uname || ''}
          <Button
            onClick={playAll}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlayCircle className="w-4 h-4" />
            <span>播放全部</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground text-white">{info?.usign || ''}</div>
      </div>
    </div>
    {/* 歌曲 */}
    <div className='flex relative flex-1 w-full h-full'>
      <div className="flex flex-col gap-2 absolute top-0 left-0 w-full h-full overflow-auto">
        <div className='px-2'>
          {renderContent.map((item) => (
            <SongItem key={item.id} song={item} onClick={() => clickSong(item)} />
          ))}

          {/* 加载更多的触发器 */}
          <div ref={ref} className="h-10 flex items-center justify-center">
            {loading ? (
              <p className="text-muted-foreground">加载中...</p>
            ) : hasMore ? (
              <p className="text-muted-foreground">向下滚动加载更多</p>
            ) : (
              <p className="text-muted-foreground">没有更多了</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
}
