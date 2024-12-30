import { NextRequest, NextResponse } from 'next/server'

const BILIBILI_BASE_URL = 'https://api.bilibili.com'

function getCookie(name: string, value: string): string {
  const parts: Array<string> = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts?.pop()?.split(';').shift() || ''
  return ''
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params
    const query = request.nextUrl.searchParams
    const fullPath = path.join('/')

    console.log(path, 'path', query)

    // 从请求体中解析参数
    const { params, method, body }: { params: Record<string, string>, method: string, body: Record<string, string> } = await request.json()

    const { needCsrf, headers = {}, ...restBody } = body || {}

    let bilicookie = request.cookies.get('bilicookie')?.value as string
    if (bilicookie) {
      bilicookie = decodeURIComponent(bilicookie)
    }
    if (needCsrf) {
      // 从bilibili获取csrf
      const csrf = getCookie('bili_jct', bilicookie)
      restBody.csrf = csrf
    }

    // 构建目标 URL
    const targetUrl = new URL(fullPath, BILIBILI_BASE_URL)
    const targetQuery = query

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (!query.has(key)) {
          targetQuery.set(key, value.toString())
        }
      })
    }

    targetUrl.search = targetQuery.toString()

    // 构建请求配置
    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://message.bilibili.com/',
        'Origin': 'https://message.bilibili.com/',
        'Cookie': bilicookie || '',
        ...headers
      },
    }

    // 如果是 POST/PUT 方法且有 body，则添加 body 和对应的 Content-Type
    if ((method === 'POST' || method === 'PUT') && restBody) {
      fetchOptions.body = JSON.stringify(restBody)
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
        ...headers
      }
    }

    console.log(fetchOptions.headers, 'fetchOptions')
    console.log(fetchOptions.body, 'fetchOptions')

    const response = await fetch(targetUrl.toString(), fetchOptions)
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
