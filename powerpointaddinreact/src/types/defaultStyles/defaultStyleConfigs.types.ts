import type { layouts } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  BtnConfigType,
  DropdownConfigType,
  FormConfigType,
  InputConfigType,
  QuestionConfigType,
  RangeNumberType,
  RangeOptionType,
  TextConfigType,
} from '@/types/figures/figures.types'

export type BntConfigDefaultStylesType = Pick<
  BtnConfigType,
  | 'backColor'
  | 'borderColor'
  | 'borderRadius'
  | 'hoverBorderColor'
  | 'hoverColor'
  | 'hoverTextColor'
  | 'textColor'
> & { fontSize?: number }

export type AddBtnDefaultStylesType = {
  btnConfig: BntConfigDefaultStylesType
  backgroundConfig: BackgroundConfigType
}

export type CalculatorDefaultStylesType = {
  questionConfig: QuestionConfigType
  inputConfig: InputConfigType
  backgroundConfig: BackgroundConfigType
  textConfig: Pick<TextConfigType, 'fontIndex' | 'textColor'>
}

export type CustomerDetailsDefaultStylesType = {
  formConfig: FormConfigType
  inputConfig: InputConfigType
  backgroundConfig: BackgroundConfigType
}

export type MultipleChoiceDefaultStylesType = {
  questionConfig: QuestionConfigType
  btnConfig: Omit<BntConfigDefaultStylesType, 'fontSize'>
  backgroundConfig: BackgroundConfigType
  textConfig: TextConfigType
  dropdownConfig: DropdownConfigType
}

export type OpenFieldDefaultStylesType = {
  questionConfig: QuestionConfigType
  inputConfig: InputConfigType
  backgroundConfig: BackgroundConfigType
  textConfig: Pick<TextConfigType, 'fontIndex' | 'textColor'>
}

export type RangeSelectorDefaultStylesType = {
  questionConfig: QuestionConfigType
  backgroundConfig: BackgroundConfigType
  textConfig: TextConfigType
  rangeConfig: [Pick<RangeNumberType, 'primaryColor'>, Omit<RangeOptionType, 'options'>]
}

export type DateFieldDefaultStylesType = {
  questionConfig: QuestionConfigType
  inputConfig: InputConfigType
  backgroundConfig: BackgroundConfigType
  textConfig: Pick<TextConfigType, 'fontIndex' | 'textColor'>
}

export type PersonalizationDefaultStylesType = {
  backgroundConfig: BackgroundConfigType
  textConfig: TextConfigType & {
    layout: (typeof layouts)[keyof typeof layouts]
  }
  imageConfig: Pick<InputConfigType, 'borderRadius'>
}
