import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
  // 从请求体中获取数据
  const body = await request.json()
  const bilicookie = body.bilicookie

  const res = new NextResponse(JSON.stringify({
    code: 0,
    message: 'success',
    data: 'ok',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `bilicookie=${bilicookie}; Path=/; HttpOnly; Secure`,
    },
  })

  return res
}
