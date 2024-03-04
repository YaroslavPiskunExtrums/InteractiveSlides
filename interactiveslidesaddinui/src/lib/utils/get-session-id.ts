export const getSessionId = (window: Window & typeof globalThis) => {
	if (!window) return null
	const pathNameArray = window.location.pathname.split('/')
	if (!pathNameArray.length) return null
	const sessionId = pathNameArray[pathNameArray.length - 1]
	return sessionId
}