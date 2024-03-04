import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ISaveNoteProps, IGetNotesProps, ISlideWithNotes, IDeleteNotePropsAPI } from '@src/pages/notes/notes.types'
import { deleteNote, getNotes, saveNote } from '@src/pages/notes/notes.api'

interface INotesStore {
	items: ISlideWithNotes[]
	loading: boolean

	loadNotes(data: IGetNotesProps, withLoad?: boolean): Promise<void>
	saveNote(data: ISaveNoteProps): Promise<void>
	deleteNote(data: IDeleteNotePropsAPI): Promise<void>
}

type A = (state: Partial<INotesStore>) => Partial<INotesStore>
type SetFunction = (arg: Partial<INotesStore> | A) => void

function notesStore(set: SetFunction, get: () => INotesStore): INotesStore {
	return {
		items: [],
		loading: false,
		async loadNotes(data, withLoad = true) {
			if (withLoad) {
				set({ loading: true })
			}

			try {
				const notes = await getNotes(data)
				set({ items: notes.slides })

			} catch (e) {
				console.log(e)

			} finally {
				if (withLoad) {
					set({ loading: false })
				}
			}
		},

		async saveNote(data) {
			set({ loading: true })

			try {
				await saveNote(data)
				await get().loadNotes({ session_id: data.session_id }, false)

			} catch (e) {
				console.log(e)

			} finally {
				set({ loading: false })
			}
		},

		async deleteNote(data) {
			set({ loading: true })

			try {
				await deleteNote(data)
				await get().loadNotes({ session_id: data.session_id }, false)

			} catch (e) {
				console.log(e)

			} finally {
				set({ loading: false })
			}
		}
	}
}

export const useNotesStore = create<INotesStore>()(
	devtools(notesStore, {
		name: 'notes-store'
	})
)