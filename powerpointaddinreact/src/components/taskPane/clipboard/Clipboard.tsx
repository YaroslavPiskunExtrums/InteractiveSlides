import CheckMarkSvg from '@assets/CheckMarkSvg'
import CopySvg from '@assets/CopySvg'
import { getUploadedLink } from '@lib/utils/addin'
import { useState } from 'react'
import classes from './clipboard.module.scss'

const Clipboard = () => {
  const [isClipboardClicked, setIsClipboardClicked] = useState(false)

  const onClipboardHandler = async () => {
    if (isClipboardClicked) return

    setIsClipboardClicked(true)
    const link = getUploadedLink()
    await navigator.clipboard.writeText(`${link}`)

    setTimeout(() => {
      setIsClipboardClicked(false)
    }, 1000)
  }

  const onOpenPresentation = () => {
    const link = getUploadedLink()
    Office.context.ui.displayDialogAsync(
      `${link}`,
      { height: 720, width: 1280 },
      function (asyncResult) {
        console.log('OPEN NEW WINDOW RESULT', asyncResult)
      }
    )
  }
  return (
    <div className={classes.clipboardWrapper}>
      <span>Preview your presentation</span>
      <span className={classes.openPresentation} onClick={onOpenPresentation} role="button">
        here
      </span>
      <button onClick={onClipboardHandler} className={classes.clipboardBtn}>
        {isClipboardClicked ? <CheckMarkSvg /> : <CopySvg />}
      </button>
    </div>
  )
}

export default Clipboard
