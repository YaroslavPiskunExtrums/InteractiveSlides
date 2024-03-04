import yup from 'yup'

export const registerUserValidation = yup.object().shape({
  username: yup.string(),
  email: yup.string().required(),
  company_name: yup.string().required(),
  company_domain: yup.string().required(),
})

export const deleteUserValidation = yup.object().shape({
  id: yup.string().required(),
})

export const visitAsUserValidation = yup.object().shape({
  userId: yup.string().required(),
  refreshToken: yup.string().required(),
  accessToken: yup.string().required(),
})

export const getUserHashValidation = yup.object().shape({
  userId: yup.string().required(),
})

export const loginUserByHashValidation = yup.object().shape({
  hash: yup.string().required(),
})



