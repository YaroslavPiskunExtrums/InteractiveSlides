import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const VisionProcessingSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: 'jd29372t35123g',
    },
    hash_sum: {
      type: 'string',
      example: '4f64b8bdcce414a44ccef28dfc81c1b9',
    },
    image_url: {
      type: 'string',
      example: 'https://example.com/image.jpg',
    },
    external_id: {
      type: 'string',
      example: 'abcd1234',
    },
    signature: {
      type: 'string',
      example: '4f64b8bdcce414a44ccef28dfc81c1b9',
    },
    processed_at: {
      type: 'string',
      example: '2022-01-01',
    },
    created_at: {
      type: 'string',
      example: '2022-01-01',
    },
    updated_at: {
      type: 'string',
      example: '2022-01-01',
    },
    vision: {
      type: 'object',
      nullable: true,
      properties: {
        text: {
          type: 'array',
          items: {
            type: 'string',
          }
        },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              desc: {
                type: 'string',
              },
              score: {
                type: 'number',
              }
            }
          }
        }
      }
    }
  },
}
