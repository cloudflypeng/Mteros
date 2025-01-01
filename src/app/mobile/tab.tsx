
import { Search, Star, ListMusic } from 'lucide-react'
import useBlockStore, { BlockType } from '@/store/mblock'

const Tab = () => {

  const { setBlock } = useBlockStore()

  const clickTab = (block: BlockType) => {
    setBlock(block)
  }

  return (
    <section className='fixed bottom-0 left-0 right-0 h-[50px]'>
      <div className='flex justify-between items-center h-full px-10'>
        <Search onClick={() => clickTab('Search')} />
        <Star onClick={() => clickTab('Library')} />
        <ListMusic onClick={() => clickTab('Library')} />
      </div>
    </section>
  )
}

export default Tab
