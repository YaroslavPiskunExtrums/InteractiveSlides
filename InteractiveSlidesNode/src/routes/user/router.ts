import { Router } from 'express'
import { UserController } from './user.controller.js'

// import { UserController } from "@app/routes/user/user.controller.js";

export function userRouter(): Router {
	const router = Router({ mergeParams: true })

	// router.get('/me', UserController.getMe)
	// router.get('/', UserController.listUsers)
	// router.post('/assignments', UserController.assignUsersToProducts)
	// router.delete('/assignments', UserController.removeAssignments)
	router.get('/check-link', UserController.checkLink)
	router.post('/change-password', UserController.changePassword)

	return router
}
