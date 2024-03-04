import { JobName } from '@lib/constants/queues.js'

export interface IJobDefinition<T> {
  getName(): JobName

  exportPayload(): T | Promise<T>

  setPayload(data: T): void

  handle(): void | Promise<void>
}

export interface ICommandPayload {
  commandID: number
}
