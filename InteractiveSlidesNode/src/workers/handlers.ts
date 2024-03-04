import { PingJob } from '@app/workers/jobs/ping-job.js'
import { JobName } from '@lib/constants/queues.js'
import { IJobDefinition } from '@lib/interfaces/queues.js'

export interface JobGeneratorCb<T> {
  (d?: T): IJobDefinition<T>
}

export function getJobsHandlers(): Record<JobName, JobGeneratorCb<unknown>> {
  return {
    [JobName.Ping]: () => new PingJob(null),
  }
}
