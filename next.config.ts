import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'i2.hdslb.com',  // 添加 bilibili 的图片域名
      'i0.hdslb.com',  // 建议也添加其他 bilibili 可能用到的域名
      'i1.hdslb.com',
      'i3.hdslb.com',
      'static.hdslb.com',
      'archive.biliimg.com',
      'mcnd.bilivideo.cn',
      'bilivideo.cn',
      'mcnd.bilibili.com',
      'bilivideo.com',
      '*.hdslb.com',
      '*.bilibili.com',
    ],
  },
};

export default nextConfig;
