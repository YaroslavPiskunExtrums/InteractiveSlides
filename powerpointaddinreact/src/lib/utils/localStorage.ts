type lsKeys = 'slides-tokens' | 'default_styles' | 'presentationItems'

export const setToLocalStorage = (lsKey: lsKeys, data: unknown) => {
  localStorage.setItem(lsKey, JSON.stringify(data))
}

export const getFromLocalStorage = <T>(lsKey: lsKeys): T | null => {
  const lsData = localStorage.getItem(lsKey)
  if (!lsData) {
    return null
  }
  return JSON.parse(lsData)
}

export const removeFromLocalStorage = (lsKey: lsKeys) => {
  localStorage.removeItem(lsKey)
}
