'use client'

import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/apiClient'

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

  return (
    <section className="flex flex-col gap-4 p-10">
      <h1>设置</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Input type="text" placeholder="请输入b站cookie" value={bilicookie} onChange={(e) => setBilicookie(e.target.value)} />
        <Button onClick={handleSave}>保存</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Button onClick={handleCheck}>检查</Button>
        <div>{checkInfo}</div>
      </div>
    </section>
  )
}

export default SettingPage
