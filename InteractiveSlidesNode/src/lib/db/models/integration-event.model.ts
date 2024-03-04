import { Model } from 'objection'

export interface IIntegrationEvent {
  id?: string
  url?: string
  integration_id?: number
  presentation_id?: string
  created_at?: Date
  updated_at?: Date
}
export class IntegrationEventsModel extends Model implements IIntegrationEvent {
  static get tableName() {
    return 'integrations_events'
  }
  id?: string
  url?: string
  integration_id?: number
  presentation_id?: string
  created_at?: Date
  updated_at?: Date
}
