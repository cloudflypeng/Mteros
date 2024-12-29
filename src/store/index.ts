import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Song = {
  id: string
  name: string
  artist: string
  cover: string
  ids: Record<string, string | number>
  url?: string
}
export type Singer = {
  mid: number
  uname: string
  upic: string
  usign: string
  fans: number
  videos: number
}

export type UserInfo = {
  isLogin: boolean
  email_verified: number
  face: string
  mid: number
  mobile_verified: number
  money: number
  uname: string
  vipStatus: number
  vipType: number
  wbi_img: {
    img_url: string
    sub_url: string
  }
}

export interface CollectionItem {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  fav_state: number
  media_count: number
}

type State = {
  userInfo: UserInfo | null
  playList: Song[]
  currentSong: Song | null
  // 关注的用户
  followUsers: Singer[]
  // 收藏的歌单
  collection: CollectionItem[]

  setCollection: (collection: CollectionItem[]) => void
  setUserInfo: (userInfo: UserInfo) => void
  setFollowUsers: (users: Singer[]) => void
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
      collection: [],

      setCollection: (collection: CollectionItem[]) => set({ collection }),

      setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
      setFollowUsers: (users: Singer[]) => set({ followUsers: users }),
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
