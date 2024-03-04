import { getRedisClient } from '@lib/db/redis.client.js'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import * as console from 'console'


async function generateRefreshToken(userId: string) {
  const redis = getRedisClient()
  const key = uuid()
  await redis.hset(`user_keys:${key}`, 'userId', userId)
  await redis.expire(`user_keys:${key}`, 3600 * 24 * 12)
  return key
}

async function generateAccessToken(refreshToken: string, user: any) {
  const redis = getRedisClient()

  const userKey = await redis.hget(`user_keys:${refreshToken}`, 'userId')


  if (!userKey) {
    throw new Error('Invalid refresh token')
  }

  return `Bearer ${jwt.sign({ id: userKey, ...user }, process.env.JWT_SECRET, { expiresIn: '1h' })}`
}

async function resolveOneTimeHash(userId: string) {
  const redis = getRedisClient()
  const key = uuid()

  const userHash = await redis.hget(`hash_keys:${userId}`, 'hash_key')


  if (userHash) {
    await redis.del(`user_keys:${userHash}`)
  }

  await redis.hset(`hash_keys:${userId}`, 'hash_key', key)
  await redis.expire(`hash_keys:${userId}`, 60 * 15)

  return key
}

async function loginHashUser(hash: string) {
  const redis = getRedisClient()
  const findHash = await redis.keys(`hash_keys:*`)
  const userHash = await Promise.all(findHash.map(async (key) => {
    const userHash = await redis.hget(key, 'hash_key')
    if (userHash === hash.trim()) {
      return key.split(':')[1]
    }
  }))

  const [userId] = userHash.filter((id) => id)

  return userId
}

export const AuthService = {
  generateRefreshToken,
  generateAccessToken,
  resolveOneTimeHash,
  loginHashUser,
}
