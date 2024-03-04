import { fontFamilies } from '@lib/constants/figures.constants'

export const getFontFamily = (prop: string) => {
  return fontFamilies.find((font) => font.value === prop)?.label ?? 'arial,sans-serif'
}
