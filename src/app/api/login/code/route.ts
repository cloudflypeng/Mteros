import { NextResponse, NextRequest } from 'next/server'

import { strToBase64 } from '../../utils'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const params = {
    cid: '86',
    tel: body.tel,
    code: body.code,
    source: 'main_web',
    captcha_key: body.captcha_key,
  }

  // 转换参数为 URLSearchParams 格式
  const urlParams = new URLSearchParams(params)

  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  // 获取请求头中的 cookie
  const cookie = request.headers.get('cookie')
  if (cookie) {
    headers.Cookie = cookie
  }

  // 发起 POST 请求
  const response = await fetch('https://passport.bilibili.com/x/passport-login/web/login/sms', {
    method: 'POST',
    headers,
    body: urlParams.toString()
  })

  // 获取原始响应数据
  const data = await response.json()

  // 获取并处理返回的 set-cookie 头部
  const setCookieHeader = response.headers.get('set-cookie')

  // 创建新的响应数据，包含 bilicookie
  const responseData = {
    ...data,
  }

  // 加密
  const encryptedData = strToBase64(JSON.stringify(setCookieHeader))
  // 创建新的响应头
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'application/json')
  const res = new NextResponse(JSON.stringify(responseData), {
    headers: responseHeaders,
    status: response.status
  })

  res.cookies.set('bilicookie', encryptedData, {
    path: '/',
    secure: true,
    sameSite: 'lax',
  })

  // 返回最终的响应
  return res
}
