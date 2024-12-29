'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useUrlState<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
  }
) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 默认序列化和反序列化方法
  const serialize = options?.serialize || JSON.stringify
  const deserialize = options?.deserialize || JSON.parse

  // 从 URL 或初始值获取状态
  const getInitialState = () => {
    const urlValue = searchParams.get(key)
    if (urlValue) {
      try {
        return deserialize(urlValue)
      } catch {
        return initialValue
      }
    }
    return initialValue
  }

  const [value, setValue] = useState<T>(getInitialState)

  // 更新 URL
  const updateUrl = useCallback((newValue: T) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, serialize(newValue))
    router.push(`?${params.toString()}`)
  }, [key, router, searchParams, serialize])

  // 状态变化��更新 URL
  useEffect(() => {
    updateUrl(value)
  }, [value, updateUrl])

  return [value, setValue] as const
} 
