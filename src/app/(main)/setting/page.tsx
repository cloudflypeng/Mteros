'use client'

import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/apiClient'
import { Textarea } from '@/components/ui/textarea'

const SettingPage = () => {
  const [bilicookie, setBilicookie] = useLocalStorage('bilicookie', '')

  const [checkInfo, setCheckInfo] = useState('')

  const handleSave = () => {
    setBilicookie(bilicookie)

    const encodeCookie = encodeURIComponent(JSON.stringify(bilicookie))
    fetch('/api/login/proxycookie', {
      method: 'POST',
      body: JSON.stringify({
        bilicookie: encodeCookie,
      }),
    })
  }

  const handleCheck = () => {
    setCheckInfo('检查中...')
    api.user.getCurrentUserInfo().then((res: object) => {
      setCheckInfo(JSON.stringify(res))
    })
  }

  const handleClear = () => {
    setBilicookie('')
    setCheckInfo('')
  }

  return (
    <section className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="请输入b站cookie"
            value={bilicookie}
            onChange={(e) => setBilicookie(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">保存</Button>
            <Button onClick={handleClear} variant="outline" className="flex-1">清除</Button>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={handleCheck} className="w-full">检查</Button>
          {checkInfo && (
            <div className="p-4 rounded-lg bg-muted/50 break-all">
              {checkInfo}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SettingPage
