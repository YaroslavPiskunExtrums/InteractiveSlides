import type { BusinessType, FiguresEnum } from '@lib/constants/figures.constants'
import type { BackgroundConfigType, FormConfigType, InputConfigType } from './figures.types'

export type CustomerDetailsSettingsType = {
  figureType: FiguresEnum.customerDetails
  fullName: string
  email: string
  phone: string
  textMessage: string
  label: string
  business: BusinessType
  additionalFields: string[]
  inputConfig: InputConfigType
  formConfig: FormConfigType
  backgroundConfig: BackgroundConfigType
}
