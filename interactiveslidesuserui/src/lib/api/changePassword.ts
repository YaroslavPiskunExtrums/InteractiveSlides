import apiLink from 'src/helpers/api_links'

export const checkLink = async (link: string) => {
	const res = await fetch(apiLink + `/api/user/check-link?link=${link}`, {
		method: "GET",
		headers: { 'Content-Type': 'application/json' }
	})
	if (!res.ok) {
		throw new Error('Wrong link')
	}
	return res.json()
}

export const changePassword = async (data: {
	link: string,
	password: string,
	confirmPassword: string
}) => {
	const res = await fetch(apiLink + '/api/user/change-password', {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
	if (!res.ok) {
		throw new Error(res.statusText)
	}
	return res.json()
}