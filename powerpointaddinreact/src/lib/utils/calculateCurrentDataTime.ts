export function calculateCurrentDataTime() {
  const currentDate = new Date()
  //month starts from 0
  const dateString =
    currentDate.getFullYear() +
    '-' +
    (currentDate.getMonth() + 1) +
    '-' +
    currentDate.getDate() +
    ' ' +
    currentDate.getHours() +
    ':' +
    currentDate.getMinutes() +
    ':' +
    currentDate.getSeconds() +
    '.' +
    currentDate.getMilliseconds()
  return dateString
}
