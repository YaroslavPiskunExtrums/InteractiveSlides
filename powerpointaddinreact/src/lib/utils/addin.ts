import { generateDeviceId } from '@lib/api/generateDeviceId'
import { generateTempPresentationId } from '@lib/api/generateTempPresentationUrl'
import {
  ADDIN_ID_KEY,
  CONTENT_STATUS_KEY,
  DEVICE_ID_KEY,
  ID_TOKEN_SPLITER,
  SHAPE_NAME_KEY,
  SHAPE_NAME_PREFIX,
} from '@lib/constants/system.constant'
import { usePresentation } from '@store/presentation.store'
import { calculateCurrentDataTime } from './calculateCurrentDataTime'
import { getFromLocalStorage, setToLocalStorage } from './localStorage'
import { ConfigArray, FiguresConfigTypes } from '@/types/figures/figures.types'
import { formateConfig } from './formateConfig'

function retrievePresentationUniqueID() {
  return Office.context.document.settings.get(ADDIN_ID_KEY)
}

function retrieveDeviceID() {
  return localStorage.getItem(DEVICE_ID_KEY)
}

function validatePresentationUniqueID(uniqueID: string) {
  if (uniqueID === null) return false
  const idTokens = uniqueID.split(ID_TOKEN_SPLITER)
  if (idTokens.length < 2) {
    return false
  }
  return validateDeviceID(idTokens[0]) && validatePresentationUrl(idTokens[1])
}

function validatePresentationUrl(url: string) {
  if (Office.context.document.url === '' && url !== '') return true
  if (Office.context.document.url !== url) return false
  return true
}

function validateDeviceID(deviceID: string) {
  return retrieveDeviceID() !== deviceID ? false : true
}

function createPresentationUniqueID() {
  const deviceId = retrieveDeviceID()
  if (deviceId === null) {
    generateDeviceID()
    return
  }

  if (Office.context.document.url !== '') {
    savePresentationUniqueID(deviceId + ID_TOKEN_SPLITER + Office.context.document.url)
    return
  }
  generateTempPresentationUrl(deviceId)
}

async function generateDeviceID() {
  const res = await generateDeviceId()
  if (res.ok) {
    const response = (await res.json()) as { deviceId: string }
    localStorage.setItem(DEVICE_ID_KEY, response.deviceId)
    createPresentationUniqueID()
    return
  }
}

function savePresentationUniqueID(uniqueID: string) {
  Office.context.document.settings.set(ADDIN_ID_KEY, uniqueID)
  Office.context.document.settings.saveAsync()
  usePresentation.getState().setUniqueId(uniqueID)
}

async function generateTempPresentationUrl(deviceId: string) {
  const res = await generateTempPresentationId()
  if (res.ok) {
    const response = (await res.json()) as { tempUrl: string }
    savePresentationUniqueID(deviceId + ID_TOKEN_SPLITER + response.tempUrl)
    return
  }
}

const getPresentationName = () => {
  return Office.context.document.settings.get('presentationName')
}

const setPresentationNameInOffice = (name: string) => {
  Office.context.document.settings.set('presentationName', name)
  console.log(name)
  Office.context.document.settings.saveAsync()
}

const setUploadLinkInOffice = (link: string) => {
  Office.context.document.settings.set('uploadedLink', `${import.meta.env.VITE_BE_URL}${link}`)
  Office.context.document.settings.saveAsync()
  usePresentation.getState().setUploadLinkUrl(`${import.meta.env.VITE_BE_URL}${link}`)
}

const getUploadedLink = () => {
  return Office.context.document.settings.get('uploadedLink')
}

const createPresentationName = () => {
  return getPresentationName() || Office.context.document.url.split(/[/\\]/g).at(-1)?.split('.')[0]
}

function retrieveEmbeddedObjInfo(): Promise<
  {
    name: string
    height: number
    width: number
    left: number
    top: number
  }[][]
> {
  return new OfficeExtension.Promise(function (resolve) {
    PowerPoint.run(async function (context) {
      const embeddedObjInfo: {
        name: string
        height: number
        width: number
        left: number
        top: number
      }[][] = []
      context.presentation.load('slides')
      await context.sync()

      const slides = context.presentation.slides

      const slideCountResult = slides.getCount()

      await context.sync()
      const slideCount = slideCountResult.value

      await context.sync()

      for (let i = 0; i < slideCount; i++) {
        const slideEmbeddedObjInfo: {
          name: string
          height: number
          width: number
          left: number
          top: number
        }[] = []
        const slide = slides.getItemAt(i)

        slide.load('shapes')

        await context.sync()

        const shapes = slide.shapes
        const shapeCountResult = shapes.getCount()

        await context.sync() // need to call context.sync() before calling the property
        const shapeCount = shapeCountResult.value

        for (let j = 0; j < shapeCount; j++) {
          const shape = shapes.getItemAt(j)

          shape.load('id,name,width,height,type,left,top')

          await context.sync()

          if (shape.type === 'Unsupported' && shape.name.startsWith(SHAPE_NAME_PREFIX)) {
            slideEmbeddedObjInfo.push({
              name: shape.name,
              height: shape.height,
              width: shape.width,
              left: shape.left,
              top: shape.top,
            })
          }
        }
        embeddedObjInfo.push(slideEmbeddedObjInfo)
      }
      resolve(embeddedObjInfo)
    })
  })
}

