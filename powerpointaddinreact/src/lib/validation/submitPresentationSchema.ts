import * as yup from 'yup'

const submitPresentationSchema = yup.object().shape({
  presentationName: yup.string().required('Presentation name is required'),
})

export { submitPresentationSchema }
