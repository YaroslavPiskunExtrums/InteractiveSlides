import { links } from '@lib/constants/api.constants'

export const generateDeviceId = async () => {
  const res = await fetch(links.generateDeviceId, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  })

  return res
}
