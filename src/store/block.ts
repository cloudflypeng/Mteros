import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 直接定义可用的区块类型
export type BlockType = 'Search' | 'SingerDetail' | 'Library' | 'Collection'

type State = {
  block: BlockType[]
  currentSingerMid: string
  currentCollectionId: string
  setBlock: (block: BlockType[]) => void
  setCurrentSingerMid: (mid: string) => void
  setCurrentCollectionId: (id: string) => void
}

const useBlockStore = create<State>()(
  persist(
    (set) => ({
      block: ['Search', 'SingerDetail'],
      currentSingerMid: '',
      currentCollectionId: '',

      setBlock: (block: BlockType[]) => set({ block }),
      setCurrentSingerMid: (mid: string) => set({ currentSingerMid: mid }),
      setCurrentCollectionId: (id: string) => set({ currentCollectionId: id }),
    }),
    {
      name: 'block-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useBlockStore
