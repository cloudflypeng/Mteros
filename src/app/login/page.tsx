"use client"
declare global {
  interface Window {
    initGeetest: (
      config: {
        gt: string;
        challenge: string;
        product: string;
        offline: boolean;
      },
      callback: (captchaObj: GeetestCaptcha) => void
    ) => void;
  }
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GeetestCaptcha {
  onSuccess: (callback: () => void) => void;
  getValidate: () => {
    geetest_challenge: string;
    geetest_seccode: string;
    geetest_validate: string;
  };
  appendTo: (selector: string) => void;
}

interface GeetestResult {
  challenge: string;
  seccode: string;
  validate: string;
  cid: string;
  source: string;
  tel: string;
  token: string;
}

const Login = () => {
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [captchaKey, setCaptchaKey] = useState("")

  const handleGeetest = async () => {

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert("请输入正确的手机号")
      return
    }
    // 在这里生成验证
    const script = document.createElement('script')
    script.src = "https://static.geetest.com/static/tools/gt.js"
    document.body.appendChild(script)

    script.onload = () => {
      fetch("/api/login/captcha").then(res => res.json()).then(data => {
        const { token, geetest } = data.data

        // 初始化极验
        window?.initGeetest({
          gt: geetest.gt,
          challenge: geetest.challenge,
          product: 'popup', // 弹出验证
          offline: false
        }, (captchaObj: GeetestCaptcha) => {
          captchaObj.onSuccess(() => {
            const result = captchaObj.getValidate()
            const parmas = {
              challenge: result.geetest_challenge,
              seccode: result.geetest_seccode,
              validate: result.geetest_validate,
              cid: '86',
              source: 'main_web',
              tel: phone,
              token: token,
            }
            handleSendCode(parmas) // 验证成功后发送验证码
          })
          // 将验证码加到按钮上
          captchaObj.appendTo('#captcha')
        })
      })
    }
  }


  const handleSendCode = (geetestResult: GeetestResult) => {
    fetch('api/init')
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert("请输入正确的手机号")
      return
    }

    const { tel: _tel, ...restGeetestResult } = geetestResult
    console.log(_tel)
    const params = {
      tel: Number(phone),
      ...restGeetestResult,
    }

    fetch('/api/login/sendcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)  // JSON.stringify 会正确处理数字
    }).then(res => res.json()).then(data => {
      console.log(data)
      const captcha_key = data.data.captcha_key
      setCaptchaKey(captcha_key)
    }).then(() => {
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    })
  }

  const handleSubmit = () => {
    // router.push('/search')

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert("请输入正确的手机号")
      return
    }
    if (!/^[0-9]{6}$/.test(code)) {
      alert("请输入正确的验证码")
      return
    }
    if (!captchaKey) {
      alert("请先获取验证码")
      return
    }
    const params = {
      tel: Number(phone),
      code: Number(code),
      captcha_key: captchaKey,
    }
    fetch('/api/login/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(res => res.json())
      .then(res => {
        const { bilicookie } = res
        // 存到localstorage
        localStorage.setItem('bilicookie', bilicookie)
        // 存到cookie
        // router.push('/search')
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>登录 Mteros</CardTitle>
          <CardDescription>使用手机号验证码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={countdown > 0}
                  onClick={handleGeetest}
                >
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </Button>

              </div>
              <div id="captcha">

              </div>
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
