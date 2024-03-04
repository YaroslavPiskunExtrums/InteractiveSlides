import yup from 'yup'

export const getUsersValidation = yup.object().shape({
  saas_company_id: yup.string().required(),
})

export const deleteUserValidation = yup.object().shape({
  user_id: yup.string().required(),
})

