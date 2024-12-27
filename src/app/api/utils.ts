const strToBase64 = (str: string) => {
  return Buffer.from(str).toString('base64')
}

const base64ToStr = (base64: string) => {
  return Buffer.from(base64, 'base64').toString('utf-8')
}

export {
  strToBase64,
  base64ToStr,
}
