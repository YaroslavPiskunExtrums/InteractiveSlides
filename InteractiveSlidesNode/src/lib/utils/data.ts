import dayjs from 'dayjs'

export function mysqlDateFormat(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export function blobDateFormat(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS');
}

export function tryParseJSON<T extends object>(input: string): T {
  try {
    return JSON.parse(input) as T
  } catch (err) {
    return null
  }
}
