import { FiguresConfigTypes } from '@/types/figures/figures.types'
import { Nullable } from '@/types/unionNull'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IConfigState {
  config: Nullable<FiguresConfigTypes>
  isSavedFigureConfigFromUI: boolean
  setIsSavedFigureConfigFromUI: (value: boolean) => void
  setConfig: (value: Nullable<FiguresConfigTypes>) => void
}

export const useConfig = create<IConfigState>()(
  devtools(
    (set) => ({
      config: null,
      isSavedFigureConfigFromUI: false,
      setIsSavedFigureConfigFromUI: (value) => set(() => ({ isSavedFigureConfigFromUI: value })),
      setConfig: (value) => set(() => ({ config: value })),
    }),
    { name: 'config-store' }
  )
)
