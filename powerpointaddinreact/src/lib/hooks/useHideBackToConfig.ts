import { useState } from 'react'

export const useHideBackToConfig = () => {
  const [isHide, setIsHide] = useState(false)

  Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, function (e: any) {
    if (e.activeView === 'read') {
      setIsHide(true)
      return
    }
    setIsHide(false)
  })
  return isHide
}
