import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IOfficeState {
  isOfficeReady: boolean
  setIsOfficeReady: (value: boolean) => void
}

export const useOffice = create<IOfficeState>()(
  devtools(
    (set) => ({
      isOfficeReady: false,
      setIsOfficeReady: (value) => set(() => ({ isOfficeReady: value })),
    }),
    { name: 'office-store' }
  )
)
