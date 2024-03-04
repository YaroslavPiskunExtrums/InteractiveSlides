import * as yup from 'yup'

const signInSchema = yup.object().shape({
  email: yup.string().required().email().min(1),
  password: yup.string().required().min(1),
})

export { signInSchema }
