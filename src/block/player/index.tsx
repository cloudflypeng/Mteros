'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { SkipBack, SkipForward, Play, Pause, Volume } from 'lucide-react'
import { SongInfo } from './songInfo'
import useStore from '@/store'
import { useEffect } from 'react'
import { Howl } from 'howler'
import { Song } from '@/store'
import { api } from '@/lib/apiClient'
import { htmlToString } from '@/lib/utils'
import { useIsMobile } from "@/hooks/use-mobile"

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function Player() {

  const { currentSong, playList, setCurrentSong, setUserInfo } = useStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [howl, setHowl] = useState<Howl | null>(null)
  const [init, setInit] = useState(true)

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timmer, setTimmer] = useState<NodeJS.Timeout | null>(null)
  const [volume, setVolume] = useState(1)

  const isMobile = useIsMobile()

  useEffect(() => {
    api.user.getCurrentUserInfo().then(data => {
      console.log(data)
      setUserInfo(data)
    })
  }, [])

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
    song.url = await api.video.getPlayUrl({ bvid: song.ids.bvid as string })
    // alert(song.url)
    // 在前端使用
    if (song.url) {
      song.url = `/api/proxymedia?url=${encodeURIComponent(song.url)}`
    }

    howl?.stop()
    howl?.unload()
    setHowl(null)
    if (!song.url) {
      return
    }
    if (timmer) {
      clearInterval(timmer)
      setTimmer(null)
    }
    setSystemMedia(song)

    const response = await fetch(song.url, { credentials: 'include' })
    console.log(response)
    const audioUrl = URL.createObjectURL(await response.blob())

    const newHowl = new Howl({
      src: [audioUrl],
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
    // 绑定系统媒体按键
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      prevSong()
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      nextSong()
    })
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

  if (isMobile) {
    return (
      <section className="fixed bottom-[50px] shadow-lg rounded-md mx-[1rem] w-[calc(100%-2rem)] bg-gray-700 h-[60px] z-50 flex items-center">
        {/* 图片 */}
        <Image
          id="curcover"
          src={currentSong?.cover || '/next.svg'}
          alt="cover"
          className="rounded-md object-cover ml-4"
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

  return (
    <section
      className="fixed bottom-0 left-0 right-0 w-screen z-50
       backdrop-blur-sm bg-black/10 dark:bg-white/10 h-[80px] flex items-center"
    >
      {/* center 歌曲信息 */}
      <SongInfo />
      <div className="px-4 w-[40vw] flex-shrink-0 flex-grow-0 flex flex-col">
        {/* 操作 按钮 */}
        <div className="flex justify-center gap-4 translate-y--1">
          {/* 上一首 */}
          <SkipBack className="h-10 cursor-pointer" onClick={prevSong} />
          {/* 播放/暂停 */}
          <div className='bg-white/10 hover:bg-white/20 transition-all duration-200 rounded-full w-10 h-10 flex items-center justify-center'>
            {isPlaying ? <Pause className="h-6 w-6 cursor-pointer " onClick={togglePlay} /> : <Play className="h-6 w-6 cursor-pointer" onClick={togglePlay} />}
          </div>
          {/* 下一首 */}
          <SkipForward className="h-10 cursor-pointer" onClick={nextSong} />
        </div>
        {/* 进度条 */}
        <div className="flex items-center gap-2">
          <span>{formatTime(progress)}</span>
          <Slider
            className="w-full"
            value={[progress]} max={duration} onValueChange={(value) => {
              if (howl) {
                howl.pause()
                howl.seek(value[0])
                howl.play()
              }
            }} />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* right 音量和歌单 */}
      <div className="flex items-center flex-row-reverse gap-2 pr-6 w-[30vw] flex-1">
        <VolumeSlider howl={howl} volume={volume} setVolume={setVolume} />
        <Volume />
      </div>
    </section>)
}

function VolumeSlider({ howl, volume, setVolume }: { howl: Howl | null, volume: number, setVolume: (volume: number) => void }) {

  useEffect(() => {
    if (howl) {
      howl.volume(volume)
    }
  }, [volume, howl])

  return <div className="transition-all duration-200 rounded-full w-[150px] h-10 flex items-center justify-center">
    <Slider
      className="w-full"
      value={[volume]}
      min={0}
      max={1}
      step={0.1}
      onValueChange={(value) => {
        setVolume(value[0])
      }}
    />
  </div>
}

