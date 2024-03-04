import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react'
import './notes-pop-up.sass'
import Button from '@src/pages/notes/components/button'
import CloseSVG from '@src/pages/notes/components/assets/close'
import { useNotesStore } from '@src/pages/notes/notes.store'
import { getNumberOfSlide } from '@src/lib/utils/get-number-of-slide'
import { getSessionId } from '@src/lib/utils/get-session-id'
import NotesRecords from '@src/pages/notes/components/notes-records'

interface IProps {
  isOpen: boolean
  togglePopUpHandler: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void
}

const NotesPopUp: FC<IProps> = (props) => {
  const [note, setNote] = useState<string>('')
  const { loadNotes, saveNote } = useNotesStore()

  const saveHandler = (e: MouseEvent<HTMLButtonElement>) => {
    if (!note) return
    const session_id = getSessionId(window)
    const number_of_slide = getNumberOfSlide(window)
    if (session_id && number_of_slide) {
      saveNote({ note, number_of_slide, session_id })
    }

    setNote('')
  }

  const cancelHandler = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    setNote('')
    props.togglePopUpHandler(e)
  }

  const textAreaHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
  }

  useEffect(() => {
    const session_id = getSessionId(window)
    loadNotes({ session_id })
  }, [])

  if (!props.isOpen) return <></>
  return (
    <div className="pop-up-wrapper">
      <div className="close-icon" onClick={cancelHandler}>
        <CloseSVG />
      </div>
      <NotesRecords />
      <div className="pop-up-container">
        <textarea
          name="pop-up-area"
          id="pop-up-area"
          cols={30}
          rows={7}
          placeholder="Write here your note..."
          onChange={textAreaHandler}
          value={note}
        />
        <div className="action-container">
          <Button onClick={saveHandler}>Save</Button>
          <Button onClick={cancelHandler}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default NotesPopUp
