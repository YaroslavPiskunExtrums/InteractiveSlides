import * as yup from 'yup'

export const linkPresentationToTagSchema = yup.object({
	tag_id: yup.number().required(),
	presentation_id: yup.string().required(),
})

export const tagFormSchema = yup.object({
	tag_title: yup.string().required()
})
