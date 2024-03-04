import Debug from 'debug'

let __logger = Debug('laura:app')

export function debug(formatter: any, ...args: any[]) {
  return __logger(formatter, ...args)
}
