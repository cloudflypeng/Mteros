'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { X, Plus } from 'lucide-react'
import { api } from '@/lib/apiClient'
import { addHttps } from '@/lib/utils'
import useStore, { Singer } from '@/store/index'
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

export default function SingerPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const { followUsers, setFollowUsers } = useStore()
  const [users, setUsers] = useState<Singer[]>([])
  const [keyword, setKeyword] = useState('')

  const removeFollowUser = (user: Singer) => {
    setFollowUsers(followUsers.filter((u) => u.mid !== user.mid))
    toast.success(`${user.uname}已取消关注`)
  }

  const gotoSinger = (mid: number) => {
    router.push(`/singer/${mid}`)
  }

  const handleSearch = async () => {
    console.log('搜索')
    const users = await api.user.search(keyword)
    const newUsers = users.map((item: Singer) => ({
      mid: item.mid,
      uname: item.uname,
      upic: addHttps(item.upic),
      usign: item.usign,
      fans: item.fans,
      videos: item.videos
    }))
    setUsers(newUsers)
  }

  if (isMobile) {
    return <div className="h-[calc(100vh-130px)]">
      <Drawer>
        <DrawerTrigger>
          <h1 className="text-[20px] font-bold px-5 flex items-center gap-2">关注歌手 <Plus className="w-5 h-5" /></h1>
        </DrawerTrigger>
        <DrawerContent className='h-[60vh] p-5'>
          <DrawerTitle className='text-2xl font-bold'>搜索歌手</DrawerTitle>
          <Input placeholder="搜索歌手" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <ScrollArea className="h-[calc(100%-30px)">
            <div className="flex flex-col gap-3">
              {users.map((user) => (
                <SingerCardMobile key={user.mid} user={user} onClick={gotoSinger} />
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
      <ScrollArea className="h-[calc(100%-30px)]">
        <div className="flex flex-col gap-3 flex-wrap p-5 pb-[80px]">
          {followUsers.map((user) => (
            <SingerCardMobile key={user.mid} user={user} onClick={gotoSinger} onRemove={removeFollowUser} />
          ))}
        </div>
      </ScrollArea>
    </div>
  }

  return (
    <section className="h-[calc(100vh-130px)]">
      <h1 className="text-[40px] font-bold px-5">关注歌手</h1>
      <ScrollArea className="h-[calc(100%-30px)]">
        <div className="flex gap-5 flex-wrap p-5">
          {followUsers.map((user) => (
            <SingerCardPc key={user.mid} user={user} onClick={gotoSinger} onRemove={removeFollowUser} />
          ))}
          {/* 添加关注 */}
          {/* <PlusCircle className="w-40 h-40 text-muted-foreground" /> */}
        </div>
      </ScrollArea>
    </section >
  )
}

function SingerCardPc({ user, onClick, onRemove }: { user: Singer, onClick: (id: number) => void, onRemove: (user: Singer) => void }) {

  const removeFollowUser = (e: React.MouseEvent<Element>) => {
    e.stopPropagation()
    onRemove(user)
  }

  return <div
    className="flex flex-col w-50 flex-shrink-0 flex-grow-0 gap-2 p-4 
      transition-all duration-200 cursor-pointer rounded-lg group
      dark:hover:bg-white/10
      hover:bg-black/10
    "
    key={user.mid}
    onClick={() => onClick(user.mid)}
  >
    <div className="relative">
      <Image src={user.upic} alt={user.uname} width={150} height={100} className="rounded-full" />
      <X className="absolute top-0 right-0 opacity-0 group-hover:opacity-50 transition-opacity cursor-pointer" onClick={removeFollowUser} />
    </div>
    <div className="">
      <span className="text-md font-bold group-hover:border-b group-hover:border-b-black">{user.uname}</span>
      <span className="text-xs text-muted-foreground block opacity-50">粉丝:{user.fans}</span>
    </div>
  </div>
}

function SingerCardMobile({ user, onClick }: { user: Singer, onClick: (id: number) => void, onRemove?: (user: Singer) => void }) {
  return <div onClick={() => onClick(user.mid)} className="h-[50px] flex items-center gap-2 bg-white/10 rounded-md">
    <Image src={user.upic} alt={user.uname} width={50} height={50} className="rounded-md" />
    <span className="text-md">{user.uname}</span>
  </div>
}
