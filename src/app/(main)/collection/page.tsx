'use client'
import { api } from '@/lib/apiClient'
import { useTransition, useState, useEffect } from 'react'
import { Folder, PlayCircle } from "lucide-react"
import useStore from '@/store/index'

interface CollectionItem {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  fav_state: number
  media_count: number
}

const Collection = () => {
  const { userInfo } = useStore()
  const [isPending, startTransition] = useTransition()
  const [collection, setCollection] = useState<CollectionItem[]>([])

  useEffect(() => {
    console.log(userInfo, 'userInfo')
    startTransition(() => {
      const mid = userInfo?.mid as number
      api.collection.getCollection(mid).then(res => {
        setCollection(res)
      })
    })
  }, [userInfo])


  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">加载中...</p>
    </div>
  }

  return (
    <div className="container py-8 space-y-4 px-4">
      {collection.map(item => (
        <div
          key={item.id}
          className="rounded-lg border bg-card hover:bg-accent/50 transition-colors mb-5"
        >
          <div className="w-full flex justify-between p-3">
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6" />
              <h2 className="text-[22px] font-medium truncate max-w-[50vw]">
                {item.title}
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // 处理播放逻辑
                }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <PlayCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Collection
