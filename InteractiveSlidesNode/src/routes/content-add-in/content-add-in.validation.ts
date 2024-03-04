import yup from 'yup'

export const updateAddInStatusValidation = yup.object().shape({
  shapeName: yup.string().nullable(),
  uniqueID: yup.string().required(),
  contentAddInStatus: yup.object().nullable(),
})

export const getFigureConfigValidation = yup.object({
  item_name: yup.string().required()
})


