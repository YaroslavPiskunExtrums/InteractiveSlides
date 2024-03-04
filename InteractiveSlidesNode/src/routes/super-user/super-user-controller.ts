import { Request, Response } from 'express'
import { UserModel } from '@models/user.model.js'
import bcrypt from 'bcrypt'
import { ulid } from 'ulid'
import { SaasCompanyModel } from '@models/saas-company.model.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import {
  deleteUserValidation, getUserHashValidation, loginUserByHashValidation,
  registerUserValidation,
  visitAsUserValidation,
} from '@app/routes/super-user/super-user-validation.js'
import { AuthService } from '@lib/services/auth.service.js'
import jwt from 'jsonwebtoken'
import { Auth } from '@hubspot/api-client/lib/src/services/http/Auth.js'
import { setTempLinkToChangePassword } from '@lib/utils/tempLink.js'
import { SendGridService } from '@lib/services/email/email.service.js'
import { generateTokensPair } from '@app/routes/auth/auth.controller.js'
import { ReqAuth } from '@lib/interfaces/reqAuth.js'


const getUsersList = async (req: Request, res: Response) => {
  const users = await UserModel.query().join('saas_companies', 'users.saas_company_id', 'saas_companies.id')
    .select('saas_companies.name as company_name', 'saas_companies.domain as company_domain', 'saas_companies.owner_id as company_owner_id')
    .select('users.id', 'users.email', 'users.username', 'users.is_super_user')

  return res.json(users)
}

async function registerCompanyOwner(req: Request, res: Response) {
  const payload = await registerUserValidation.validate(req.body)

  let user = await UserModel.query().where('email', payload.email).first()


  if (!user) {
    const tempPassword = ulid().toString().slice(-12)

    const hashedPassword = await bcrypt.hash(tempPassword, 10)


    user = await UserModel.query().insert({
      id: ulid().toString(),
      email: payload.email.toString(),
      password: hashedPassword.toString(),
      username: payload.username.toString(),
    })


    const saasCompany = await SaasCompanyModel.query().insert({
      id: ulid().toString(),
      name: payload.company_name,
      domain: payload.company_domain,
      owner_id: user.id,
    })

    const link = await setTempLinkToChangePassword({ email: user.email, id: user.id })

    console.log(`${process.env.USER_UI_LINK}/change-password?link=${link}`)

    await SendGridService.sendRegistrationEmail({
      email: payload.email,
      password: tempPassword,
      link: `${process.env.USER_UI_LINK}/change-password?link=${link}`,
    })

    user = await UserModel.query().patchAndFetchById(user.id, { saas_company_id: saasCompany.id })


    try {
      return res.json(user)
    } catch (err) {
      throw new HttpError(500, err.message)
    }
  }
  throw new HttpError(400, 'User already exists')
}

const deleteUser = async (req: Request, res: Response) => {
  const { id } = await deleteUserValidation.validate(req.params)
  const user = await UserModel.query().where('id', id).first()
  if (!user) {
    throw new HttpError(404, 'User not found')
  }
  await UserModel.query().deleteById(id)
  return res.json({ message: 'User deleted' })
}

const visitAsUser = async (req: Request, res: Response) => {
  const { userId, refreshToken, accessToken } = await visitAsUserValidation.validate(req.body)
  const user = await UserModel.query().where('id', userId).first()
  if (!user) {
    throw new HttpError(404, 'User not found')
  }

  const saasCompany = await SaasCompanyModel.query().where('id', user.saas_company_id).first()
  console.log('TOKEN', accessToken)


  const token = accessToken.split(' ')[1]


  const tokenData = JSON.parse(atob(token.split('.')[1]))
  const admin = await UserModel.query().where('id', tokenData?.id).first()

  const guestToken = await AuthService.generateAccessToken(refreshToken, {
    id: user.id,
    username: user?.username,
    saas_company_id: user?.saas_company_id,
    companyOwner: user.id === saasCompany?.owner_id,
    is_super_user: user.is_super_user,
    adminRights: {
      is_super_user: admin?.is_super_user,
      id: admin?.id,
      username: admin?.username,
      email: admin?.email,
    },
  })
  return res.json({ accessToken: guestToken })
}

const resolveOneTimeHash = async (req: Request & ReqAuth, res: Response) => {
  const { userId } = await getUserHashValidation.validate(req.query)
  const user = await UserModel.query().where('id', userId).first()

  if (!user) {
    throw new HttpError(404, 'User not found')
  }

  const hash = await AuthService.resolveOneTimeHash(user.id)


  return res.json({ hash })
}


const loginHashUser = async (req: Request & ReqAuth, res: Response) => {
  const adminAuth = req.auth

  const {  hash } = await loginUserByHashValidation.validate(req.body)

  const admin = await UserModel.query().where('id', adminAuth.id).first()



  const hashedUserId = await AuthService.loginHashUser(hash)

  if (hashedUserId) {

    const user = await UserModel.query().where('id', hashedUserId).first()
    const saasCompany = await SaasCompanyModel.query().where('id', user.saas_company_id).first()

    if (!user) {
      throw new HttpError(404, 'User not found')
    }
    const tokens = await generateTokensPair(user.id, {
      id: user.id,
      username: user?.username,
      saas_company_id: user?.saas_company_id,
      companyOwner: user.id === saasCompany?.owner_id,
      is_super_user: user.is_super_user,
      adminRights: {
        is_super_user: admin?.is_super_user,
        id: admin?.id,
        username: admin?.username,
        email: admin?.email,
      },
    })
    return res.json(tokens)
  }

  throw new HttpError(400, 'Invalid hash')

}


export const SuperUserController = {
  getUsersList,
  registerCompanyOwner,
  deleteUser,
  visitAsUser,
  resolveOneTimeHash,
  loginHashUser
}
