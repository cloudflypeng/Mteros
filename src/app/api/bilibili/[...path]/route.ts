import { NextRequest, NextResponse } from 'next/server'

const BILIBILI_BASE_URL = 'https://api.bilibili.com'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // 获取完整路径
    const { path } = await context.params
    const fullPath = path.join('/')
    const { searchParams } = request.nextUrl

    // 从请求头中获取所有cookie
    const cookie = request.cookies.getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    // 构建目标 URL
    const targetUrl = new URL(fullPath, BILIBILI_BASE_URL)
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value)
    })

    console.log('代理请求:', targetUrl.toString(), 'cookie', cookie)

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.bilibili.com',
        'Cookie': cookie || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API 代理错误:', error)
    return NextResponse.json(
      { error: '请求失败' },
      { status: 500 }
    )
  }
}

// 如果需要支持其他 HTTP 方法 暂时不处理
// export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
//   const path = params.path.join('/')
//   const body = await request.json()
  
//   // ... POST 请求处理逻辑
// }
