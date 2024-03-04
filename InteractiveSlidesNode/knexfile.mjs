// Update with your config settings.
import dotenv from 'dotenv'
import * as connection_string from 'connection-string'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: process.env.APP_ENV_FILE_PATH || '.env' })
// require('dotenv').config( { path: '.env.staging' });
// require('dotenv').config( {});


function buildDatabaseConfig(
  connectionString,
  sslPath,
  options
) {
  if (!connectionString) {
    throw new Error('Connection string is not provided')
  }
  const connection = new connection_string.ConnectionString(connectionString);

  let ssl= null;

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
      // multipleStatements: Boolean(connection.params?.multipleStatements),
      ssl,
    },
  };



  return connectionOptions
}


const standardConfig = () => {
  if (!process.env.ENVIRONMENT || process.env.ENVIRONMENT === 'development') {
    return {
      client: 'mysql',
      connection: process.env.SQL_CONNECTION_STRING,
      migrations: {
        directory: './database/migrations',
        tableName: 'migrations',
        extension: 'cjs',
        loadExtensions: ['.cjs', '.js'],
      },
      seeds: {
        directory: './database/seeds',
        extension: 'js',
        loadExtensions: ['.cjs', '.js'],
      },
    }
  } else {
    return buildDatabaseConfig(process.env.SQL_CONNECTION_STRING, './', {
      seeds: {
        directory: './database/seeds',
        extension: 'js',
        loadExtensions: ['.cjs', '.js'],
      },
      migrations: {
        directory: './database/migrations',
        tableName: 'migrations',
        extension: 'cjs',
        loadExtensions: ['.cjs', '.js'],
      },
    })
  }



}

export default {
  development: {
    ...standardConfig(),
  },

  staging: {
    ...standardConfig(),
  },

  production: {
    ...standardConfig(),
  },
}
