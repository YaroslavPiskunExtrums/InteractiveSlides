import * as Sentry from '@sentry/node'

import { Job, Worker } from 'bullmq'

import { getJobsHandlers } from '@app/workers/handlers.js'
import { QueueName } from '@lib/constants/queues.js'
import { IJobDefinition } from '@lib/interfaces/queues.js'
import { getLogger } from '@lib/logger.js'

const _workers: Worker[] = []

export async function initWorkerSubscriptions(queue = QueueName.Default): Promise<void> {
  const handlers = getJobsHandlers()
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY, 10) || 5
  const worker = new Worker(
    queue,
    async (job: Job) => {
      if (job?.id.toString().startsWith('0:')) {
        return // marker job for delayed
      }

      if (handlers[job.name]) {
        const jobHandler: IJobDefinition<unknown> = handlers[job.name](job.data)
        jobHandler.setPayload(job.data)
        try {
          await jobHandler.handle()
        } catch (e) {
          getLogger().error('[JOB WORKER][HANDLER ERROR]', e)
          Sentry.captureException(e)
          throw e
        }
      } else {
        getLogger().error(`[JOB WORKER] Unknown JOB: ${job.name}`)
      }
    },
    {
      concurrency,
    }
  )
  _workers.push(worker)
}

export async function stopWorkers(): Promise<void> {
  await Promise.all(_workers.map((x) => x.close()))
}
