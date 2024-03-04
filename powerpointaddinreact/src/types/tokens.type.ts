export type TokensType = {
  accessToken: string
  refreshToken: string
  integrations?: {
    hubspot?: {
      access_token?: string
      refresh_token?: string
    }
  }
}

export type AccessTokenDataType = {
  companyOwner: boolean
  exp: number
  iat: number
  id: string
  is_super_user: number
  is_trial_user: number
  saas_company_id: string
  username: string
}
