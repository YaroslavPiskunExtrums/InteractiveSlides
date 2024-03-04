import type { FiguresEnum, ViewsType } from '@lib/constants/figures.constants'
import type {
  AnswerType,
  BackgroundConfigType,
  BtnConfigType,
  DropdownConfigType,
  QuestionConfigType,
  TextConfigType,
} from './figures.types'

export type MultipleChoiceSettingsType = {
  figureType: FiguresEnum.multipleChoice
  view: ViewsType
  backgroundConfig: BackgroundConfigType
  btnConfig: BtnConfigType
  dropdownConfig: DropdownConfigType
  label: string
  question: string
  answers: AnswerType[]
  imageUrl: string
  questionConfig: QuestionConfigType
  selected: number
  selectedItems: null | number[]
  textConfig: TextConfigType
}
