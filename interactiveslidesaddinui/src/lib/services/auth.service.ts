import { IAuthResolver } from '../../types/api.interface'
import { parseJWT, parseJwtTTL } from '../utils/jwt'
import { debug } from '../log'
import {AUTH_TOKEN_KEY} from "../constants/auth";
import {useAuthStore} from "../store/auth.store";

class AuthServiceClass implements IAuthResolver {
  getToken(): string {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }

  async initialize() {
    const authorized = await this.authorized()
    console.log('Authorized?', authorized)

    if (!authorized) {
      await this.requestJWT()
    }
  }

  async authorized() {
    try {
      const token = this.getToken()
      if (!token) {
        return false
      }

      const ttl = parseJwtTTL(token)

      return ttl > 0
    } catch (e) {
      debug('AUTH ERROR', e)
      return false
    }
  }

  private async requestJWT() {
    const url = new URL(`${process.env.REACT_APP_PHP_API}/action`)
    url.searchParams.append('a', 'jwt')

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sub: '192'
      })
    })

    if (!response.ok) {
      throw new Error('JWT request failed')
    }

    const data = await response.json()
    localStorage.setItem(AUTH_TOKEN_KEY, data.jwt)
  }

  public async loadMe(): Promise<any> {
    const url = new URL(`${process.env.REACT_APP_API_PATH}/v1/users/me`)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    })

    if (!response.ok) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      throw new Error('User request failed')
    }

    const data = await response.json()

    useAuthStore.setState(state => {
      state.user = data
      return state
    })
  }
}

let __authService: AuthServiceClass= null
export function authService() {
  if (!__authService) {
    __authService = new AuthServiceClass()

  }

  return __authService
}
