import { figureItemList, pageStatus } from '@lib/constants/config'
import type { LinkType, personalizationFigureType } from '@lib/constants/figures.constants'
import type { Nullable } from '@/types/unionNull'
import type { AddButtonSettingsType } from './addButton.types'
import type { CalculatorSettingsType } from './calculator.types'
import type { CustomerDetailsSettingsType } from './customerDetails.types'
import type { DateFieldSettingsType } from './dateField.types'
import type { MultipleChoiceSettingsType } from './multipleChoice.types'
import type { OpenFieldSettingsType } from './openField.types'
import type { PersonalizationSettingsType } from './personalization.types'
import type { RangeSelectorSettingsType } from './rangeSelector.types'

export type BackgroundConfigType = {
  backgroundColor: string
}

export type BtnConfigType = {
  backColor: string
  hoverColor: string
  borderColor: string
  hoverBorderColor: string
  textColor: string
  hoverTextColor: string
  borderRadius: number
  linkType: Nullable<LinkType>
  links: Nullable<string[]>
  link: Nullable<string>
}

export type DropdownConfigType = BackgroundConfigType &
  Pick<BtnConfigType, 'borderColor' | 'borderRadius' | 'hoverColor' | 'hoverTextColor'> & {
    fontColor: string
  }

export type TextConfigType = Pick<BtnConfigType, 'textColor'> & {
  fontIndex: string
  fontSize: number
}

export type QuestionConfigType = Pick<TextConfigType, 'fontSize'>

export type InputConfigType = Pick<
  BtnConfigType,
  'backColor' | 'borderColor' | 'borderRadius' | 'textColor'
> &
  Pick<TextConfigType, 'fontSize'>

export type FormConfigType = Pick<BtnConfigType, 'backColor' | 'borderColor' | 'borderRadius'>

export type AnswerType = { value: string; label: string }

export type FiguresConfigTypes =
  | MultipleChoiceSettingsType
  | RangeSelectorSettingsType
  | OpenFieldSettingsType
  | CustomerDetailsSettingsType
  | AddButtonSettingsType
  | CalculatorSettingsType
  | DateFieldSettingsType
  | PersonalizationSettingsType

export type ConfigArray = {
  itemConfig: [
    MultipleChoiceSettingsType,
    RangeSelectorSettingsType,
    OpenFieldSettingsType,
    CustomerDetailsSettingsType,
    AddButtonSettingsType,
    CalculatorSettingsType,
    DateFieldSettingsType,
    PersonalizationSettingsType,
  ]
  currentPage: (typeof pageStatus)[keyof typeof pageStatus]
  selectedItem: (typeof figureItemList)[keyof typeof figureItemList]
}

export type RangeNumberType = {
  min: string
  max: string
  step: string
  primaryColor: string
}

export type RangeOptionType = {
  numberOfOptions: number
  optionTextConfig: {
    checkedTextColor: string
    textColor: string
  }
  options: string[]
  pointerBorderColor: string
  pointerColor: string
  primaryColor: string
}

export type RangeConfigType = [RangeNumberType, RangeOptionType]

export type PersonalizationTypes =
  (typeof personalizationFigureType)[keyof typeof personalizationFigureType]
