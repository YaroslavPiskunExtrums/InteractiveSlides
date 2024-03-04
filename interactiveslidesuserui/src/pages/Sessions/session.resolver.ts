import * as yup from 'yup'

const createSessionSchema = yup.object({
	linkName: yup.string().required(),
	salesName: yup.string().required(),
	companyName: yup.string().required(),
	selectedPresentationId: yup.string().required()
})

export { createSessionSchema }