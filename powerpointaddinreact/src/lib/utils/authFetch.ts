import { refreshAccessToken } from '@lib/api/refreshAccessToken'
import type { TokensType } from '@/types/tokens.type'
import { getFromLocalStorage } from './localStorage'
import { logOutAndNavigate } from './logOutAndNavigate'

export const authFetch = async (
  input: string,
  init: RequestInit = { headers: {} },
  withoutNavigation?: boolean
) => {
  const tokens = getFromLocalStorage<TokensType>('slides-tokens')
  if (!tokens) {
    console.warn('No tokens')
    if (withoutNavigation) return null
    logOutAndNavigate()
    return null
  }
  const { accessToken } = tokens

  let res = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: accessToken,
    },
  })

  if (res.status === 401 || res.status === 403) {
    const accessToken = await refreshAccessToken({ tokens })
    if (!accessToken) {
      console.warn('Token update error')
      if (withoutNavigation) return null
      logOutAndNavigate()
      return null
    }

    res = await fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: accessToken,
      },
    })

    if (res.status === 401 || res.status === 403) {
      console.warn('Auth error')
      if (withoutNavigation) return null
      logOutAndNavigate()
      return null
    }
  }
  return res
}
