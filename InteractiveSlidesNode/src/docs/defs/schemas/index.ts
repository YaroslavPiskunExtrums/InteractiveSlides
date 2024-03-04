import { SharedApiSchema } from '@app/docs/defs/schema-path.constant.js'
import {OpenAPIV3} from "express-openapi-validator/dist/framework/types.js";
import { ContentSnapshotSchema } from "@app/docs/defs/schemas/content.schema.js";
import { GenericError } from "@app/docs/defs/schemas/error.schema.js";
import { ContentTemplateSchema } from "@app/docs/defs/schemas/template.schema.js";
import { ResourceSchema } from "@app/docs/defs/schemas/resource.schema.js";
import { VisionProcessingSchema } from "@app/docs/defs/schemas/vision-processing.schema.js";
import { BatchSchema } from "@app/docs/defs/schemas/batch.schema.js";
import { ProductContentSchema } from "@app/docs/defs/schemas/product.schema.js";

export function getApiSchemas(): PartialRecord<keyof typeof SharedApiSchema, OpenAPIV3.SchemaObject> {
  return {
    ContentSnapshot: ContentSnapshotSchema,
    // NotFoundSchema: null,
    TemplateSchema: ContentTemplateSchema,
    ResourceSchema: ResourceSchema,
    VisionProcessingSchema: VisionProcessingSchema,
    BatchSchema: BatchSchema,
    GenericError,
    ProductContentSchema: ProductContentSchema
  }

}
