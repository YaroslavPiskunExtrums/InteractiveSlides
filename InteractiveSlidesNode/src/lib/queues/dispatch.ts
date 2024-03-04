import { JobsOptions } from 'bullmq'
import { FlowJob } from 'bullmq/dist/esm/interfaces/flow-job.js'

import { QueueName } from '@lib/constants/queues.js'
import { IJobDefinition } from '@lib/interfaces/queues.js'

export class Dispatcher<T, Q extends string> {
  private queue: Q
  private options: JobsOptions = {
    removeOnComplete: true,
    attempts: 3,
  }

  constructor(private job: IJobDefinition<T>) {}

  onQueue(q: Q): Dispatcher<T, Q> {
    this.queue = q
    return this
  }

  withOptions(options: JobsOptions): Dispatcher<T, Q> {
    this.options = {
      ...this.options,
      ...options,
    }
    return this
  }

  timeout(milliseconds: number) {
    this.options = {
      ...this.options,
      ...{
        timeout: milliseconds,
      },
    }
    return this
  }

  flow(): FlowJob {
    return {
      name: this.job.getName(),
      data: this.job.exportPayload(),
      queueName: this.queue,
      opts: this.options,
    }
  }
}

export function dispatch<T>(job: IJobDefinition<T>): Dispatcher<T, QueueName> {
  return new Dispatcher(job)
}
