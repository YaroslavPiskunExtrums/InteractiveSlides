import apiLink from 'src/helpers/api_links'

interface ITokens {
	accessToken: string, refreshToken: string
}

export const authFetch = async (input: string, init: RequestInit = { headers: {} }) => {
	const tokens = sessionStorage.getItem('authUser')

	if (!tokens) {
		throw new Error('No tokens')
	}

	const { accessToken, refreshToken, ...rest }: ITokens = JSON.parse(tokens)

	let res = await fetch(apiLink + input, {
		...init,
		headers: {
			...init.headers,
			'Authorization': accessToken
		}
	})

	if (res.status !== 401) {
		return res
	}

	const regenerateTokenRes = await fetch(`${apiLink}/api/auth/regenerate-token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken })
	})

	if (!regenerateTokenRes.ok) {
		throw new Error('Token update error')
	}

	const { accessToken: newAccessToken } = await regenerateTokenRes.json() as { accessToken: string }

	sessionStorage.setItem('authUser', JSON.stringify({
		...JSON.parse(tokens),
		accessToken: newAccessToken
	}))

	res = await fetch(apiLink + input, {
		...init,
		headers: {
			...init.headers,
			'Authorization': newAccessToken
		}
	})

	if (res.status !== 401) {
		return res
	}

	window.location.href = window.origin + '/login'
	sessionStorage.removeItem('authUser')
}

