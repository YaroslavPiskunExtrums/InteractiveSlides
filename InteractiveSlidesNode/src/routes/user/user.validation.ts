import yup from 'yup'

export const contentAssignmentValidation = yup.object().shape({
  absoluteLimit: yup.number().min(0).nullable(),
  categoryID: yup.number().min(0).nullable(),
  percentage: yup.number().min(0).max(1).nullable(),
  userID: yup.number().min(0).required(),
  forced: yup.boolean().nullable().default(false),
  wpIDs: yup.array().of(yup.string()).nullable(),
  preview: yup.boolean().nullable().default(false),
})

export const contentRemoveAssignmentValidation = yup.object().shape({
  wpIDs: yup.array().of(yup.string()).min(0).required(),
  userID: yup.number().min(0).required(),
})

export const checkLinkValidation = yup.object({
  link: yup.string().required()
})

export const changePasswordValidation = yup.object({
  link: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().required().test({
    message: 'Passwords are different', name: 'compare', test: (val, context) => {
      return context.parent.password === val
    }
  })
})