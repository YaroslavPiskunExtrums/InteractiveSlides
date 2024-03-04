import { getNumberOfSlide } from '@src/lib/utils/get-number-of-slide'
import './notes-records.sass'
import RemoveSVG from '@src/pages/notes/components/assets/remove'
import { useNotesStore } from '../notes.store'
import { getSessionId } from '@src/lib/utils/get-session-id'
import { MouseEvent } from 'react'

interface IProps {}

const NotesRecords = (props: IProps) => {
  const { items, loading, deleteNote } = useNotesStore()
  const notesToSlide = items.find((item) => Number(item.slide) === getNumberOfSlide(window))?.notes

  const removeHandler = (e: MouseEvent<HTMLDivElement>, id: string) => {
    e.nativeEvent.stopImmediatePropagation()
    if (!window) return
    deleteNote({ note_id: id, session_id: getSessionId(window) })
  }

  return (
    <div className="notes-wrapper">
      {!loading &&
        notesToSlide?.map((note) => (
          <div key={note.id} className="note-container">
            <div className="remove-note-icon" onClick={(e) => removeHandler(e, note.id)}>
              <RemoveSVG />
            </div>
            <div className="note-text">{note.note}</div>
          </div>
        ))}
    </div>
  )
}

export default NotesRecords
