import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Song = {
  id: string
  name: string
  artist: string
  cover: string
  ids: Record<string, string | number>
  url: string
}
export type Singer = {
  mid: number
  uname: string
  upic: string
  usign: string
  fans: number
  videos: number
}

type UserInfo = {
  id: string
  name: string
  avatar: string
}

type State = {
  userInfo: UserInfo | null
  playList: Song[]
  currentSong: Song | null
  // 关注的用户
  followUsers: Singer[]

  setCurrentSong: (song: Song) => void
  addSongToPlayList: (song: Song) => void
  removeSongFromPlayList: (song: Song) => void
  clearPlayList: () => void
}

const useStore = create<State>()(
  persist(
    (set) => ({
      userInfo: null,
      playList: [],
      currentSong: null,
      followUsers: [],
      setCurrentSong: (song: Song) => set({ currentSong: song }),
      addSongToPlayList: (song: Song) => {
        set(state => {
          if (state.playList.find(item => item.id === song.id)) {
            return state
          }
          return {
            currentSong: song,
            playList: [...state.playList, song]
          }
        })
      },
      removeSongFromPlayList: (song: Song) => set((state) => ({ playList: state.playList.filter((item) => item.id !== song.id) })),
      clearPlayList: () => set({ playList: [] }),
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore
