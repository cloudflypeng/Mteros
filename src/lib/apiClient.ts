type ApiOptions = {
  params?: Record<string, string>;
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

import { encWbi } from './wbi'

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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params,
        body,
        method,
      })
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

    // 获取播放地址
    getPlayUrl: async ({ bvid, cid }: { bvid?: string, cid?: string }) => {
      if (!cid && bvid) {
        // 先拿cid
        const res = await this.request('/x/web-interface/view', {
          params: { bvid }
        })

        cid = res.data.cid as string
        const res2 = await this.request('/x/player/playurl', {
          params: { cid, bvid, fnval: '16' }
        })

        const url = res2.data.dash?.audio[0].baseUrl || res2.data.dash?.video[0].base_url || res2.data.durl[0].url

        return url
      }
    }
  }

  user = {
    // 获取mid用户信息
    getInfo: async (mid: number | string) => {

      const res = await this.request('x/web-interface/card', {
        params: { mid: mid.toString() }
      })
      console.log(res, 'res')

      return res.data
    },
    getCurrentUserInfo: async () => {
      const res = await this.request('x/web-interface/nav', {
      })
      console.log(res, 'res')
      return res.data
    },
    // 搜索用户
    search: async (keyword: string) => {
      const res = await this.request('x/web-interface/wbi/search/type', {
        params: { keyword, search_type: 'bili_user', page: '1', }
      })
      return res.data.result
    },

    // 获取用户视频列表
    getVideos: async (params: { mid: number, pn?: number, ps?: number, tid?: number, keyword?: string, order?: string }, wbi_img) => {
      const defaultParams = {
        mid: 0,
        pn: 1,
        ps: 25,
        tid: 3,
        keyword: '',
        order: 'pubdate',
      }
      params = { ...defaultParams, ...params }
      const web_keys = this.wbi.getWbiKeys(wbi_img)
      const img_key = web_keys.img_key
      const sub_key = web_keys.sub_key
      const query = encWbi(params, img_key, sub_key)

      const res = await this.request(`x/space/wbi/arc/search${query ? `?${query}` : ''}`, {
      })
      return res.data?.list || []
    }

  }

  collection = {
    // 获取收藏夹列表
    getCollection: async (mid: number) => {
      if (!mid) return []
      const res = await this.request('x/v3/fav/folder/created/list-all', {
        params: { type: '0', up_mid: mid.toString() }
      })
      console.log(res, 'res')
      return res?.data?.list || []
    },
    // 获取收藏家内视频https://api.bilibili.com/x/v3/fav/resource/list?media_id=3339063381&ps=20&pn=1
    getCollectionVideos: async (media_id: number, pn: number, ps: number) => {
      const res = await this.request('x/v3/fav/resource/list', {
        params: { media_id: media_id.toString(), ps: ps.toString(), pn: pn.toString() }
      })
      return res.data || {}
    }

  }

  wbi = {
    getWbiKeys: (wbi_img: { img_url: string, sub_url: string }) => {

      const { img_url, sub_url } = wbi_img

      return {
        img_key: img_url.slice(
          img_url.lastIndexOf('/') + 1,
          img_url.lastIndexOf('.'),
        ),
        sub_key: sub_url.slice(
          sub_url.lastIndexOf('/') + 1,
          sub_url.lastIndexOf('.'),
        ),
      }
    }
  }

  // 可以继续添加其他分类的 API
}


export const api = new ApiClient()
