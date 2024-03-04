const BE_URL = import.meta.env.VITE_BE_URL

export const links = {
  signUpTrial: BE_URL + '/api/auth/sign-up-trial',
  signIn: BE_URL + '/api/auth/sign-in',
  regenerateAccessToken: BE_URL + '/api/auth/regenerate-token',
  renamePresentation: BE_URL + '/api/TaskPanelAddIn/rename-presentation',
  generateDeviceId: BE_URL + '/api/DeviceID/GenerateDeviceId',
  generateTempPresentationId: BE_URL + '/api/DeviceID/GenerateTempPresentationUrl',
  cleanPresentation: BE_URL + '/api/TaskPanelAddIn/clean-presentation',
  saveBlob: BE_URL + '/api/TaskPanelAddIn/SaveBlob',
  sendEmbeddedObjInfo: BE_URL + '/api/TaskPanelAddIn/SendEmbeddedObjInfo',
  finishPresentation: BE_URL + '/api/TaskPanelAddIn/finish-presentation',
  defaultStyles: BE_URL + '/api/HTML/get-default-styles',
  figureConfig: BE_URL + '/api/ContentAddIn/get-figure-config/',
}
