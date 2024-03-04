import KnexImport from 'knex'

import { getLogger } from './logger.js'
import { buildDatabaseConfig } from '@lib/db/buildDatabaseConfig.js'
import fs from 'fs'

const knex = KnexImport.default

function getKnexConfig() {
  const knexConfig = buildDatabaseConfig(process.env.SQL_CONNECTION_STRING, './', {
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations',
      extension: 'cjs',
      loadExtensions: ['.cjs', '.js'],
    },
  })
  fs.writeFileSync('./knexConfig.json', JSON.stringify(knexConfig, null, 2))

  console.log("KNEX CONFIG", knexConfig)


  return knexConfig
  //
  //
  // return {
  //   client: 'mysql',
  //   connection: process.env.SQL_CONNECTION_STRING,
  //   migrations: {
  //     directory: './database/migrations',
  //     tableName: 'migrations',
  //     extension: 'cjs',
  //     loadExtensions: ['.cjs', '.js'],
  //   },
  // }
}

export async function runMigrations() {
  const log = getLogger()
  const config = getKnexConfig()
  log.info('db_migrations_begin')
  const knexdb = knex(config)
  await knexdb.migrate.latest()
  log.info('db_migrations_complete')
  await knexdb.destroy()
}
