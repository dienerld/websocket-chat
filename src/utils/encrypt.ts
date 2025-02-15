import { scryptSync } from 'node:crypto'

const key = 'abcdefg'
function encrypt(text: string): string {
  const keyBuffer = Buffer.from(key)
  const textBuffer = Buffer.from(text)

  const textEncrypted = scryptSync(textBuffer, keyBuffer, 32)

  return textEncrypted.toString('hex')
}

function compare(plainText: string, encryptedText: string): boolean {
  const keyBuffer = Buffer.from(key)
  const textBuffer = Buffer.from(plainText)

  const textEncrypted = scryptSync(textBuffer, keyBuffer, 32)

  return encryptedText === textEncrypted.toString('hex')
}

export const HashEncrypt = {
  encrypt,
  compare,
}
