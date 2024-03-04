import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const ResourceSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: 'jd29372t35123g',
    },
    original_name: {
      type: 'string',
    },
    mime_type: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    created_at: {
      type: 'string',
      example: '2022-01-01',
    },
    updated_at: {
      type: 'string',
      example: '2022-01-01',
    },
  },
}
