import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IAddinFigure } from './types/IAddinFigure'


interface GlobalStoreState {
  figures: {
    [key: string]: {
      content_config: any
    }
  },
  resolve: (value: IAddinFigure) => void,
  // updateConfig: (value: IAddinFigure) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string) => void
}

type A = (state: Partial<GlobalStoreState>) => Partial<GlobalStoreState>
type SetFunction = (arg: Partial<GlobalStoreState> | A) => void

function globalStore(set: SetFunction): GlobalStoreState {
  return {
    figures: {},
    isLoading: false,
    error: null,
    setError: (error) => {
      set((state) => ({ ...state, error }))
    },
    setIsLoading: (isLoading) => {
      console.log(isLoading)

      set((state) => ({ ...state, isLoading }))
    },
    resolve: (value: IAddinFigure) => {
      set((state) => ({ figures: { ...state.figures, [value.name]: value } }))
    },
  }
}

export const useGlobalStore = create<GlobalStoreState>()(
  devtools(globalStore, {
    name: 'global-store',
  }),
)
