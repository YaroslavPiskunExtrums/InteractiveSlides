import { Request, Response } from 'express'
import {
  loginValidation,
  refreshTokenValidation,
  signOutValidation, signUpTrialValidation,
  signUpValidation,
} from '@app/routes/auth/auth.validation.js'
import { IUser, UserModel } from '@models/user.model.js'
import { ulid } from 'ulid'
import bcrypt from 'bcrypt'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { getRedisClient } from '@lib/db/redis.client.js'
import { AuthService } from '@lib/services/auth.service.js'
import { HubspotService } from '@lib/services/hubspot.service.js'
import { SaasCompanyModel } from '@models/saas-company.model.js'
import { setTempLinkToChangePassword } from '@app/lib/utils/tempLink.js'
import { SendGridService } from '@app/lib/services/email/email.service.js'


interface IAdminRights {
  is_super_user?: boolean,
  id?: string,
  username?: string,
  email?: string,
}


export async function generateTokensPair(userId: string, user: Partial<IUser> & { companyOwner?: boolean } & { adminRights?: IAdminRights }) {
  const refreshToken = await AuthService.generateRefreshToken(userId)
  const accessToken = await AuthService.generateAccessToken(refreshToken, { ...user })

  return { accessToken, refreshToken }
}

async function signIn(req: Request, res: Response) {
  const payload = await loginValidation.validate(req.body)
  const user = await UserModel.query().where('email', payload.email).first()

  const saasCompany = await SaasCompanyModel.query().where('id', user.saas_company_id).first()


  if (!user) {
    throw new HttpError(400, 'User not found')
  }
  const isPasswordValid = await bcrypt.compare(payload.password, user.password)
  if (!isPasswordValid) {
    throw new HttpError(400, 'Invalid password')
  }

  const hubspotIntegrationsKeys = await HubspotService.getUsersTokens(user.id)

  const tokens = await generateTokensPair(user.id, {
    username: user.username,
    saas_company_id: user.saas_company_id,
    companyOwner: user.id === saasCompany?.owner_id,
    is_super_user: user?.is_super_user,
    is_trial_user: user?.is_trial_user,
  })
  return res.json({ ...tokens, integrations: { hubspot: hubspotIntegrationsKeys } })
}

async function signUp(req: Request, res: Response) {
  const auth = req.headers.authorization
  const token = auth.split(' ')[1]
  const tokenData = JSON.parse(atob(token.split('.')[1]))
  const payload = await signUpValidation.validate(req.body)
  let user = await UserModel.query().where('email', payload.email).first()
  const saasCompany = await SaasCompanyModel.query().where('id', payload.company_id).first()
  const creatingUser = await UserModel.query().where('id', tokenData.id).first()

  if (creatingUser?.id !== saasCompany?.owner_id || creatingUser.is_trial_user) {
    throw new HttpError(403, 'You are not allowed to create users')
  }

  if (!saasCompany) {
    throw new HttpError(404, 'Company not found')
  }

  if (user) {
    throw new HttpError(400, 'User already exists')
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10)

  user = await UserModel.query().insert({
    id: ulid().toString(),
    email: payload.email.toString(),
    password: hashedPassword.toString(),
    username: payload.username.toString(),
    saas_company_id: saasCompany.id,
  })

  try {
    const tokens = await generateTokensPair(user.id, {
      username: user.username,
      saas_company_id: user.saas_company_id,
      companyOwner: false,
      is_super_user: user?.is_super_user,
    })

    const link = await setTempLinkToChangePassword({ email: user.email, id: user.id })

    console.log(`${process.env.USER_UI_LINK}/change-password?link=${link}`)

    // await SendGridService.sendRegistrationEmail({
    //   email: payload.email,
    //   password: payload.password,
    //   link: `${process.env.USER_UI_LINK}/change-password?link=${link}`
    // })

    return res.json(tokens)
  } catch (err) {
    throw new HttpError(500, err.message)
  }
}

async function signUpTrial(req: Request, res: Response) {
  const payload = await signUpTrialValidation.validate(req.body)
  let user = await UserModel.query().where('email', payload.email).first()


  if (!user) {
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    user = await UserModel.query().insert({
      id: ulid().toString(),
      email: payload.email.toString(),
      password: hashedPassword.toString(),
      username: payload.username.toString(),
      is_trial_user: true,
    })
    let saasCompany = await SaasCompanyModel.query().insert(
      {
        id: ulid().toString(),
        name: payload.company_name,
        domain: payload.company_domain,
        owner_id: user.id.toString(),
      },
    )

    await UserModel.query().patchAndFetchById(user.id, { saas_company_id: saasCompany.id })

    try {
      const tokens = await generateTokensPair(user.id, {
        username: user.username,
        saas_company_id: user.saas_company_id,
        companyOwner: false,
        is_super_user: user?.is_super_user,
        is_trial_user: user?.is_trial_user,
      })
      return res.json(tokens)
    } catch (err) {
      throw new HttpError(500, err.message)
    }
  }
  throw new HttpError(400, 'User already exists')
}

async function signOut(req: Request, res: Response) {
  const payload = await signOutValidation.validate(req.body)
  const redis = getRedisClient()
  if (payload.refreshToken) {
    const refreshToken = await redis.get(`user_keys:${payload.refreshToken}`)
    if (refreshToken) {
      await redis.del(`user_keys:${payload.refreshToken}`)
      return res.json({ message: 'OK' })
    }
    throw new HttpError(403, 'Invalid refresh token')
  }
  await redis.del(`user_keys:${payload.refreshToken}`)

}

async function regenerateAccessToken(req: Request, res: Response) {
  const payload = await refreshTokenValidation.validate(req.body)

  const redis = getRedisClient()
  const userId = await redis.hget(`user_keys:${payload.refreshToken}`, "userId")

  if (!userId) throw new HttpError(400, 'Invalid refresh token')

  const user = await UserModel.query().where('id', userId).first()
  const saasCompany = await SaasCompanyModel.query().where('id', user.saas_company_id).first()

  const token = await AuthService.generateAccessToken(payload.refreshToken, {
    username: user?.username,
    saas_company_id: user?.saas_company_id,
    companyOwner: user.id === saasCompany?.owner_id,
    is_super_user: user?.is_super_user,
    is_trial_user: user?.is_trial_user,
  })
  return res.json({ accessToken: token })
}

export const AuthController = {
  signOut,
  signIn,
  signUp,
  signUpTrial,
  regenerateAccessToken,
}
