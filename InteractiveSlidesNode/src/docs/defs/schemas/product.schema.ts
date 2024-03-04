import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const ProductContentSchema: OpenAPIV3.SchemaObject = {
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
    },
    error_message: {
      type: 'string',
    },
    approved_at: {
      type: 'string',
    },
    content: {
      type: 'object',
    },
    ai_content: {
      type: 'object',
    },
    human_content: {
      type: 'object',
    },

    attributes_total: {
      type: 'number',
    },
    attributes_required: {
      type: 'number',
    },
    created_at: {
      type: 'string',
    }
  },
}
