import chalk from 'chalk'
import winston from 'winston'

let __logger: winston.Logger = null

export function getLogger(): winston.Logger {
  if (!__logger) {
    const meta: any = {
      service: 'islide',
      kind: process.env.APP_TYPE,
    }

    if (process.env.QUEUE_NAME) {
      meta.queue = process.env.QUEUE_NAME
    }

    __logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: meta,
      transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'information.log', level: 'info', dirname: "logs" }), new winston.transports.File({ filename: 'errors.log', level: 'error', dirname: "logs" })], //WINSTON FILE
    })
  }
  return __logger
}

export function prettyLog(prefix: string, ...args: any[]) {
  console.log.apply(console.log, [chalk.green(prefix), ...args])
}

prettyLog.warn = function(prefix: string, ...args: any[]) {
  console.log.apply(console.log, [chalk.yellow(prefix), ...args])
}

prettyLog.error = function(prefix: string, ...args: any[]) {
  console.log.apply(console.log, [chalk.red(prefix), ...args])
}
