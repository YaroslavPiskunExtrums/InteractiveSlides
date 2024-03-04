import { Nullable } from '@/types/unionNull'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IDefaultStylesState {
  buttonStyles: Nullable<string>
  calculatorStyles: Nullable<string>
  customerDetailsStyles: Nullable<string>
  multipleChoiceStyles: Nullable<string>
  openFieldStyles: Nullable<string>
  rangeSelectorStyles: Nullable<string>
  dateFieldStyles: Nullable<string>
  personalizationStyles: Nullable<string>

  setButtonStyles: (value: Nullable<string>) => void
  setCalculatorStyles: (value: Nullable<string>) => void
  setCustomerDetailsStyles: (value: Nullable<string>) => void
  setMultipleChoiceStyles: (value: Nullable<string>) => void
  setOpenFieldStyles: (value: Nullable<string>) => void
  setRangeSelectorStyles: (value: Nullable<string>) => void
  setDateFieldStyles: (value: Nullable<string>) => void
  setPersonalizationStyles: (value: Nullable<string>) => void
}

export const useDefaultStyles = create<IDefaultStylesState>()(
  devtools(
    (set) => ({
      buttonStyles: null,
      calculatorStyles: null,
      customerDetailsStyles: null,
      multipleChoiceStyles: null,
      openFieldStyles: null,
      rangeSelectorStyles: null,
      dateFieldStyles: null,
      personalizationStyles: null,
      setButtonStyles: (value) => set(() => ({ buttonStyles: value })),
      setCalculatorStyles: (value) => set(() => ({ calculatorStyles: value })),
      setCustomerDetailsStyles: (value) => set(() => ({ customerDetailsStyles: value })),
      setMultipleChoiceStyles: (value) => set(() => ({ multipleChoiceStyles: value })),
      setOpenFieldStyles: (value) => set(() => ({ openFieldStyles: value })),
      setRangeSelectorStyles: (value) => set(() => ({ rangeSelectorStyles: value })),
      setDateFieldStyles: (value) => set(() => ({ dateFieldStyles: value })),
      setPersonalizationStyles: (value) => set(() => ({ personalizationStyles: value })),
    }),
    { name: 'default-styles-store' }
  )
)
