import { apiUrl } from '@src/lib/constants/apiUrl'
import { DeleteNote, GetNotes, SaveNote } from '@src/pages/notes/notes.types'

const saveNote: SaveNote = async ({ session_id, number_of_slide, note }) => {
	const res = await fetch(`${apiUrl}/api/slide-note/save-slides-notes`, {
		body: JSON.stringify({ session_id, number_of_slide, note }),
		method: 'POST',
		headers: { 'Content-Type': 'application/json', },
	})
	if (!res.ok) {
		console.error(res)
		throw res.json()
	}
	return res.json()
}

const getNotes: GetNotes = async (data) => {
	const res = await fetch(`${apiUrl}/api/slide-note/get-slides-notes/${data.session_id}`, {
		method: 'GET',
		headers: { "Content-Type": "application/json", }
	})
	if (!res.ok) {
		console.error(res,)
		throw res.json()
	}
	return res.json()
}

const deleteNote: DeleteNote = async (data) => {
	const res = await fetch(`${apiUrl}/api/slide-note/del-slides-note/${data.note_id}`, {
		method: 'DELETE',
		headers: { "Content-Type": "application/json", }
	})
	if (!res.ok) {
		console.error(res,)
		throw res.json()
	}
	return res.json()
}

export { saveNote, getNotes, deleteNote }