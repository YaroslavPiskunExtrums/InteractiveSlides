import type { FiguresEnum, layouts } from '@lib/constants/figures.constants'
import type {
  BackgroundConfigType,
  InputConfigType,
  PersonalizationTypes,
  TextConfigType,
} from './figures.types'

export type PersonalizationSettingsType = {
  figureType: FiguresEnum.personalization
  text: string
  imageUrl: string
  fileName: string
  type: PersonalizationTypes
  backgroundConfig: BackgroundConfigType
  textConfig: TextConfigType & {
    layout: (typeof layouts)[keyof typeof layouts]
  }
  imageConfig: Pick<InputConfigType, 'borderRadius'>
}
