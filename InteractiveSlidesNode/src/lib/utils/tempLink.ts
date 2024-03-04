import { getRedisClient } from '../db/redis.client.js'
import { toBase64 } from './hash.js'

export const setTempLinkToChangePassword = async (user: { email: string, id: string }) => {
	const redis = getRedisClient()

	const userDataInBase64 = toBase64([user.email, user.id].join())

	await redis.set(`temp_link:${userDataInBase64}`, user.id)

	return userDataInBase64
}

export const getUserIdFromLink = async (link: string) => {
	const redis = getRedisClient()

	const dataFromRedis = await redis.get(`temp_link:${link}`)

	return dataFromRedis
}

export const removeLinkToChangePassword = async (link: string) => {
	const redis = getRedisClient()

	await redis.del(`temp_link:${link}`)
}
