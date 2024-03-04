import type { FiguresEnum } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  InputConfigType,
  QuestionConfigType,
  TextConfigType,
} from './figures.types'

export type DateFieldSettingsType = {
  figureType: FiguresEnum.dateField
  label: string
  question: string
  backgroundConfig: BackgroundConfigType
  inputConfig: InputConfigType
  questionConfig: QuestionConfigType
  textConfig: Omit<TextConfigType, 'fontSize'>
}
