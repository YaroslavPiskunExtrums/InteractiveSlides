import type { FiguresEnum } from '@lib/constants/figures.constants'
import type { BackgroundConfigType, BtnConfigType } from './figures.types'

export type AddButtonSettingsType = {
  figureType: FiguresEnum.addButton
  btnText: string
  label: string
  backgroundConfig: BackgroundConfigType
  btnConfig: Omit<BtnConfigType, 'links'> & { fontSize: number }
}
