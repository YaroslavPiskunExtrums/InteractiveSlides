import apiLink from 'src/helpers/api_links'
import { authFetch } from '../util/auth'

const getAllSalesInfo = async () => {
	const response = await authFetch('/api/companies/get-all-sales-info')
	return response
}
export { getAllSalesInfo }