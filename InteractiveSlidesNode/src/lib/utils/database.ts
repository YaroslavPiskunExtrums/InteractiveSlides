import { sqlDatabase } from '@lib/db/sql.client.js'

export function alias(tableName: string, as: string, db = sqlDatabase()) {
  return db.raw(`\`${tableName}\` as \`${as}\``)
}
