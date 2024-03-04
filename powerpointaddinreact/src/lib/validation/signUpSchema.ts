import * as yup from 'yup'

const signUpSchema = yup.object().shape({
  email: yup.string().required().email().min(1),
  password: yup.string().required().min(1),
  username: yup.string().required().min(1),
  companyName: yup.string().required().min(1),
  companyDomain: yup.string().required().min(1),
})

export { signUpSchema }
