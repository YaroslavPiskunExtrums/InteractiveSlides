import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";

export const GenericError: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    }
  },
}
