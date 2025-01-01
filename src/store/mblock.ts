import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 直接定义可用的区块类型
export type BlockType = 'Search' | 'SingerDetail' | 'Library' | 'Collection'

type State = {
  blockHistory: BlockType[]
  currentSingerMid: string
  currentCollectionId: string
  setBlock: (block: BlockType) => void
  popBlock: () => void
  setCurrentSingerMid: (mid: string) => void
  setCurrentCollectionId: (id: string) => void
}

const useBlockStore = create<State>()(
  persist(
    (set, get) => ({
      blockHistory: ['Library'],
      currentSingerMid: '',
      currentCollectionId: '',

      setBlock: (block: BlockType) => set({ blockHistory: [...get().blockHistory, block] }),
      popBlock: () => {
        if (get().blockHistory.length == 1) {
          set({ blockHistory: ['Library'] })
          return
        }
        set({ blockHistory: get().blockHistory.slice(0, -1) })
      },
      setCurrentSingerMid: (mid: string) => set({ currentSingerMid: mid }),
      setCurrentCollectionId: (id: string) => set({ currentCollectionId: id }),
    }),
    {
      name: 'mblock-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useBlockStore
