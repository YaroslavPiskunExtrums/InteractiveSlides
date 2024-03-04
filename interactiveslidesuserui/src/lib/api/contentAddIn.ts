import { authFetch } from 'src/lib/util/auth'

const updateAddInStatus = async (newActiveMenuConfig, activeFigureName, presentationSettingsUniqueId) => {
	const response = await authFetch('/api/ContentAddIn/UpdateAddInStatus', {
		method: 'POST',
		body: JSON.stringify({
			contentAddInStatus: newActiveMenuConfig,
			shapeName: activeFigureName,
			uniqueID: presentationSettingsUniqueId,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response
}

export { updateAddInStatus }