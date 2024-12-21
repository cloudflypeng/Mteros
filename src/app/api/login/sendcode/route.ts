// https://passport.bilibili.com/x/passport-login/web/sms/send
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // 获取 cookie
  const cookie = request.headers.get('cookie')
  console.log(cookie)

  const params = {
    ...body,
    tel: Number(body.tel),  // 确保转换为数字
    source: 'main_web',
    cid: 86,  // 确保转换为数字
  }

  const urlParams = new URLSearchParams(params)

  // tel 和 cid 是数字类型传递
  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  if (cookie) {
    headers.Cookie = cookie
  }

  const response = await fetch('https://passport.bilibili.com/x/passport-login/web/sms/send', {
    method: 'POST',
    headers,
    body: urlParams.toString()
  })
  const data = await response.json()
  return NextResponse.json(data)
}
