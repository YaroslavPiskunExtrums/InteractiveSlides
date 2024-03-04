import { links } from '@lib/constants/api.constants'
import { authFetch } from '@lib/utils/authFetch'

export const cleanPresentation = async (uniqueID: string) => {
  const res = await authFetch(links.cleanPresentation, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uniqueID,
    }),
  })
  return res
}
