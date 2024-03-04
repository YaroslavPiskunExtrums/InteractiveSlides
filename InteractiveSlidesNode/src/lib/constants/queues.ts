export enum QueueName {
  Default = 'default',
}

export enum JobName {
  Ping = 'ping',
}

export const BullDelay = {
  Second: 1000,
  Minute: 1000 * 60,
  Hour: 1000 * 3600,
}
