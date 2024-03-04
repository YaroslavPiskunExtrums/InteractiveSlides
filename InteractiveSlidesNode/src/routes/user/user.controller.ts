import { getUserIdFromLink, removeLinkToChangePassword } from '@app/lib/utils/tempLink.js'
import { Request, Response } from 'express'
import { changePasswordValidation, checkLinkValidation } from './user.validation.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js';
import bcrypt from 'bcrypt'
import { UserModel } from '@app/lib/db/models/user.model.js';
import { fromBase64 } from '@app/lib/utils/hash.js';

// import { sqlDatabase } from "@lib/db/sql.client.js";
// import { alias } from "@lib/utils/database.js";
// import { CCSUserModel } from "@models/ccs-user.model.js";
// import { CCSUserRoleModel } from "@models/ccs-user-role.model.js";
// import { CCSRoleModel, ICCSRole } from "@models/ccs-role.model.js";
// import { AssignmentsRepository } from "@lib/repositories/assignments.repository.js";
// import { contentAssignmentValidation, contentRemoveAssignmentValidation } from "@app/routes/user/user.validation.js";
// import { ProductAssignmentModel } from "@models/product-assignment.model.js";
//
// async function listUsers(req: Request, res: Response) {
//   const { limit, offset } = req.query
//
//   const users = await CCSUserModel.query()
//     .from(alias(CCSUserModel.tableName, 'ccs_users'))
//     .leftJoin(q => {
//       q.from(alias(ProductAssignmentModel.tableName, 'pa'))
//         .select('pa.user_id', sqlDatabase().raw('COUNT(pa.user_id) as products'))
//         .groupBy('pa.user_id')
//         .as('pa')
//     }, 'pa.user_id', 'ccs_users.id')
//     .select('ccs_users.*', 'pa.products as assignments')
//     .limit(parseInt(limit as string, 10) || 10)
//     .offset(parseInt(offset as string, 10) || 0) as unknown as (CCSUserModel & { assignments: number })[]
//
//   const roles = await CCSUserRoleModel.query()
//     .from(alias(CCSUserRoleModel.tableName, 'rs'))
//     .innerJoin(alias(CCSRoleModel.tableName, 'r'), 'r.id', 'rs.role_id')
//     .whereIn('rs.user_id', users.map((user) => user.id)) as unknown as (ICCSRole & { user_id: number })[]
//
//   let userRoles: Record<string, string[]> = {}
//   roles.forEach(role => {
//     if (!userRoles[role.user_id]) {
//       userRoles[role.user_id] = []
//     }
//
//     userRoles[role.user_id].push(role.name)
//   })
//
//   res.json({
//     list: users.map(user => {
//       return {
//         ...user,
//         assignments: user.assignments || 0,
//         roles: userRoles[user.id] || []
//       }
//     })
//   })
// }
//
// async function removeAssignments(req: Request, res: Response) {
//   const payload = await contentRemoveAssignmentValidation.validate(req.body)
//   await AssignmentsRepository.removeAssignments({
//     wpIDs: payload.wpIDs,
//     userID: payload.userID
//   })
//
//   res.json({
//     status: 'OK'
//   })
// }
//
// async function assignUsersToProducts(req: Request, res: Response) {
//   const payload = await contentAssignmentValidation.validate(req.body)
//
//   const products = await AssignmentsRepository.assignProducts({
//     absoluteLimit: payload.absoluteLimit,
//     categoryID: payload.categoryID,
//     forced: payload.forced,
//     percentage: payload.percentage,
//     preview: payload.preview,
//     userID: payload.userID,
//     wpIDs: payload.wpIDs
//   })
//
//   res.json({
//     products
//   })
// }
//
// async function getMe(req: Request, res: Response) {
//   const user = await CCSUserModel.query()
//     .where('auth0_id', req.auth.sub)
//     .first()
//
//   if (!user) {
//     throw new HttpError(404, 'User not found')
//   }
//
//   const roles = await CCSUserRoleModel.query()
//     .from(alias(CCSUserRoleModel.tableName, 'rs'))
//     .innerJoin(alias(CCSRoleModel.tableName, 'r'), 'r.id', 'rs.role_id')
//     .where('rs.user_id', user.id)
//     .select('r.*') as unknown as ICCSRole[]
//
//   res.json({
//     user,
//     permissions: req.auth.permissions,
//     roles,
//   })
// }
//

const checkLink = async (req: Request, res: Response) => {
	const query = req.query

	const payload = await checkLinkValidation.validate(query)

	const data = await getUserIdFromLink(payload.link)
	if (!data) {
		throw new HttpError(400, 'Wrong link')
	}
	res.status(200).json({ status: 'ok' })
}

const changePassword = async (req: Request, res: Response) => {

	const payload = await changePasswordValidation.validate(req.body)

	const userId = await getUserIdFromLink(payload.link)

	if (!userId) {
		throw new HttpError(404, 'User not found')
	}

	const isUserExist = await UserModel.query().where({ 'id': userId }).first()

	if (!isUserExist) {
		throw new HttpError(404, 'User not found')
	}

	const [userEmailFromLink, userIdFromLink] = fromBase64(payload.link).split(',')

	if (userEmailFromLink !== isUserExist.email) {
		throw new HttpError(400, 'Wrong link')
	}

	const hashedNewPassword = await bcrypt.hash(payload.password, 10)
	await UserModel
		.query()
		.where({ email: userEmailFromLink, id: userId })
		.patch({ password: hashedNewPassword })

	await removeLinkToChangePassword(payload.link)

	res.status(200).json({ status: 'ok' })

}
export const UserController = {
	checkLink,
	changePassword
	// getMe,
	// listUsers,
	// removeAssignments,
	// assignUsersToProducts
}
