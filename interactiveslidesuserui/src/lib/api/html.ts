import getUserObjectFromSession from 'src/helpers/userObjectFromJwt'
import { authFetch } from '../util/auth'

const getCompaniesPresentations = async (saas_company_id: string) => {
	const response = await authFetch(`/api/HTML/get-companies-presentations/${saas_company_id}`)
	const data = await response.json()
	return data
}

const getCompaniesPresentationSession = async (saas_company_id: string) => {
	const response = await authFetch(`/api/HTML/get-companies-presentation-session/${saas_company_id}`)
	const data = await response.json()
	return data
}

const finishSession = async (finishingSessionId: string) => {
	const res = await authFetch(`/api/HTML/finish-session/${finishingSessionId}`)
	const data = await res.json()
	return data
}

const getPresentationSettings = async (presentationId: string) => {
	const res = await authFetch(`/api/HTML/get-presentation-settings/${presentationId}`)
	const data = await res.json()
	return data
}

const createPresentationSession = async (selectedPresentationId: string, companyName: string, salesName: string, linkName: string) => {
	const response = await authFetch(`/api/HTML/create-presentation-session`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', },
		body: JSON.stringify({
			id: selectedPresentationId,
			company_name: companyName,
			sales_name: salesName,
			name: linkName,
		}),
	})
	return response
}

const saveDefaultStyles = async (styleConfigForSave: any) => {
	const response = await authFetch(`/api/HTML/save-default-styles`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${JSON.parse(sessionStorage.getItem('authUser') as any).accessToken}`,
		},
		body: JSON.stringify({
			...styleConfigForSave,
			saas_company_id: getUserObjectFromSession().saas_company_id,
		}),
	})
	return response
}

const patchPresentationTitle = async (presentationId: string, newTitle: string) => {
	const res = await authFetch(`/api/HTML/patch-presentation-title`, {
		method: 'PATCH',
		body: JSON.stringify({
			presentation_id: presentationId,
			new_title: newTitle,
		}),
		headers: { 'Content-Type': 'application/json' },
	})
	return res
}

const patchPresentationTransition = async (presentationId: string, transition: string) => {
	const res = await authFetch(`/api/HTML/patch-presentation-transition`, {
		method: 'PATCH',
		body: JSON.stringify({
			presentation_id: presentationId,
			transition,
		}),
		headers: { 'Content-Type': 'application/json' },
	})

	return res
}

const deletePresentationSession = async (presentationId: string, userId: string) => {
	const response = await authFetch(`/api/HTML/delete-presentation-session/${presentationId}/${userId}`, {
		method: 'DELETE',
	})
	const data = await response.json()
	return data
}

const deletePresentation = async (presentationId: string) => {
	const response = await authFetch(`/api/HTML/delete-presentation/${presentationId}`, {
		method: 'DELETE',
	})
	const res = await response.json()
	return res
}


export {
	getCompaniesPresentations,
	getCompaniesPresentationSession,
	finishSession,
	getPresentationSettings,
	createPresentationSession,
	saveDefaultStyles,
	patchPresentationTitle,
	patchPresentationTransition,
	deletePresentationSession,
	deletePresentation
}