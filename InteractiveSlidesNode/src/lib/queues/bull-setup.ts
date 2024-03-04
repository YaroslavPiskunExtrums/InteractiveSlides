import { FlowProducer, Queue } from 'bullmq'

import { QueueName } from '@lib/constants/queues.js'

const __queues: Partial<Record<QueueName, Queue>> = {}
let __flowProducer: FlowProducer = null

// export function getQueue(queue: QueueName) {
//   if (!__queues[queue]) {
//     __queues[queue] = new Queue(queue, { connection: getRedisClient() })
//   }
//
//   return __queues[queue]
// }

// export function getFlowProducer(): FlowProducer {
//   if (!__flowProducer) {
//     __flowProducer = new FlowProducer({ connection: getRedisClient() })
//   }
//
//   return __flowProducer
// }
