import yup from 'yup'


export const createTagValidation = yup.object({
	tag_title: yup.string().required().default('')
})

export const linkPresentationToTagValidation = yup.object({
	tag_id: yup.number().required(),
	presentation_id: yup.string().required()
})

export const removeTagValidation = yup.object({
	tag_id: yup.number().required()
})

export const updateTagTitleValidation = yup.object({
	tag_id: yup.number().required(),
	tag_title: yup.string().required().default('')
})