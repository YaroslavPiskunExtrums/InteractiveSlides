import { TagWithPresentationsType } from 'src/pages/Presentations/PresentationTags/presentation-tag.store'
import { authFetch } from '../util/auth'

const tags = '/api/tags/'

const getTags = async () => {
	const response = await authFetch(tags + 'get-tags', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	})

	if (response.status !== 200) {
		throw new Error(response.statusText)
	}

	return response.json() as Promise<{ status: 'ok', payload: TagWithPresentationsType[] }>
}


const createTag = async (tag_title: string) => {
	const response = await authFetch(tags + 'create-tags', {
		method: 'POST',
		body: JSON.stringify({ tag_title }),
		headers: { 'Content-Type': 'application/json' }
	})

	if (response.status !== 201) {
		throw new Error(response.statusText)
	}

	return response.json() as Promise<{ status: 'ok', payload: TagWithPresentationsType }>
}

const linkPresentationToTag = async (tag_id: number, presentation_id: string) => {
	const response = await authFetch(tags + 'link-presentation-to-tag', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tag_id, presentation_id }),
	})
	if (response.status !== 201) {
		throw new Error(response.statusText)
	}

	return response.json() as Promise<{ status: 'ok', payload: TagWithPresentationsType[] }>
}

const updateTagTitle = async (tag_id: number, tag_title: string) => {
	const response = await authFetch(tags + 'update-tag-title', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tag_id, tag_title }),
	})
	if (response.status !== 200) {
		throw new Error(response.statusText)
	}

	return response.json() as Promise<{ status: 'ok', payload: TagWithPresentationsType }>
}

const removeTag = async (tag_id: number) => {
	const response = await authFetch(`${tags}remove-tag/${tag_id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	})
	if (response.status !== 200) {
		throw new Error(response.statusText)
	}

	return response.json() as Promise<{ status: 'ok' }>
}
export { getTags, createTag, linkPresentationToTag, updateTagTitle, removeTag }