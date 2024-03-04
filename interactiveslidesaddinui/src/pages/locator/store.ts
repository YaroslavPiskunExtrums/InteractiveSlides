import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { LocatorAPIService } from './api.service'
import { delay } from '../../lib/utils/promise'

interface LocatorState {
  items: {
    id: string
    name: string
    brewery_type: string
    address_1: string
    address_2: string
  }[]
  loading: boolean
  load: () => void
}

type A = (state: Partial<LocatorState>) => Partial<LocatorState>
type SetFunction = (arg: Partial<LocatorState> | A) => void

function locatorStore(set: SetFunction): LocatorState {
  return {
    items: [],
    loading: false,
    load: async () => {
      set({ loading: true })
      const data = await LocatorAPIService.list()
      await delay(1000)
      set({ items: data, loading: false })
    }
  }
}

export const useLocatorStore = create<LocatorState>()(
  devtools(locatorStore, {
    name: 'locator-store'
  })
)
