export type SizeType = {
	width: number
	height: number
}

type CalculateActualFontType = (actualFigureSize: SizeType, defaultFigureSize: SizeType, defaultFontSize: string | number) => number

export const calculateActualFont: CalculateActualFontType = (actualFigureSize, defaultFigureSize, defaultFontSize) => {

	if (!actualFigureSize.width || !defaultFigureSize.width || !actualFigureSize.height || !defaultFigureSize.height || !defaultFontSize) {
		return 0
	}

	const ActualWidthPercent = (actualFigureSize.width / defaultFigureSize.width) * 100
	const ActualHeightPercent = (actualFigureSize.height / defaultFigureSize.height) * 100

	const averageBetweenWidthAndHeight = (ActualWidthPercent + ActualHeightPercent) / 2

	const percent = Math.round(averageBetweenWidthAndHeight)

	const actualFont = (Number(defaultFontSize) * percent) / 100

	return actualFont
}