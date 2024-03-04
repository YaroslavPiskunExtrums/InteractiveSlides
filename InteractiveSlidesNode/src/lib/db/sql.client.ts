import KnexImport, { Knex } from 'knex'
import { Model } from 'objection'
import { buildDatabaseConfig } from '@lib/db/buildDatabaseConfig.js'

const knex = KnexImport.default

let knexDb: Knex
export function sqlDatabase(): Knex {
  if (!knexDb) {

    if (!process.env.ENVIRONMENT || process.env.ENVIRONMENT === 'development') {
      knexDb = knex({
        client: 'mysql',
        connection: process.env.SQL_CONNECTION_STRING,

        pool: {
          min: parseInt(process.env.DB_MIN_CONNECTIONS, 10) || 2,
          max: parseInt(process.env.DB_MAX_CONNECTIONS, 10) || 10,
        },
      })
    } else {
      knexDb = knex(buildDatabaseConfig(process.env.SQL_CONNECTION_STRING, './', {
        pool: {
          min: parseInt(process.env.DB_MIN_CONNECTIONS, 10) || 2,
          max: parseInt(process.env.DB_MAX_CONNECTIONS, 10) || 10,
        },
      }))
    }


    Model.knex(knexDb)
  }

  return knexDb
}

export async function destroyDBConnection() {
  await new Promise<void>((resolve) => {
    sqlDatabase().destroy(() => {
      resolve()
    })
  })
}
