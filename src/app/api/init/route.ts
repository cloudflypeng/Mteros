import { NextResponse, NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
) {
  try {

    // if (request.headers.get('cookie')) {
    //   return NextResponse.json({ success: true, message: '已初始化' })
    // }

    // 访问 B 站首页获取初始 Cookie
    const response = await fetch('https://www.bilibili.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    // 获取所有 Set-Cookie 响应头
    const cookieHeader = response.headers.get('set-cookie')
    const cookies = cookieHeader ? cookieHeader.split(',') : []

    console.log(cookies)

    if (!cookies || cookies.length === 0) {
      throw new Error('未能获取到 Cookie')
    }

    // 创建响应对象
    const res = NextResponse.json({ success: true })

    // 将每个 Cookie 添加到响应中
    cookies.forEach(cookie => {
      // 解析 Cookie 字符串
      const [mainPart] = cookie.split(';')
      const [name, value] = mainPart.split('=')
      console.log(name, value)
      // 设置 Cookie
      res.cookies.set(name, value, {
        // Cookie 配置
        path: '/',
        secure: true,
        sameSite: 'lax',
        // 不设置 domain，让它使用当前域名
      })
    })

    console.log('成功设置 Cookie')
    return res

  } catch (error) {
    console.error('初始化 Cookie 失败:', error)
    return NextResponse.json(
      { error: '初始化失败' },
      { status: 500 }
    )
  }
}
