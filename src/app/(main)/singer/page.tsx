

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function SingerPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="搜索歌手"
          />
        </div>
        <Button variant="outline">筛选</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 歌手卡片占位 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg flex items-center justify-center"
          >
            歌手 {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
