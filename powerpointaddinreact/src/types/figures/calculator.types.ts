import type { FiguresEnum } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  InputConfigType,
  QuestionConfigType,
  TextConfigType,
} from './figures.types'

export type CalculatorSettingsType = {
  figureType: FiguresEnum.calculator
  equation: string
  label: string
  question: string
  subheading: string
  backgroundConfig: BackgroundConfigType
  inputConfig: InputConfigType
  questionConfig: QuestionConfigType
  textConfig: Omit<TextConfigType, 'fontSize'>
}
