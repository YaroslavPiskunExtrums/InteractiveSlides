import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const ContentSnapshotSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: 'jd29372t35123g',
    },
    name: {
      type: 'string',
    },
    template_id: {
      type: 'string',
      example: 'f923gf0dm6hs',
    },
    inputs: {
      type: 'object',
    },
    content: {
      type: 'object',
    },
    tags: {
      type: 'string',
      example: 'tag1,tag2',
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
