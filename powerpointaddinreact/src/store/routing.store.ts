import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IRouteState {
  hash: string
  setHash: (value: string) => void
}

export const useRoute = create<IRouteState>()(
  devtools(
    (set) => ({
      hash: (() => {
        let hash = window.location.hash
        if (hash) {
          return hash
        }
        hash = '#getStart'
        window.location.hash = hash
        return hash
      })(),

      setHash: (value) => {
        set(() => ({ hash: value }))
        window.location.hash = value
      },
    }),
    { name: 'route-store' }
  )
)
