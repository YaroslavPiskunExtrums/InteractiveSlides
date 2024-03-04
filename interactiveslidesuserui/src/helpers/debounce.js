export default function debounce (func, timeout = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}