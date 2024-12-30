import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')

  let bilicookie = request.cookies.get('bilicookie')?.value as string
  if (bilicookie) {
    bilicookie = decodeURIComponent(bilicookie)
  }

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Cookie': bilicookie || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Range': 'bytes=0-',
        'Referer': 'https://www.bilibili.com',
        'Origin': 'https://www.bilibili.com'
      },
    })

    // 创建 TransformStream 用于流式传输
    const { readable, writable } = new TransformStream()

    response.body?.pipeTo(writable)

    return new NextResponse(readable, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    })
  } catch (error) {
    console.log(error)
    return new NextResponse('Error fetching media', { status: 500 })
  }
} 
