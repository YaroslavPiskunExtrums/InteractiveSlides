import { links } from '@lib/constants/api.constants'
import { authFetch } from '@lib/utils/authFetch'

type RenamePresentationArgsType = {
  name: string
  uniqueID: string | null
}

type RenamePresentationResType = { success: boolean } | null

type RenamePresentationType = (
  data: RenamePresentationArgsType
) => Promise<RenamePresentationResType>

export const renamePresentation: RenamePresentationType = async (data) => {
  const res = await authFetch(links.renamePresentation, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return res?.json() as Promise<RenamePresentationResType>
}
