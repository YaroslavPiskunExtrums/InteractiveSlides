import yup from 'yup'




export const savePresentationValidation = yup.object().shape({
  idx: yup.number().min(0).required(),
  uniqueID: yup.string().required(),
  base64BlobData: yup.string().required(),
  dateTime: yup.string().required(),
})

const embeddedObjInfoValidation = yup.object().shape({
  height: yup.number().required(),
  left: yup.number().required(),
  top: yup.number().required(),
  width: yup.number().required(),
  name: yup.string().required(),
  config: yup.object(),
});
export const sendObjectValidation = yup.object().shape({
  embeddedObjInfo: yup
    .array()
    .of(yup.array().of(embeddedObjInfoValidation))
    .required(),
  dateTime: yup.string().required(),
  uniqueID: yup.string().required(),
})

export const renamePresentationValidation = yup.object().shape({
  name: yup.string().required(),
  uniqueID: yup.string().required(),
})

export const finishPresentationValidation = yup.object().shape({
  uniqueID: yup.string().required()
})

