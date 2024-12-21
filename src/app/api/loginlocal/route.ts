import { NextResponse } from 'next/server'

const localCookie = `
buvid3=429BF2A1-81DC-4845-A245-585F8F6988E119319infoc; b_nut=1724739919; _uuid=FA2AB6B1-49B5-C1AD-AF1A-473E9DEE2E6719666infoc; enable_web_push=DISABLE; buvid4=2608322B-33AF-FF60-9363-A67369F23F5C19863-024082706-%2B0fSEz8fBLHm68zXO%2B64Kw%3D%3D; header_theme_version=CLOSE; DedeUserID=184327681; DedeUserID__ckMd5=c06bd40a1783a13b; rpdid=|(k|k)kmkJlk0J'u~kR~Y~~|Y; hit-dyn-v2=1; buvid_fp_plain=undefined; is-2022-channel=1; LIVE_BUVID=AUTO9417297399426724; home_feed_column=5; PVID=3; fingerprint=5bf0d22eacda329dc710f569d47c78bd; CURRENT_QUALITY=120; SESSDATA=cce06906%2C1749742237%2C8ade8%2Ac2CjCd5io2yQC9AU4Phb3-RejF9gpU8YN5e1o2aaL6tbTm-OIZBUGXtD3z6E1cy0LqpkESVkQxWEZJTEJoVUZmNGEzc1dpZ2Y1RlhaQU9ubjhXZ2psVExDaUg5UnlFQ00wYmM5WDA4dUFnUFh0bVVxRGcxZkYwbkZ1dkJhS3hkVDlmUEtMUjgxSVJRIIEC; bili_jct=ecee98432e4c2693049766f907a1dbb8; sid=8p50re2x; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ4NzM3MjEsImlhdCI6MTczNDYxNDQ2MSwicGx0IjotMX0.YadFF9oWub5lPO72WGIiLdFkAaIXC_u4cOoRnJFaOwk; bili_ticket_expires=1734873661; b_lsid=63D2C418_193E42E1EF8; CURRENT_FNVAL=4048; browser_resolution=1746-1153; buvid_fp=429BF2A1-81DC-4845-A245-585F8F6988E119319infoc; theme_style=light`;

export async function GET() {
  const res = NextResponse.json({ success: true })

  // 使用 encodeURIComponent 对 cookie 字符串进行编码
  // const encodedCookie = encodeURIComponent(localCookie)
  const cookieMap = localCookie.split(';').map(item => {
    const [key, value] = item.split('=')
    return { key, value }
  })
  cookieMap.forEach(item => {
    res.cookies.set(item.key, item.value)
  })
  return res
}
