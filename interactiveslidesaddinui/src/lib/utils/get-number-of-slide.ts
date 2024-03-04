export const getNumberOfSlide = (window: Window & typeof globalThis) => {
	if (!window) return null
	const hash = window.location.hash
	if (!hash) return null

	const slide = +hash.split('/')[1]?.at(0)
	return isNaN(slide) ? null : slide
}