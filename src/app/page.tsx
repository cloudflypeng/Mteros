'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count === 10) {
      router.push('/setting')
    }
  }, [count])

  return (
    <div className="" onClick={() => setCount(count + 1)}>
      未知错误,请退出
    </div>
  );
}
