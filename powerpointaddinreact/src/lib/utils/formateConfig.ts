import type { ConfigArray, FiguresConfigTypes } from '@/types/figures/figures.types'
import { getFigureType } from './getFigureType'

export const formateConfig = (config: FiguresConfigTypes | ConfigArray) => {
  if ('itemConfig' in config) {
    const figureConfig = config.itemConfig[config.selectedItem]
    const figureType = getFigureType(config.selectedItem)
    figureConfig.figureType = figureType
    return figureConfig
  }
  return config
}
