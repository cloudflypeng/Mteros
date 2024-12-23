'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { SongInfo } from './songInfo'
import { PlayList } from './playList'
import useStore from '@/store'
import { useEffect } from 'react'
import { Howl } from 'howler'
import { Song } from '@/store'
import { api } from '@/lib/apiClient'
import { htmlToString } from '@/lib/utils'
import { useMediaQuery } from 'react-responsive'

export function Player() {

  const { currentSong, playList, setCurrentSong } = useStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [howl, setHowl] = useState<Howl | null>(null)
  const [init, setInit] = useState(true)

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timmer, setTimmer] = useState<NodeJS.Timeout | null>(null)

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const setSystemMedia = async (song: Song) => {
    if ('mediaSession' in navigator && song) {
      const imgDom = document.getElementById('curcover') as HTMLImageElement
      const cover = imgDom.src
      navigator.mediaSession.metadata = new MediaMetadata({
        title: htmlToString(song.name),
        artist: song.artist,
        artwork: [
          {
            src: cover,
            sizes: '192x192',
            type: 'image/jpeg'
          }
        ]
      })
    }
  }

  const startPlay = async (song: Song) => {
    if (!song.url) {
      song.url = await api.video.getPlayUrl({ bvid: song.ids.bvid as string })
      console.log('song.url', song.url)
    }

    howl?.stop()
    howl?.unload()
    setHowl(null)

    setSystemMedia(song)

    const newHowl = new Howl({
      src: song.url,
      html5: true,
      volume: 1,
      mute: false,
      onplay: () => {
        setIsPlaying(true)
        setDuration(newHowl.duration())
        setTimmer(setInterval(() => {
          setProgress(newHowl.seek())
        }, 1000))
      },
      onpause: () => {
        setIsPlaying(false)
        if (timmer) {
          clearInterval(timmer)
          setTimmer(null)
        }
      }
    })
    setHowl(newHowl)
    newHowl.play()

  }

  useEffect(() => {
    if (timmer) {
      clearInterval(timmer)
      setTimmer(null)
    }
    console.log('currentSong')
    if (currentSong && !init) {
      startPlay(currentSong)
    }
  }, [currentSong])

  useEffect(() => {
    setTimeout(() => {
      setInit(false)
      console.log('init', init)
    }, 1000)
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      howl?.pause()
      setIsPlaying(false)
    } else {
      howl?.play()
      if (!howl && currentSong) {
        startPlay(currentSong)
      }
      setIsPlaying(true)
    }
  }

  const prevSong = () => {
    const index = playList.findIndex((song) => song.id === currentSong?.id)
    if (index !== -1) {
      setCurrentSong(playList[(index - 1 + playList.length) % playList.length])
    }
  }

  const nextSong = () => {
    const index = playList.findIndex((song) => song.id === currentSong?.id)
    if (index !== -1) {
      setCurrentSong(playList[(index + 1) % playList.length])
    }
  }

  if (isMobile) {
    return (
      <section className="fixed bottom-[2rem] shadow-lg rounded-full mx-[1rem] w-[calc(100%-2rem)] bg-yellow-400 h-[60px] z-50 flex items-center">
        {/* 图片 */}
        <Image
          id="curcover"
          src={currentSong?.cover || '/next.svg'}
          alt="cover"
          className="rounded-full object-cover ml-4"
          width={60}
          height={40}
        />
        {/* 歌曲信息 */}
        <div className="flex flex-col px-2 truncate">
          <div className="text-sm font-bold truncate" dangerouslySetInnerHTML={{ __html: htmlToString(currentSong?.name || '') }}></div>
          <div className="text-xs text-muted-foreground truncate" dangerouslySetInnerHTML={{ __html: htmlToString(currentSong?.artist || '') }}></div>
        </div>
        {/* left 操作 */}
        <div className="px-4 flex">
          {/* 上一首 */}
          <Button variant="ghost" size="icon" onClick={prevSong}>
            <SkipBack />
          </Button>
          {/* 播放/暂停 */}
          <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          {/* 下一首 */}
          <Button variant="ghost" size="icon" onClick={nextSong}>
            <SkipForward />
          </Button>
        </div>
      </section>
    )
  }



  return <section className="fixed bottom-0 left-0 right-0 w-screen bg-background h-[80px] z-50 flex items-center">
    {/* left 操作 */}
    <div className="px-4">
      {/* 上一首 */}
      <Button variant="ghost" size="icon" onClick={prevSong}>
        <SkipBack />
      </Button>
      {/* 播放/暂停 */}
      <Button variant="ghost" size="icon" onClick={togglePlay}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      {/* 下一首 */}
      <Button variant="ghost" size="icon" onClick={nextSong}>
        <SkipForward />
      </Button>
    </div>
    {/* center 歌曲信息 */}
    <SongInfo />
    {/* right 音量和歌单 */}
    <PlayList />
    <Slider
      className="w-full top-0 absolute"
      value={[progress]} max={duration} onValueChange={(value) => {
        if (howl) {
          howl.pause()
          howl.seek(value[0])
          howl.play()
        }
      }} />
  </section>
}

