import { Request, Response } from 'express'
import { deleteSlidesNoteValidation, getSlidesNotesValidation, saveSlidesNoteValidation } from '@app/routes/slides-notes/slides-notes-validation.js'
import { PresentationLinksModel } from '@app/lib/db/models/presentation-links-model.js'
import { HttpError } from '@app/lib/utils/middlewares/http-error.js'
import { SlideModel } from '@app/lib/db/models/slide.model.js'
import { SlidesNotesModel } from '@app/lib/db/models/slides-notes.model.js'
import { HubspotService } from '@app/lib/services/hubspot.service.js'


interface INote {
	note: string
	id: string
}

interface IGetSlideNotesRes {
	slide: number,
	notes: INote[] | null
}

const getSlideNotes = async (req: Request, res: Response) => {
	const payload = await getSlidesNotesValidation.validate(req.params)

	const getPresentationId = await PresentationLinksModel
		.query()
		.findById(payload.session_id)
		.select(['presentation_id'])

	if (!getPresentationId?.presentation_id) {
		throw new HttpError(404, 'Session has not found')
	}

	const getSlides = await SlideModel
		.query()
		.where('presentation_id', getPresentationId.presentation_id)

	if (!getSlides.length) {
		throw new HttpError(404, 'Slides has not found')
	}

	const notes = await SlidesNotesModel
		.query()
		.where('session_id', payload.session_id)
		.whereIn('slide_id', getSlides.map(slide => slide.id))

	const slides: IGetSlideNotesRes[] = getSlides.map(slide => {

		const slidesNotes = notes.reduce<INote[]>((acc, slidesNote) => {
			return slidesNote.slide_id === slide.id ?
				[...acc, { note: slidesNote.note, id: slidesNote.id }] :
				acc
		}, [])

		return slidesNotes.length ?
			{ slide: slide.slide, notes: slidesNotes } :
			{ slide: slide.slide, notes: null }
	})


	res.status(200).json({ slides })
}

const saveSlideNote = async (req: Request, res: Response) => {
	const payload = await saveSlidesNoteValidation.validate(req.body)

	const session = await PresentationLinksModel
		.query()
		.findById(payload.session_id)


	if (!session?.presentation_id) {
		throw new HttpError(404, 'Session has not found')
	}

	const slide = await SlideModel
		.query()
		.where('presentation_id', session.presentation_id)
		.andWhere('slide', payload.number_of_slide)
		.first()

	if (!slide?.id) {
		throw new HttpError(404, 'Slide has not found')
	}

	const note = await HubspotService.saveNote(session, payload.note, payload.number_of_slide, slide.id)

	const saveNoteInDB = await SlidesNotesModel
		.query()
		.insert({
			note: payload.note,
			session_id: payload.session_id,
			slide_id: slide.id,
			hubspot_note_id: note?.id ?? null
		})

	if (!saveNoteInDB) {
		throw new HttpError(400, 'Saving error')
	}

	res.send(JSON.stringify({ status: 'ok' }))
}

const deleteSlideNote = async (req: Request, res: Response) => {
	const payload = await deleteSlidesNoteValidation.validate(req.params)
	const note = await SlidesNotesModel.query().where('id', payload.note_id).first()
	if (!note) {
		throw new HttpError(404, 'Note not found')
	}

	await HubspotService.deleteNote(note)

	const removedNote = await SlidesNotesModel.query().deleteById(note.id)

	res.status(200).json({ status: 'ok' })
}

export const SlidesNotesController = {
	getSlideNotes,
	saveSlideNote,
	deleteSlideNote
}