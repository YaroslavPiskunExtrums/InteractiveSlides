import { AddButtonSettingsType } from '@/types/figures/addButton.types'
import { CalculatorSettingsType } from '@/types/figures/calculator.types'
import { CustomerDetailsSettingsType } from '@/types/figures/customerDetails.types'
import { DateFieldSettingsType } from '@/types/figures/dateField.types'
import { MultipleChoiceSettingsType } from '@/types/figures/multipleChoice.types'
import { OpenFieldSettingsType } from '@/types/figures/openField.types'
import { PersonalizationSettingsType } from '@/types/figures/personalization.types'
import { RangeSelectorSettingsType } from '@/types/figures/rangeSelector.types'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfig } from '@store/config.store'

export function useConfigWithType(figureType: FiguresEnum.addButton): AddButtonSettingsType
export function useConfigWithType(figureType: FiguresEnum.calculator): CalculatorSettingsType
export function useConfigWithType(
  figureType: FiguresEnum.customerDetails
): CustomerDetailsSettingsType
export function useConfigWithType(
  figureType: FiguresEnum.multipleChoice
): MultipleChoiceSettingsType
export function useConfigWithType(figureType: FiguresEnum.rangeSelector): RangeSelectorSettingsType
export function useConfigWithType(figureType: FiguresEnum.openField): OpenFieldSettingsType
export function useConfigWithType(figureType: FiguresEnum.dateField): DateFieldSettingsType
export function useConfigWithType(
  figureType: FiguresEnum.personalization
): PersonalizationSettingsType
export function useConfigWithType(figureType: FiguresEnum): null
export function useConfigWithType(figureType: FiguresEnum) {
  const { config } = useConfig()
  if (!config) return null
  switch (figureType) {
    case FiguresEnum.addButton:
      return config as AddButtonSettingsType
    case FiguresEnum.calculator:
      return config as CalculatorSettingsType
    case FiguresEnum.customerDetails:
      return config as CustomerDetailsSettingsType
    case FiguresEnum.multipleChoice:
      return config as MultipleChoiceSettingsType
    case FiguresEnum.rangeSelector:
      return config as RangeSelectorSettingsType
    case FiguresEnum.openField:
      return config as OpenFieldSettingsType
    case FiguresEnum.dateField:
      return config as DateFieldSettingsType
    case FiguresEnum.personalization:
      return config as PersonalizationSettingsType
  }
}
