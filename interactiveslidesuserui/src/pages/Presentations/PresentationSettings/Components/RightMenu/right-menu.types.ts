
export interface IForm {
	additionalFields?: Array<string>

	answers?: {
		label?: string
		value?: string
	}[]
	backgroundConfig?: {
		backgroundColor?: string
	}
	btnConfig?: {
		backColor?: string
		borderColor?: string
		borderRadius?: string
		hoverBorderColor?: string
		hoverColor?: string
		hoverTextColor?: string
		textColor?: string
		fontSize?: string
		link?: string | null
		linkType?: string | null
		links?: string[] | null
	}
	dropdownConfig?: {
		backgroundColor?: string
		fontColor?: string
		borderRadius?: string
		borderColor?: string
		hoverColor?: string
		hoverTextColor?: string
	}
	label?: string
	question?: string
	questionConfig?: {
		fontSize?: string
	}
	selected?: string
	view?: string
	textConfig?: {
		layout?: typeof layouts[keyof typeof layouts]
		fontIndex?: string
		fontSize?: string
		textColor?: string
	}

	imageUrl?: string
	fileName?: string

	imageConfig?: {
		borderRadius?: string
	}

	subheading?: string
	inputConfig?: {
		backColor?: string
		borderColor?: string
		textColor?: string
		borderRadius?: string
		fontSize?: string
	}

	btnText?: string
	equation?: string

	fullName?: string
	email?: string
	phone?: string
	business?: string
	textMessage?: string

	formConfig?: {
		backColor?: string
		borderColor?: string
		borderRadius?: string
	}

	type?: string | 'image' | 'text'
	text?: string


	rangeConfig?: [
		{
			min?: string
			max?: string
			step?: string
			primaryColor?: string
		}, {
			numberOfOptions?: string
			options?: string[]
			pointerBorderColor?: string
			pointerColor?: string
			primaryColor?: string
			optionTextConfig?: {
				textColor?: string
				checkedTextColor?: string
			}
		}
	]

}

export interface IElementTypeForm {
	elementType: string
}

export interface IIntegrationProperty {
	type?: string
	fieldType?: string
	name?: string
	label?: string
	id?: number
	options?: { value: string, label: string }[]
}

export interface IIntegrationPropertyForm {
	integrationPropertiesType: string
	selectedIntegrationProperty: IIntegrationProperty
}

export const personalizationFigureType = {
	image: 'image',
	text: 'text'
} as const;

export const layouts = {
	right: 'right',
	center: 'center',
	left: 'left'
} as const;