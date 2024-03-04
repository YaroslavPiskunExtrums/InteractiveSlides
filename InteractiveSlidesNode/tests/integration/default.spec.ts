import { jest } from '@jest/globals'

import dotenv from 'dotenv'
import { Application } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'

import { destroyDBConnection, sqlDatabase } from '../../dist/lib/db/sql.client.js'
import { createServer } from '../../dist/server.js'

jest.useFakeTimers()

describe('Home', () => {
  dotenv.config({ path: '.env' })
  process.env.SUSPEND_JWT_VERIFICATION = 'true'

  let app: Application
  let jwtToken = jwt.sign(
    {
      azp: 'defaultClient',
      iat: Math.round(Date.now() / 1000),
    },
    'default'
  )

  beforeAll(async () => {
    await sqlDatabase()
    app = await createServer()
  })

  afterAll(async () => {
    await destroyDBConnection()
  })

  describe('Root', () => {
    test('Should respond', async () => {
      await request(app).get('/').set('Authorization', `Bearer ${jwtToken}`).expect(200)
    })
  })
})
