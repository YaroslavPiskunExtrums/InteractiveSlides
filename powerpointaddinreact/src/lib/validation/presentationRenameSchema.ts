import * as yup from 'yup'

const presentationRenameSchema = yup.object().shape({
  presentationName: yup.string().required('Presentation name is required'),
})

export { presentationRenameSchema }
