import { defaultLabels } from '@lib/constants/figures.constants'
import { getLabelOptionsFromOffice, setLabelOptionsToOffice } from './addin'

export const saveLabelToList = (label: string) => {
  if (!label) {
    return
  }
  const labels: string[] | null | undefined = getLabelOptionsFromOffice()
  if (!labels) {
    return
  }
  const isLabelExist = Boolean(labels.find((l) => l === label))
  if (isLabelExist) {
    return
  }

  setLabelOptionsToOffice([...labels, label])
}

export const saveDefaultLabelList = () => {
  const labels: string[] | null | undefined = getLabelOptionsFromOffice()
  if (labels) {
    return
  }
  setLabelOptionsToOffice(defaultLabels)
}
