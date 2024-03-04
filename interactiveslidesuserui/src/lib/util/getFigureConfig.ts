import { FIGURES, FiguresValues, MultipleChoiceType } from 'src/helpers/interactive-elements'
import { layouts } from 'src/pages/Presentations/PresentationSettings/Components/RightMenu/right-menu.types'

interface GetFigureConfig {
	conf
	figure: FiguresValues,
	type: 'styles' | 'data'
}

type RangeStyleConfig = [{ primaryColor?: string }, {
	pointerBorderColor?: string
	pointerColor?: string
	primaryColor?: string
	numberOfOptions?: string
	optionTextConfig?: {
		textColor?: string
		checkedTextColor?: string
	}
}]

type RangeConfigWithData = [
	{
		min?: string
		max?: string
		step?: string
	},
	{

		options?: []
	}
] & RangeStyleConfig

export const getFigureConfig = ({ conf, figure, type }: GetFigureConfig) => {

	const backgroundConfig = {
		backgroundColor: conf?.backgroundConfig?.backgroundColor ?? '#ffffff'
	}

	const inputConfig = {
		backColor: conf?.inputConfig?.backColor ?? '#000000',
		borderColor: conf?.inputConfig?.borderColor ?? '#000000',
		textColor: conf?.inputConfig?.textColor ?? '#000000',
		borderRadius: conf?.inputConfig?.borderRadius ?? '0',
		fontSize: conf?.inputConfig?.fontSize ?? '0',
	}

	const formConfig = {
		backColor: conf?.formConfig?.backColor ?? '#000000',
		borderColor: conf?.formConfig?.borderColor ?? '#000000',
		borderRadius: conf?.formConfig?.borderRadius ?? '0',
	}

	const rangeConfig: RangeStyleConfig = [
		{
			primaryColor: conf?.rangeConfig?.[0]?.primaryColor ?? '#000000'
		},
		{
			numberOfOptions: conf?.rangeConfig?.[1]?.options ? conf?.rangeConfig[1]?.options?.length : 0,
			pointerBorderColor: conf?.rangeConfig?.[1]?.pointerBorderColor ?? '#000000',
			pointerColor: conf?.rangeConfig?.[1]?.pointerColor ?? '#000000',
			primaryColor: conf?.rangeConfig?.[1]?.primaryColor ?? '#000000',
			optionTextConfig: {
				textColor: conf?.rangeConfig?.[1]?.optionTextConfig?.textColor ?? '#000000',
				checkedTextColor: conf?.rangeConfig?.[1]?.optionTextConfig?.checkedTextColor ?? '#000000',
			},
		},
	]



	const textConfig = {
		fontIndex: conf?.textConfig?.fontIndex ?? '0',
		textColor: conf?.textConfig?.textColor ?? '#000000'
	}
	const textConfig_v2 = {
		...textConfig,
		fontSize: conf?.textConfig?.fontSize ?? '0'
	}

	const textConfig_v3 = {
		...textConfig_v2,
		layout: conf?.textConfig?.layout ?? layouts.left
	}

	const btnConfig = {
		backColor: conf?.btnConfig?.backColor ?? '#000000',
		borderColor: conf?.btnConfig?.borderColor ?? '#000000',
		textColor: conf?.btnConfig?.textColor ?? '#000000',
		borderRadius: conf?.btnConfig?.borderRadius ?? '0',
		hoverColor: conf?.btnConfig?.hoverColor ?? '#000000',
		hoverBorderColor: conf?.btnConfig?.hoverBorderColor ?? '#000000',
		hoverTextColor: conf?.btnConfig?.hoverTextColor ?? '#000000',
	}
	const btnConfig_v2 = {
		...btnConfig,
		fontSize: conf?.btnConfig?.fontSize ?? '0'
	}
	const questionConfig = {
		fontSize: conf?.questionConfig?.fontSize ?? '0'
	}

	const dropdownConfig = {
		backgroundColor: conf?.dropdownConfig?.backgroundColor ?? '#ffffff',
		fontColor: conf?.dropdownConfig?.fontColor ?? '#000000',
		borderRadius: conf?.dropdownConfig?.borderRadius ?? '4',
		borderColor: conf?.dropdownConfig?.borderColor ?? '#ffffff',
		hoverColor: conf?.dropdownConfig?.hoverColor ?? '#5bc5fa',
		hoverTextColor: conf?.dropdownConfig?.hoverTextColor ?? '#ffffff',
	}

	const imageConfig = {
		borderRadius: conf?.imageConfig?.borderRadius ?? '4'
	}

	const figureStyleConfig = {
		[FIGURES.BUTTON]: {
			btnConfig: btnConfig_v2,
			backgroundConfig
		},
		[FIGURES.CALCULATOR]: {
			questionConfig,
			inputConfig,
			backgroundConfig,
			textConfig
		},
		[FIGURES.CUSTOMER_DETAILS]: {
			formConfig,
			inputConfig,
			backgroundConfig
		},
		[FIGURES.MULTIPLE_CHOICE]: {
			questionConfig,
			btnConfig,
			backgroundConfig,
			textConfig: textConfig_v2,
			dropdownConfig
		},
		[FIGURES.OPEN_FIELD]: {
			questionConfig,
			inputConfig,
			backgroundConfig,
			textConfig
		},
		[FIGURES.RANGE_SELECTOR]: {
			questionConfig,
			backgroundConfig,
			textConfig: textConfig_v2,
			rangeConfig
		},
		[FIGURES.DATE_FIELD]: {
			questionConfig,
			inputConfig,
			backgroundConfig,
			textConfig
		},
		[FIGURES.PERSONALIZATION]: {
			textConfig: textConfig_v3,
			imageConfig,
			backgroundConfig
		}
	}

	const rangeConfigWithData: RangeConfigWithData = [
		{
			...rangeConfig[0],
			min: conf?.rangeConfig?.[0]?.min ?? '0',
			max: conf?.rangeConfig?.[0]?.max ?? '100',
			step: conf?.rangeConfig?.[0]?.step ?? '1',
		},
		{
			...rangeConfig?.[1],
			options: conf?.rangeConfig?.[1]?.options ?? []
		}
	]

	const figureAllConfig = {
		[FIGURES.BUTTON]: {
			...figureStyleConfig[FIGURES.BUTTON],
			btnConfig: {
				...btnConfig_v2,
				link: conf?.btnConfig?.link ?? null,
				linkType: conf?.btnConfig?.linkType ?? null
			},
			btnText: conf?.btnText ?? '',
			label: conf?.label ?? '',
		},
		[FIGURES.CALCULATOR]: {
			...figureStyleConfig[FIGURES.CALCULATOR],
			question: conf?.question ?? '',
			subheading: conf?.subheading ?? '',
			label: conf?.label ?? '',
			equation: conf?.equation ?? '',
		},
		[FIGURES.CUSTOMER_DETAILS]: {
			...figureStyleConfig[FIGURES.CUSTOMER_DETAILS],
			fullName: conf?.fullName ?? '',
			email: conf?.email ?? '',
			phone: conf?.phone ?? '',
			business: conf?.business ?? 'Architecture',
			textMessage: conf?.textMessage ?? '',
			label: conf?.label ?? '',
			additionalFields: conf?.additionalFields ?? [],
		},
		[FIGURES.MULTIPLE_CHOICE]: {
			...figureStyleConfig[FIGURES.MULTIPLE_CHOICE],
			question: conf?.question ?? '',
			selected: conf?.selected ?? '-1',
			selectedItems: conf?.view === MultipleChoiceType.multipleSelector ? [] : null,
			label: conf?.label ?? '',
			answers: conf?.answers ?? [],
			view: conf?.view ?? 'button-list',
			btnConfig: {
				...btnConfig,
				linkType: conf?.btnConfig?.linkType ?? null,
				links: conf?.btnConfig?.links ?? null
			},
		},
		[FIGURES.OPEN_FIELD]: {
			...figureStyleConfig[FIGURES.OPEN_FIELD],
			question: conf?.question ?? '',
			subheading: conf?.subheading ?? '',
			label: conf?.label ?? ''
		},
		[FIGURES.RANGE_SELECTOR]: {
			...figureStyleConfig[FIGURES.RANGE_SELECTOR],
			rangeConfig: rangeConfigWithData,
			type: conf?.type ?? '0',
			question: conf?.question ?? '',
			subheading: conf?.subheading ?? '',
			label: conf?.label ?? '',
		},
		[FIGURES.DATE_FIELD]: {
			...figureStyleConfig[FIGURES.OPEN_FIELD],
			question: conf?.question ?? '',
			label: conf?.label ?? ''
		},
		[FIGURES.PERSONALIZATION]: {
			text: conf?.text ?? '',
			imageUrl: conf?.imageUrl ?? '',
			type: conf?.type ?? 'text',
			fileName: conf?.fileName ?? '',
			...figureStyleConfig[FIGURES.PERSONALIZATION]
		}
	}

	const config = {
		['styles']: figureStyleConfig[figure],
		['data']: figureAllConfig[figure]
	}

	return config[type]

}