import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword")

  if (!keyword) {
    return NextResponse.json({ error: "关键词不能为空" }, { status: 400 })
  }

  try {
    // 这里需要实现实际的 B 站 API 调用
    // 注意：B 站官方 API 可能需要认证，建议使用第三方 API 或自己的代理服务
    const response = await fetch(`https://api.bilibili.com/x/web-interface/search/all/v2?keyword=${encodeURIComponent(keyword)}`)
    const data = await response.json()

    // 处理响应数据，转换成前端需要的格式
    const videos = data.data.result.map((item: any) => ({
      id: item.aid,
      title: item.title,
      cover: item.pic,
      author: item.author,
      viewCount: item.play,
      duration: item.duration
    }))

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("B站 API 调用失败:", error)
    return NextResponse.json({ error: "搜索失败" }, { status: 500 })
  }
} 