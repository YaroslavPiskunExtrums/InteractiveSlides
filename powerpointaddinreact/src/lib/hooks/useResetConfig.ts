import { AddButtonSettingsType } from '@/types/figures/addButton.types'
import { CalculatorSettingsType } from '@/types/figures/calculator.types'
import { CustomerDetailsSettingsType } from '@/types/figures/customerDetails.types'
import { DateFieldSettingsType } from '@/types/figures/dateField.types'
import { FiguresConfigTypes } from '@/types/figures/figures.types'
import { MultipleChoiceSettingsType } from '@/types/figures/multipleChoice.types'
import { OpenFieldSettingsType } from '@/types/figures/openField.types'
import { PersonalizationSettingsType } from '@/types/figures/personalization.types'
import { RangeSelectorSettingsType } from '@/types/figures/rangeSelector.types'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { getSavedConfig } from '@lib/utils/addin'
import { getFigureConfigFromUserUI } from '@lib/utils/getFigureConfigFromUserUI'
import { useConfig } from '@store/config.store'
import { useOffice } from '@store/office.store'
import { useEffect } from 'react'
import { UseFormReset } from 'react-hook-form'

type PropsType =
  | { type: FiguresEnum.addButton; reset: UseFormReset<AddButtonSettingsType> }
  | { type: FiguresEnum.personalization; reset: UseFormReset<PersonalizationSettingsType> }
  | { type: FiguresEnum.calculator; reset: UseFormReset<CalculatorSettingsType> }
  | { type: FiguresEnum.rangeSelector; reset: UseFormReset<RangeSelectorSettingsType> }
  | { type: FiguresEnum.customerDetails; reset: UseFormReset<CustomerDetailsSettingsType> }
  | { type: FiguresEnum.multipleChoice; reset: UseFormReset<MultipleChoiceSettingsType> }
  | { type: FiguresEnum.openField; reset: UseFormReset<OpenFieldSettingsType> }
  | { type: FiguresEnum.dateField; reset: UseFormReset<DateFieldSettingsType> }

export function useResetConfig(data: PropsType) {
  const { isOfficeReady } = useOffice()
  const { isSavedFigureConfigFromUI, setIsSavedFigureConfigFromUI } = useConfig()

  const resetConfig = async () => {
    const figureConfigFromSettings = getSavedConfig()
    let configFromUserUi: FiguresConfigTypes | null = null
    if (!isSavedFigureConfigFromUI) {
      configFromUserUi = await getFigureConfigFromUserUI()
      setIsSavedFigureConfigFromUI(true)
    }
    if (!figureConfigFromSettings && !configFromUserUi) return

    const figureConfig = configFromUserUi ? configFromUserUi : figureConfigFromSettings

    if (figureConfig?.figureType !== data.type) return
    console.log({ figureConfig })
    data.reset(figureConfig as any)
  }

  useEffect(() => {
    resetConfig()
  }, [isOfficeReady])
}
