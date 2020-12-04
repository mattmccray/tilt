
export function getObjectName(source: any) {
  const fn = source && typeof source === 'object'
    ? source.constructor
    : typeof source === 'symbol'
      ? { name: String(source) }
      : source || {}
  return fn.name || fn.displayName || 'anonymous'
}

export default getObjectName