import { figuresName } from '@app/lib/constants/figures.js'
import yup from 'yup'

export const presentationIdValidation = yup.object().shape({
  uniqueID: yup.string().required(),
  dateTime: yup.string().required(),
})

export const presentationViewValidation = yup.object().shape({
  id: yup.string().required(),
})

export const presentationDeleteValidation = yup.object().shape({
  id: yup.string().required(),
})

export const presentationEditColorValidation = yup.object().shape({
  id: yup.string().required(),
  color: yup.string().required(),
  scope: yup.string().required(),
})

export const presentationSessionCreateValidation = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  company_name: yup.string().required(),
  sales_name: yup.string().required(),
  hs_object_id: yup.string(),
  hs_company_id: yup.string(),
})


export const presentationResultSaveValidation = yup.object().shape({
  session: yup.string().required(),
  figures: yup.object().required(),
})
export const presentationResultFinishValidation = yup.object().shape({
  session: yup.string().required(),
})

export const getPresentationSessionAnswersValidation = yup.object().shape({
  id: yup.string().required(),
})

export const deletePresentationSessionValidation = yup.object().shape({
  id: yup.string().required(),
  user_id: yup.string().required(),
})

export const getUsersPresentationsValidation = yup.object().shape({
  user_id: yup.string().required(),
})

export const getCompaniesPresentationsValidation = yup.object().shape({
  saas_company_id: yup.string().required(),
})

export const saveDefaultStylesValidation = yup.object().shape({
  target: yup.string().required()
    .test({ message: 'Unexpected target', test: (item) => figuresName.includes(item) }),
  saas_company_id: yup.string().required(),
  styles: yup.string().required(),
})

export const finishSessionValidation = yup.object().shape({
  session_id: yup.string().required(),
})

export const patchPresentationTitleValidation = yup.object().shape({
  presentation_id: yup.string().required(),
  new_title: yup.string().required().min(3),
})

export const patchPresentationTransitionValidation = yup.object().shape({
  presentation_id: yup.string().required(),
  transition: yup.string().required(),
})

export const autosavePresentationValidation = yup.object({
  sessionId: yup.string().required(),
  figure: yup.object({
    value: yup.lazy(val => (Array.isArray(val) ? yup.array().of(yup.string()) : yup.string())),
    fullName: yup.string().nullable(),
    business: yup.string().nullable(),
    phone: yup.string().nullable(),
    email: yup.string().nullable(),
    additionalFields: yup.array().of(yup.string()).nullable(),
    textMessage: yup.string().nullable(),
    id: yup.string(),
  }).required(),
})

export const presentationSessionReadonlyValidation = yup.object({
  session_id: yup.string().required(),
})

export const getRedonlySessionValidation = yup.object().shape({
  id: yup.string().required(),
})
