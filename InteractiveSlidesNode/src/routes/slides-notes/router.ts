import { Router } from 'express'
import { SlidesNotesController } from '@app/routes/slides-notes/slides-notes-controller.js'

export function slidesNotesRouter(): Router {
	const router = Router({ mergeParams: true })

	router.get('/get-slides-notes/:session_id', SlidesNotesController.getSlideNotes)

	router.post('/save-slides-notes', SlidesNotesController.saveSlideNote)

	router.delete('/del-slides-note/:note_id', SlidesNotesController.deleteSlideNote)

	return router
}