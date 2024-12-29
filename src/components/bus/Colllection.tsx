'use client'

import { CollectionItem } from "@/store"

interface ColllectionItemProps {
  collention: CollectionItem
  onClick: () => void
}

export default function ColllectionItem({ collention, onClick }: ColllectionItemProps) {

  return <div>
    <div className='flex items-center justify-between hover:bg-white/10 p-2 rounded-md cursor-pointer transition-all duration-300' onClick={onClick}>
      <div className='flex items-center'>
        <div className='text-sm truncate'>{collention.title}</div>
      </div>
    </div>
  </div>
}
