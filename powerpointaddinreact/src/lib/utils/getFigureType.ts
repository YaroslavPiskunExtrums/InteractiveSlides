import { figureItemList } from '@lib/constants/config'
import { FiguresEnum } from '@lib/constants/figures.constants'

export const getFigureType = (
  selectedItem: (typeof figureItemList)[keyof typeof figureItemList]
) => {
  switch (selectedItem) {
    case 0:
      return FiguresEnum.multipleChoice
    case 1:
      return FiguresEnum.rangeSelector
    case 2:
      return FiguresEnum.openField
    case 3:
      return FiguresEnum.customerDetails
    case 4:
      return FiguresEnum.addButton
    case 5:
      return FiguresEnum.calculator
    case 6:
      return FiguresEnum.dateField
    case 7:
      return FiguresEnum.personalization
  }
}

export const getSelectedItem = (itemType: FiguresEnum) => {
  switch (itemType) {
    case FiguresEnum.multipleChoice:
      return 0
    case FiguresEnum.rangeSelector:
      return 1
    case FiguresEnum.openField:
      return 2
    case FiguresEnum.customerDetails:
      return 3
    case FiguresEnum.addButton:
      return 4
    case FiguresEnum.calculator:
      return 5
    case FiguresEnum.dateField:
      return 6
    case FiguresEnum.personalization:
      return 7
    default:
      return -1
  }
}
