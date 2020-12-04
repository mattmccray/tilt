import hasha from 'hasha'

export function getHash(content: string) {
  if (!content) {
    console.log("Invalid content for hashing:", { type: typeof content, content })
    return 'xxx'
  }
  return hasha(content, { algorithm: 'md5' })
}

export default getHash