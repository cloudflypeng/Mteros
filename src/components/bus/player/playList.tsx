'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { List } from "lucide-react"
import useStore from "@/store"
import SongItem from "@/components/bus/SongItem"
import { Song } from "@/store"
import { api } from "@/lib/apiClient"


export function PlayList() {
  const { setCurrentSong, clearPlayList } = useStore()

  const { playList } = useStore()

  const playNow = async (song: Song) => {
    const url = await api.video.getPlayUrl({ bvid: song.ids.bvid as string })
    setCurrentSong({
      ...song,
      url
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>播放列表 ({playList.length})

            <Button variant="outline" size="icon" onClick={clearPlayList}>清空</Button>
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {playList.map((song) => (
            <SongItem key={song.id} song={song} size="mini" onClick={() => playNow(song)} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
