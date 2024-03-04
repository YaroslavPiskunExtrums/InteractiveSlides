import dotenv from 'dotenv'
import { Application } from 'express'

import { createServer } from '@app/server.js'
import { ApplicationType } from '@lib/constants/application.js'
import { sqlDatabase } from '@lib/db/sql.client.js'
import { getLogger, prettyLog } from '@lib/logger.js'
import { runMigrations } from '@lib/migration.js'
import fs from 'fs'
import * as http from 'http'
import * as https from 'https'

async function boot() {
  dotenv.config({ path: process.env.APP_ENV_FILE_PATH || '.env' })

  if (process.env.RUN_MIGRATIONS === 'true') {
    await runMigrations()
  }

  await sqlDatabase()

  const appType: ApplicationType = (process.env.APP_TYPE || ApplicationType.API) as ApplicationType
  let _server: Application
  let serverName

  switch (appType) {
    case ApplicationType.API:
    default:
      _server = await createServer()
      serverName = 'api'
  }

  const port = parseInt(process.env.PORT, 10) || 5000
  const privateKey = fs.readFileSync('./RootCA.key', 'utf8')
  const certificate = fs.readFileSync('./RootCA.crt', 'utf8')

  const credentials = {key: privateKey, cert: certificate};

  const httpServer = http.createServer(_server);
  const httpsServer = https.createServer(credentials, _server);

  httpServer.listen(port, () => {
    getLogger().info(`Content Creator APP is running on port ${port}`)
  })
  httpsServer.listen(port + 1, () => {
    getLogger().info(`Content Creator HTTPS APP is running on port ${port +1}`)
  })
}

boot().catch((err) => {
  console.error('[GLOBAL ERROR]', err)
})
