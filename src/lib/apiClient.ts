type ApiOptions = {
  params?: Record<string, string>;
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

class ApiClient {
  async request(path: string, options: ApiOptions = {}) {
    const { params, body, method = 'GET' } = options
    
    const url = new URL(`/api/bilibili/${path}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    console.log('请求:', url.toString())

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`)
    }

    return response.json()
  }

  // B站 API 接口封装
  video = {
    // 搜索视频
    // template: https://api.bilibili.com/x/web-interface/search/type?page=1&page_size=42&platform=pc&highlight=1&keyword=re&search_type=video&preload=true&com2co=true
    search: async (keyword: string) => {
        const res = await this.request('x/web-interface/search/type', {
          params: { keyword, search_type: 'video', page: '1', page_size: '42', platform: 'pc', highlight: '1', preload: 'true', com2co: 'true' }
        })
        return res.data.result
    },

    // 获取视频信息
    getInfo: (bvid: string) => 
      this.request('x/web-interface/view', {
        params: { bvid }
      }),

    // 获取播放地址
    getPlayUrl: (bvid: string, cid: string) => 
      this.request('x/player/playurl', {
        params: { bvid, cid }
      }),
  }

  user = {
    // 获取用户信息
    getInfo: (uid: number) => 
      this.request('x/space/acc/info', {
        params: { mid: uid.toString() }
      }),

    // 获取用户视频列表
    getVideos: (uid: number, page = 1) => 
      this.request('x/space/arc/search', {
        params: { 
          mid: uid.toString(),
          pn: page.toString(),
          ps: '30'
        }
      }),
  }

  // 可以继续添加其他分类的 API
}

export const api = new ApiClient()