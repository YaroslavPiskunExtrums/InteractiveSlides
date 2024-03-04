interface IGetNotesProps {
	session_id: string
}

interface INote {
	note: string
	id: string
}

interface ISlideWithNotes {
	slide: number
	notes: INote[] | null
}

interface ISlidesWithNotes {
	slides: ISlideWithNotes[]
}

interface ISaveNoteProps {
	number_of_slide: number
	session_id: string
	note: string
}

interface ISaveNoteRes {
	status: 'ok'
}

interface IDeleteNoteProps {
	note_id: string
}

interface IDeleteNotePropsAPI extends IDeleteNoteProps {
	session_id: string
}

interface IDeleteNoteRes extends ISaveNoteRes { }

type GetNotes = (data: IGetNotesProps) => Promise<ISlidesWithNotes>
type SaveNote = (data: ISaveNoteProps) => Promise<ISaveNoteRes>
type DeleteNote = (data: IDeleteNoteProps) => Promise<IDeleteNoteRes>

export {
	GetNotes,
	SaveNote,
	DeleteNote,
	ISaveNoteProps,
	IGetNotesProps,
	IDeleteNoteProps,
	ISlideWithNotes,
	IDeleteNotePropsAPI
}