function retrieveShapeName() {
  return Office.context.document.settings.get(SHAPE_NAME_KEY)
}

function saveShapeName(shapeName: string) {
  Office.context.document.settings.set(SHAPE_NAME_KEY, shapeName)
  Office.context.document.settings.saveAsync()
}

const saveConfigToOfficeSettings = (config: FiguresConfigTypes | null) => {
  if (!config) {
    console.error('No config')
    return
  }
  Office.context.document.settings.set(CONTENT_STATUS_KEY, config)
  Office.context.document.settings.saveAsync((res) => {
    console.log(res)
  })
  saveShapeToLS(config)
}

const getConfigFromOfficeSettings = () => {
  return Office.context.document.settings.get(CONTENT_STATUS_KEY)
}

const saveShapeToLS = (config: FiguresConfigTypes | null) => {
  if (!config) return
  const presentationItems =
    getFromLocalStorage<{ name: string; config: FiguresConfigTypes }[]>('presentationItems')
  const shapeName = retrieveShapeName()
  if (!presentationItems) {
    setToLocalStorage('presentationItems', [{ name: shapeName, config }])
    return
  }

  const presentationItem = presentationItems.find((item) => item.name === shapeName)

  if (!presentationItem) {
    const items = [...presentationItems, { name: shapeName, config }]
    setToLocalStorage('presentationItems', items)
    return
  }

  const updatedPresentationItems = presentationItems.map((item) =>
    item.name === shapeName ? { ...item, config } : item
  )
  setToLocalStorage('presentationItems', updatedPresentationItems)
}

const validateShapeName = (shapeName: string) => {
  if (shapeName == null) return false
  if (shapeName.startsWith(SHAPE_NAME_PREFIX)) return true
  return false
}

function setContentAddInName() {
  return new Promise(function (resolve) {
    Office.context.document.getSelectedDataAsync(
      Office.CoercionType.SlideRange,
      async function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          console.log('The selected data is:', asyncResult.value)
          const {
            slides: [selectedSlide],
          } = asyncResult.value as {
            slides: { index: number }[]
          }

          PowerPoint.run(async function (context) {
            const slides = context.presentation.slides

            await context.sync() // need to call context.sync() before calling the property
            const slide = slides.getItemAt(selectedSlide.index - 1)
            const shapes = slide.shapes
            const shapeCountResult = shapes.getCount()

            await context.sync() // need to call context.sync() before calling the property
            const shapeCount = shapeCountResult.value
            const shape = shapes.getItemAt(shapeCount - 1)
            shape.load('id,name,width,height,type,left,top')
            await context.sync()

            slide.load('shapes')

            await context.sync()

            const cachedName = retrieveShapeName()
            if (cachedName && cachedName.indexOf(SHAPE_NAME_PREFIX) !== -1) {
              resolve(cachedName)
              return
            }

            shape.name = SHAPE_NAME_PREFIX + '.' + calculateCurrentDataTime()

            await context.sync()
            saveShapeName(shape.name)
            resolve(shape.name)
          })
        }
      }
    )
  })
}

const checkAndCreateShapeName = async () => {
  if (!validateShapeName(retrieveShapeName())) {
    await setContentAddInName().then(function (shapeName) {
      saveShapeName(shapeName as string)
    })
  }
}

const getSavedConfig = () => {
  const shapeName = retrieveShapeName()
  if (!validateShapeName(shapeName)) {
    return null
  }

  const configFromSettings = getConfigFromOfficeSettings()
  if (configFromSettings) {
    return formateConfig(configFromSettings)
  }

  const presentationItems =
    getFromLocalStorage<{ name: string; config: FiguresConfigTypes | ConfigArray }[]>(
      'presentationItems'
    )

  if (!presentationItems) {
    return null
  }

  const isExistItemInLocalStorage = presentationItems.find((item) => item.name === shapeName)

  if (!isExistItemInLocalStorage) {
    return null
  }

  return formateConfig(isExistItemInLocalStorage.config)
}

const getLabelOptionsFromOffice = () => {
  return Office.context.document.settings.get('labels-options') as string[] | undefined
}

const setLabelOptionsToOffice = (labels: string[]) => {
  Office.context.document.settings.set('labels-options', labels)
  Office.context.document.settings.saveAsync()
}

export {
  createPresentationName,
  getUploadedLink,
  retrievePresentationUniqueID,
  validatePresentationUniqueID,
  validatePresentationUrl,
  validateDeviceID,
  retrieveDeviceID,
  createPresentationUniqueID,
  generateDeviceID,
  generateTempPresentationUrl,
  savePresentationUniqueID,
  setPresentationNameInOffice,
  getPresentationName,
  retrieveEmbeddedObjInfo,
  setUploadLinkInOffice,
  saveConfigToOfficeSettings,
  validateShapeName,
  retrieveShapeName,
  saveShapeName,
  setContentAddInName,
  checkAndCreateShapeName,
  getSavedConfig,
  getLabelOptionsFromOffice,
  setLabelOptionsToOffice,
  saveShapeToLS,
  getConfigFromOfficeSettings,
}
