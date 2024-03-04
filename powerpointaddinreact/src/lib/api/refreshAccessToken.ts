import { setToLocalStorage } from '@lib/utils/localStorage'
import { links } from '@lib/constants/api.constants'
import type { TokensType } from '@/types/tokens.type'

type SendDataProps = {
  username?: string
  refreshToken: string
}

type RefreshAccessTokenArgsType = {
  username?: string
  tokens: TokensType
}

type RefreshAccessTokenType = (props: RefreshAccessTokenArgsType) => Promise<string | null>

export const refreshAccessToken: RefreshAccessTokenType = async ({ username, tokens }) => {
  try {
    let sendData: SendDataProps = { refreshToken: tokens.refreshToken }
    if (username) {
      sendData = { ...sendData, username }
    }

    const response = await fetch(links.regenerateAccessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendData),
    })
    if (!response.ok) {
      return null
    }
    const res: { accessToken: string } = await response.json()
    setToLocalStorage('slides-tokens', {
      ...tokens,
      accessToken: res.accessToken,
    })
    return res.accessToken
  } catch (e) {
    console.error(e)
    return null
  }
}
