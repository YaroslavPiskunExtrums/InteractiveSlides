import yup from 'yup'


const saveSlidesNoteValidation = yup.object().shape({
	number_of_slide: yup.number().required().min(1),
	session_id: yup.string().required(),
	note: yup.string().max(254)
})

const getSlidesNotesValidation = yup.object().shape({
	session_id: yup.string().required()
})

const deleteSlidesNoteValidation = yup.object().shape({
	note_id: yup.string().required()
})

export {
	saveSlidesNoteValidation,
	getSlidesNotesValidation,
	deleteSlidesNoteValidation
}