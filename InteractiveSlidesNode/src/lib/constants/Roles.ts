enum RoleEnum {
	ADMIN = 'super_user',
	COMPANY_OWNER = 'company_owner',
	TRIAL_USER = 'trial_user',
	COMMON_USER = 'common_user'
}

type RoleKeys = keyof typeof ROLE
type RoleValues = (typeof ROLE)[RoleKeys]

const ROLE = {
	ADMIN: RoleEnum.ADMIN,
	COMPANY_OWNER: RoleEnum.COMPANY_OWNER,
	TRIAL_USER: RoleEnum.TRIAL_USER,
	COMMON_USER: RoleEnum.COMMON_USER,

}

export { RoleEnum, RoleValues }