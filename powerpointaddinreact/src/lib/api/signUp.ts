import { links } from '@lib/constants/api.constants'
import { setToLocalStorage } from '@lib/utils/localStorage'
import type { TokensType } from '@/types/tokens.type'
import type { LoginArgsType } from './signIn'

type SignUpResponseType = TokensType
type SignUpArgsType = {
  username: string
  company_name: string
  company_domain: string
} & LoginArgsType
type SignUpType = (data: SignUpArgsType) => Promise<SignUpResponseType>

export const signUp: SignUpType = async (data) => {
  const response = await fetch(links.signUpTrial, {
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
  return tokens as Promise<SignUpResponseType>
}
