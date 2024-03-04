import { links } from '@lib/constants/api.constants'

export const generateTempPresentationId = async () => {
  const res = await fetch(links.generateTempPresentationId, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  })
  return res
}
