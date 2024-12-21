import { NextResponse } from 'next/server'

// https://passport.bilibili.com/x/passport-login/captcha?source=main_web
export async function GET() {
  const response = await fetch('https://passport.bilibili.com/x/passport-login/captcha?source=main_web')
  const data = await response.json()
  return NextResponse.json(data)
}
