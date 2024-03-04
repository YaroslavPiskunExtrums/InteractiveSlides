import { Request, Response } from 'express'
import { deleteUserValidation, getUsersValidation } from '@app/routes/saas-users/saas-users.validation.js'
import { SaasCompanyModel } from '@models/saas-company.model.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { extractJwtPayload, extractTokenFromRequest } from '@lib/utils/jwt.js'
import { UserModel } from '@models/user.model.js'

const getUsersBySaasCompany = async (req: Request, res: Response) => {
  const payload = await getUsersValidation.validate(req.params)
  const saasCompany = await SaasCompanyModel.query().where('id', payload.saas_company_id).first()
  // const token = extractTokenFromRequest(req)
  // const userObj = extractJwtPayload(token)


  if (!saasCompany) {
    throw new HttpError(404, 'Saas Company not found')
  }

  const users = await UserModel.query().where('saas_company_id', saasCompany.id).andWhere('id', '!=', saasCompany.owner_id)


  return res.json(users)
}


const deleteUser = async (req: Request, res: Response) => {
  const payload = await deleteUserValidation.validate(req.params)
  const token = extractTokenFromRequest(req)
  const userObj = extractJwtPayload(token)

  const saasCompany = await SaasCompanyModel.query().where('id', userObj.saas_company_id).first()


  if (saasCompany.owner_id !== userObj.id) {
    throw new HttpError(403, 'Only owner can delete users')
  }

  const user = await UserModel.query().delete().where('id', payload.user_id)

  return res.json(user)
}




export const SaasUserController = {
  getUsersBySaasCompany,
  deleteUser,
}
