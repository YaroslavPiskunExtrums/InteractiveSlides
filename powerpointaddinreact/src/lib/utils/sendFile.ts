import { saveBlob } from '@lib/api/saveBlob'
import { links } from '@lib/constants/api.constants'
import { defaultConfig, pageStatus } from '@lib/constants/config'
import type { FiguresConfigTypes } from '@/types/figures/figures.types'
import {
  retrieveEmbeddedObjInfo,
  retrievePresentationUniqueID,
  setUploadLinkInOffice,
  validatePresentationUniqueID,
} from './addin'
import { authFetch } from './authFetch'
import { getSelectedItem } from './getFigureType'

export const sendFile = (date: string) => {
  Office.context.document.getFileAsync(
    Office.FileType.Compressed,
    { sliceSize: 100000 },
    function (result) {
      if (result.status !== Office.AsyncResultStatus.Succeeded) return

      // Get the File object from the result.
      const myFile = result.value
      const state = {
        file: myFile,
        counter: 0,
        sliceCount: myFile.sliceCount,
      }

      getSlice(state, date)
    }
  )
}

type State = {
  file: Office.File
  counter: number
  sliceCount: number
}

function getSlice(state: State, curDateTime: string) {
  state.file.getSliceAsync(state.counter, function (result) {
    if (result.status !== Office.AsyncResultStatus.Succeeded) return
    sendSlice(result.value, state, curDateTime)
  })
}

function b64EncodeUnicode(str: string) {
  return btoa(encodeURIComponent(str))
}

function closeFile(state: State) {
  state.file.closeAsync()
}

async function sendEmbeddedObjInfo(
  embeddedObjInfo: {
    name: string
    height: number
    width: number
    left: number
    top: number
    config?: object
  }[][],
  curDateTime: string
) {
  const presentationItems = localStorage.getItem('presentationItems')
  let presentationItemsConfig: { name: string; config: FiguresConfigTypes }[]
  if (presentationItems) {
    presentationItemsConfig = JSON.parse(presentationItems)
  } else {
    presentationItemsConfig = []
  }

  embeddedObjInfo.forEach((slide) => {
    slide.forEach((shape) => {
      const configFromLS = presentationItemsConfig.find((item) => item.name === shape.name)?.config
      if (!configFromLS) return
      const selectedItem = getSelectedItem(configFromLS.figureType)
      const newConfig = defaultConfig.itemConfig.map((item, index) => {
        return index !== selectedItem ? item : configFromLS
      })
      shape.config = {
        currentPage: pageStatus.FINALPAGE,
        selectedItem,
        itemConfig: newConfig,
      }
      // shape.config = presentationItemsConfig.find((item) => item.name === shape.name)?.config;
    })
  })

  const dataToSend = {
    dateTime: curDateTime,
    uniqueID: retrievePresentationUniqueID(),
    embeddedObjInfo: embeddedObjInfo,
  }

  if (!validatePresentationUniqueID(dataToSend.uniqueID)) {
    console.log('Invalid presentation unique id, stop sending embedded obj info.')
    return
  }

  const res = await authFetch(links.sendEmbeddedObjInfo, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })

  if (!res?.ok) {
    console.log(res?.status, res?.statusText)
    return
  }

  const finishPresentationRes = await authFetch(links.finishPresentation, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateTime: curDateTime,
      uniqueID: retrievePresentationUniqueID(),
    }),
  })

  const finishPresentationResponse = (await finishPresentationRes?.json()) as {
    link: string
    success: boolean
  }

  if (!finishPresentationResponse.success) {
    console.log('Presentation saving failed.')
    return
  }

  setUploadLinkInOffice(finishPresentationResponse.link)
}

async function sendSlice(slice: Office.Slice, state: State, curDateTime: string) {
  const data = slice.data

  // If the slice contains data, create an HTTP request.
  if (!data) return

  const fileData = b64EncodeUnicode(data)

  const dataToSend = {
    dateTime: curDateTime,
    idx: slice.index,
    uniqueID: retrievePresentationUniqueID(),
    base64BlobData: fileData,
  }

  // validate the presentation unique id, if not valid, then return
  if (!validatePresentationUniqueID(dataToSend.uniqueID)) {
    closeFile(state)
    return
  }

  const response = await saveBlob(dataToSend)

  if (response?.ok) {
    console.log('Sent ' + slice.size + ' bytes.')
    state.counter++

    if (state.counter < state.sliceCount) {
      getSlice(state, curDateTime)
    } else {
      closeFile(state)

      console.log('Retrieving embedded object info.')
      // collect addin object information, and send it to the server
      retrieveEmbeddedObjInfo().then(function (embeddedObjInfo) {
        sendEmbeddedObjInfo(embeddedObjInfo, curDateTime)
      })
    }
  } else {
    console.log('Sending blob failed.')
  }
}
