import * as yup from 'yup'


const addUserModalValidation = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company_name: yup.string().required('Company name is required'),
  company_domain: yup.string().required('Company domain is required'),
})

export { addUserModalValidation }