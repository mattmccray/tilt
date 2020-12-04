let _stack: any[] = [{}]

export function getContext<T = any>(key: string): T {
  return _stack[0][key]
}

export function setContext(key: string, value: any) {
  _stack[0][key] = value
}

export function withNestedContext<T = any>(fn: (...args: any[]) => T) {
  return (...args: any[]) => {
    _pushContextStack()
    const results = fn(...args)
    _popContextStack()
    return results
  }
}


export function _pushContextStack() {
  _stack.unshift(Object.create(_stack[0]))
}

export function _popContextStack() {
  if (_stack.length === 1) return // Don't remove the root context
  _stack.shift()
}
