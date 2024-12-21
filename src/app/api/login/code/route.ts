// https://passport.bilibili.com/x/passport-login/web/login/sms
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const params = {
    cid: 86,
    tel: Number(body.tel),
    code: Number(body.code),
    source: 'main_web',
    captcha_key: body.captcha_key,
  }

  const urlParams = new URLSearchParams(params)
  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const cookie = request.headers.get('cookie')
  if (cookie) {
    headers.Cookie = cookie
  }

  const response = await fetch('https://passport.bilibili.com/x/passport-login/web/login/sms', {
    method: 'POST',
    headers,
    body: urlParams.toString()
  })
  // 从这个response 中获取 cookie
  console.log(response.headers)
  // 配置跳转路径到首页
  const blCookie = response.headers.get('set-cookie')
  console.log(blCookie)
  const blHeaders = new Headers(response.headers)
  if (blCookie) {
    blHeaders.set('Set-Cookie', blCookie)
  }
  // blHeaders.set('Location', '/')


  const MyResponse = new NextResponse(response.body, {
    headers: blHeaders
  })
  return MyResponse
}
