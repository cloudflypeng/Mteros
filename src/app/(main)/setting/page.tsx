'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SettingPage = () => {
  const [bilicookie, setBilicookie] = useLocalStorage('bilicookie', '')

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

  return (
    <section className="flex flex-col gap-4 p-10">
      <h1>设置</h1>
      <div className="flex flex-col md:flex-row gap-4">

        <Input type="text" placeholder="请输入b站cookie" value={bilicookie} onChange={(e) => setBilicookie(e.target.value)} />
        <Button onClick={handleSave}>保存</Button>
      </div>
    </section>
  )
}

export default SettingPage
