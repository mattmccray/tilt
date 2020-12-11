let _stack: any[] = [{}]

export function getContext<T = any>(key: string): T {
  return _stack[0][key]
}

export function setContext(key: string, value: any) {
  _stack[0][key] = value
}

export function inNestedContext<T = any>(fn: () => T): T | undefined {
  let results
  _pushContextStack()
  try {
    results = fn()
  }
  catch (error) {
    console.warn(`Error in nested context: ${error}`)
  }
  _popContextStack()
  return results
}


export function _pushContextStack() {
  _stack.unshift(Object.create(_stack[0]))
}

export function _popContextStack() {
  if (_stack.length === 1) return // Don't remove the root context
  _stack.shift()
}
