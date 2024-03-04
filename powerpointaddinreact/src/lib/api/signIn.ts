import { links } from '@lib/constants/api.constants'
import { setToLocalStorage } from '@lib/utils/localStorage'
import { TokensType } from '@/types/tokens.type'

type LoginResponseType = TokensType
export type LoginArgsType = {
  email: string
  password: string
}
type LoginType = (data: LoginArgsType) => Promise<LoginResponseType>

export const logIn: LoginType = async (data) => {
  const response = await fetch(links.signIn, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Wrong credential')
  }
  const tokens = await response.json()
  setToLocalStorage('slides-tokens', tokens)
  return tokens as Promise<LoginResponseType>
}
