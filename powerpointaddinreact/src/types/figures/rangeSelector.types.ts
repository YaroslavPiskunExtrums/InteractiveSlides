import type { FiguresEnum } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  QuestionConfigType,
  RangeConfigType,
  TextConfigType,
} from './figures.types'

export type RangeSelectorSettingsType = {
  figureType: FiguresEnum.rangeSelector
  backgroundConfig: BackgroundConfigType
  label: string
  question: string
  questionConfig: QuestionConfigType
  subheading: string
  textConfig: TextConfigType
  type: 0 | 1
  rangeConfig: RangeConfigType
}
