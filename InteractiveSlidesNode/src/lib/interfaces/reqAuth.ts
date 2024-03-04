import { JwtPayload } from 'jsonwebtoken'

export type ReqAuth = {
	auth: {
		id?: string,
		username?: string,
		saas_company_id?: string,
		companyOwner?: boolean,
		is_super_user?: number,
		is_trial_user?: number
	} & JwtPayload
}