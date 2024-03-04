import { links } from '@lib/constants/api.constants'
import { authFetch } from '@lib/utils/authFetch'

export const getChangedFigure = async (shapeName: string) => {
  const res = await authFetch(
    links.figureConfig + shapeName,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
    true
  )

  if (!res?.ok) return null
  return res.json() as Promise<{
    status: 'ok'
    payload: {
      id: string
      presentation_id: string
      name: string
      slide: number
      size: string
      bounds: string
      content_config: string
    }
  }>
}
