import fs from 'fs'
import path from 'path'
import { Knex } from 'knex'
import { ConnectionString } from 'connection-string'

export function buildDatabaseConfig(
  connectionString: string,
  sslPath: string = null,
  options?: Partial<Knex.Config>
): Knex.Config {
  if (!connectionString) {
    throw new Error('Connection string is not provided')
  }
  const connection = new ConnectionString(connectionString);

  let ssl: {
    ca: string | Buffer;
  } = null;

  if (sslPath) {
    ssl = {
      ca: fs.readFileSync(path.resolve(sslPath, 'server-ca.pem')),
    };
  }

  if (!connection.path || !connection.path.length) {
    throw new Error('DB Connection host is not specified')
  }

  console.log("SSL", ssl)

  const connectionOptions = {
    client: 'mysql',
    ...options,
    connection: {
      user: connection.user,
      password: decodeURIComponent(connection.password),
      host: connection.hostname,
      port: connection.port,
      database: connection.path[0],
      multipleStatements: Boolean(connection.params?.multipleStatements),
      ssl,
    },
  };



  return connectionOptions
}
