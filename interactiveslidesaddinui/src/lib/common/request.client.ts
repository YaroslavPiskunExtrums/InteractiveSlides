import { IAuthResolver } from '../../types/api.interface'
import urlJoin from 'url-join'

type GetRequestOptions = {
  queryParams: Record<string, string | number | boolean | string[]>
}

function stringifyQueryParams(input: Record<string, string | number | boolean | string[]>): Record<string, string | string[]> {
  return Object.entries(input).reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value.map((v) => v.toString()) : value.toString()
    return acc
  }, {} as Record<string, string | string[]>)
}

export class AuthorizedClient {
  constructor(
    private basePath: string,
    private auth: IAuthResolver
  ) {}

  async request(
    url: string,
    queryParams?: Record<string, string | string[]>,
    requestOptions?: RequestInit
  ) {
    const u = new URL(url)

    console.log('>>>>', queryParams)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => u.searchParams.append(key, v))
        } else {
          u.searchParams.append(key, value.toString())
        }
      })
    }

    const data = await fetch(u.toString(), {
      ...(requestOptions || {}),
      headers: {
        ...(requestOptions.headers || {}),
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    })

    let content = null
    if (data.headers.get('Content-Type')?.includes('application/json')) {
      content = await data.json()
    } else {
      content = await data.text()
    }

    if (!data.ok) {
      throw new Error(content.message || content)
    }

    return content
  }

  async get(path: string, options?: GetRequestOptions) {
    return await this.request(urlJoin(this.basePath, path), stringifyQueryParams(options?.queryParams), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async post(path: string, options?: GetRequestOptions) {
    return await this.request(urlJoin(this.basePath, path), stringifyQueryParams(options?.queryParams), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async delete(path: string, options?: GetRequestOptions) {
    return await this.request(urlJoin(this.basePath, path), stringifyQueryParams(options?.queryParams), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async put(path: string, options?: GetRequestOptions) {
    return await this.request(urlJoin(this.basePath, path), stringifyQueryParams(options?.queryParams), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async patch(path: string, options?: GetRequestOptions) {
    return await this.request(urlJoin(this.basePath, path), stringifyQueryParams(options?.queryParams), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
