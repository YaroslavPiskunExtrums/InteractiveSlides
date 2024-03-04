import type { FiguresEnum, openFieldType } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  InputConfigType,
  QuestionConfigType,
  TextConfigType,
} from './figures.types'

export type OpenFieldSettingsType = {
  figureType: FiguresEnum.openField
  label: string
  question: string
  subheading: string
  type: typeof openFieldType[keyof typeof openFieldType],
  backgroundConfig: BackgroundConfigType
  inputConfig: InputConfigType
  questionConfig: QuestionConfigType
  textConfig: Omit<TextConfigType, 'fontSize'>
}
