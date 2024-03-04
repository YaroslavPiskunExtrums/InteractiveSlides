import { JobName, QueueName } from '@lib/constants/queues.js'
import { IJobDefinition } from '@lib/interfaces/queues.js'

export abstract class AbstractJob<T> implements IJobDefinition<T> {
  readonly name: JobName

  protected static preferredQueue: QueueName

  abstract handle(): void | Promise<void>

  abstract getName(): JobName

  static PreferredQueue(): QueueName {
    return this.preferredQueue || QueueName.Default
  }

  protected constructor(protected data: T) {}

  exportPayload(): Promise<T> | T {
    return this.data
  }

  setPayload(d: T) {
    this.data = d
  }
}
