import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IPresentationState {
  presentationName: string
  uniqueId: string
  uploadLinkUrl: string
  setPresentationName: (value: string) => void
  setUniqueId: (value: string) => void
  setUploadLinkUrl: (value: string) => void
}

export const usePresentation = create<IPresentationState>()(
  devtools(
    (set) => ({
      presentationName: '',
      uniqueId: '',
      uploadLinkUrl: '',
      setPresentationName: (value) => set(() => ({ presentationName: value })),
      setUniqueId: (value) => set(() => ({ uniqueId: value })),
      setUploadLinkUrl: (value) => set(() => ({ uploadLinkUrl: value })),
    }),
    { name: 'presentation-store' }
  )
)
