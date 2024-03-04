import { BatchSchema } from "@app/docs/defs/schemas/batch.schema.js";

export enum SharedApiSchema {
  ContentSnapshot = '#/components/schemas/ContentSnapshot',
  TemplateSchema = '#/components/schemas/TemplateSchema',

  ResourceSchema = '#/components/schemas/ResourceSchema',

  NotFoundSchema = '#/components/schemas/NotFoundSchema',
  GenericError = '#/components/schemas/GenericError',
  VisionProcessingSchema = '#/components/schemas/VisionProcessingSchema',

  BatchSchema = '#/components/schemas/BatchSchema',

  ProductContentSchema = '#/components/schemas/ProductContentSchema',
}
