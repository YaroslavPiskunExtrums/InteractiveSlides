import { Router } from 'express'
import { TagController } from './tags-controller.js'

export function tagsRouter(): Router {
	const router = Router({ mergeParams: true })

	router.get('/get-tags', TagController.getTags)
	router.post('/create-tags', TagController.createTag)
	router.post('/link-presentation-to-tag', TagController.linkPresentationToTag)
	router.patch('/update-tag-title', TagController.updateTagTitle)
	router.delete('/remove-tag/:tag_id', TagController.removeTag)

	return router
}