import { authFetch } from '../util/auth'

const getCompanyUsers = async (saas_company_id: string) => {
	const response = await authFetch(`/api/saas-users/get-company-users/${saas_company_id}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	})
	const res = await response.json()
	return res
}

const removeUser = async (userId: string) => {
	const res = await authFetch(`/api/saas-users/delete-user/${userId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		}
	})
	return res
}

export { getCompanyUsers, removeUser }