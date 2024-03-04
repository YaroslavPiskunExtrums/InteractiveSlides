import { JobName } from '@lib/constants/queues.js'
import { getLogger } from '@lib/logger.js'
import { AbstractJob } from '@lib/queues/abstract.job.js'
import { delay } from '@lib/utils/promises.js'

export class PingJob extends AbstractJob<any> {
  private readonly __name: JobName

  getName(): JobName {
    return this.__name
  }

  constructor(data: any) {
    super(new Date().toISOString())
    this.__name = JobName.Ping
    this.data = data
  }

  async handle(): Promise<void> {
    if (typeof this.data === 'object' && typeof this.data['delay'] === 'number') {
      await delay(this.data['delay'])
    }

    getLogger().info('>> Ping', { data: this.data })
  }
}
