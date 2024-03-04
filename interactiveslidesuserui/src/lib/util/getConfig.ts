import { ConfigArray } from '../types/figures.types'

export const getConfig = (figure: {
	slide: number
	size: string
	presentation_id: string
	name: string
	id: string
	bounds: string
	content_config: string | null
}) => {
	const figureConfig =
		typeof figure?.content_config === 'string'
			? JSON.parse(figure.content_config) as ConfigArray
			: typeof figure?.content_config === 'object'
				? figure.content_config as ConfigArray
				: {
					itemConfig: [],
					currentPage: 0,
					selectedItem: 0
				}
	return figureConfig?.itemConfig[figureConfig.selectedItem]
}