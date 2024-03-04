import * as yup from 'yup'

const answers = yup.array().of(
	yup.object({
		label: yup.string(),
		value: yup.string()
	}))

const backgroundConfig = yup.object({
	backgroundColor: yup.string()
})

const btnConfig = yup.object({
	backColor: yup.string(),
	borderColor: yup.string(),
	textColor: yup.string(),
	borderRadius: yup.string(),
	fontSize: yup.string(),
	hoverColor: yup.string(),
	hoverBorderColor: yup.string(),
	hoverTextColor: yup.string(),
	linkType: yup.string(),
	link: yup.string(),
	links: yup.array().of(yup.string())
})
const dropdownConfig = yup.object({
	backgroundColor: yup.string(),
	fontColor: yup.string()
})

const questionConfig = yup.object({
	fontSize: yup.string()
})

const textConfig = yup.object({
	fontIndex: yup.string(),
	fontSize: yup.string(),
	textColor: yup.string(),
})

const inputConfig = yup.object({
	backColor: yup.string(),
	borderColor: yup.string(),
	textColor: yup.string(),
	borderRadius: yup.string(),
	fontSize: yup.string(),
})

const formConfig = yup.object({
	backColor: yup.string(),
	borderColor: yup.string(),
	borderRadius: yup.string(),
})

const rangeConfig = yup.tuple([
	yup.object({
		min: yup.string(),
		max: yup.string(),
		step: yup.string(),
		primaryColor: yup.string(),
	}),
	yup.object({
		numberOfOptions: yup.string(),
		pointerBorderColor: yup.string(),
		pointerColor: yup.string(),
		primaryColor: yup.string(),
		options: yup.array(yup.string()),
		optionTextConfig: yup.object({
			textColor: yup.string(),
			checkedTextColor: yup.string(),
		})
	})
])

const rightMenuValidation = yup.object({
	label: yup.string(),
	question: yup.string(),
	selected: yup.string(),
	view: yup.string(),
	subheading: yup.string(),
	btnText: yup.string(),
	equation: yup.string(),
	fullName: yup.string(),
	email: yup.string(),
	phone: yup.string(),
	business: yup.string(),
	textMessage: yup.string(),
	type: yup.string(),

	rangeConfig,

	additionalFields: yup.array(yup.string()),
	answers,

	formConfig,
	backgroundConfig,
	btnConfig,
	dropdownConfig,
	questionConfig,
	textConfig,
	inputConfig
})

export { rightMenuValidation }