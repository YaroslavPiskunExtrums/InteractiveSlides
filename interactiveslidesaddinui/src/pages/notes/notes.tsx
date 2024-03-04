import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import NotesIcon from '@src/pages/notes/components/notes-icon'
import NotesPopUp from '@src/pages/notes/components/notes-pop-up'
import { useDropdown } from '@src/lib/hooks/useDropdown'

interface IProps {
  buttonColor: string
}

const Notes: FC<IProps> = (props) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, togglePopUpHandler] = useDropdown(dropdownRef)
  const [isSession, setIsSession] = useState(false)
  const [isSessionFinish, setIsSessionFinish] = useState(false)
  useEffect(() => {
    if (window) {
      // @ts-ignore
      window.presentation.session ? setIsSession(true) : false
      // @ts-ignore
      Number(window.presentation.isSessionFinished)
        ? setIsSessionFinish(true)
        : setIsSessionFinish(false)
    }
  }, [])

  return (
    <>
      {isSession && !isSessionFinish ? (
        createPortal(
          <div ref={dropdownRef}>
            <NotesIcon buttonColor={props.buttonColor} onClick={togglePopUpHandler} />
            <NotesPopUp isOpen={isOpen} togglePopUpHandler={togglePopUpHandler} />
          </div>,
          document.body
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default Notes
