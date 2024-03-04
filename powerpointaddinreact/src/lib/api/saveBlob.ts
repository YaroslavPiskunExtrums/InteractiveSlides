import { links } from '@lib/constants/api.constants'
import { authFetch } from '@lib/utils/authFetch'

export const saveBlob = async (dataToSend: {
  dateTime: string
  idx: number
  uniqueID: string
  base64BlobData: string
}) => {
  const res = await authFetch(links.saveBlob, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })

  if (!res) return
  return res
}
