import { useEffect } from 'react'
import { useOffice } from '@store/office.store'
import { appRouter } from '@lib/routes/appRouter'
import {
  createPresentationName,
  createPresentationUniqueID,
  getUploadedLink,
  retrievePresentationUniqueID,
  validatePresentationUniqueID,
} from '@lib/utils/addin'
import { usePresentation } from '@store/presentation.store'

const App = () => {
  const { setIsOfficeReady, isOfficeReady } = useOffice()
  const { setPresentationName, setUploadLinkUrl, setUniqueId } = usePresentation()
  let location = window.location.pathname
  location = location.endsWith('/') ? location : location + '/'

  useEffect(() => {
    if (!window) return
    const Office = window.Office
    if (!Office) return
    Office.onReady(async () => {
      setIsOfficeReady(true)

      let uniqueID = retrievePresentationUniqueID()
      const presentationNameValue = createPresentationName()
      setPresentationName(presentationNameValue)

      if (!validatePresentationUniqueID(uniqueID)) {
        createPresentationUniqueID()
        uniqueID = retrievePresentationUniqueID()
      }
      setUniqueId(uniqueID)

      const link = getUploadedLink()
      setUploadLinkUrl(link)

      console.log(
        `Office Ready, presentation name: ${presentationNameValue}, unique id : ${uniqueID}, upload link url: ${link}`
      )
    })
  }, [setIsOfficeReady, setPresentationName, setUploadLinkUrl, setUniqueId])

  return isOfficeReady ? appRouter[location] : <></>
}

export default App
