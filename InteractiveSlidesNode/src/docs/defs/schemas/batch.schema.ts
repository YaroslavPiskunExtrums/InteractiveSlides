import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const BatchSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: [
        'new',
        'active',
        'completed',
        'failed',
      ]
    },
    notes: {
      type: 'object',
    },
    created_at: {
      type: 'string',
    },
    updated_at: {
      type: 'string',
    }
  },
}
