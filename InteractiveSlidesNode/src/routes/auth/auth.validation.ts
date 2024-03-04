import yup from 'yup'

export const loginValidation = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
})

export const signUpValidation = yup.object().shape({
  username: yup.string(),
  email: yup.string().required(),
  password: yup.string().required(),
  company_id: yup.string().required(),
})

export const signUpTrialValidation = yup.object().shape({
  username: yup.string(),
  email: yup.string().required(),
  password: yup.string().required(),
  company_name: yup.string().required(),
  company_domain: yup.string().required(),
})

export const refreshTokenValidation = yup.object().shape({
  refreshToken: yup.string().required(),
})

export const signOutValidation = yup.object().shape({
  refreshToken: yup.string().nullable(),
})


