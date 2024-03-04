import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.js"

export enum OpenApiTags {
  Content = "Content Library",
  ContentV2 = "Content Library V2",
  Templates = "Templates",
  Creator = "Content Creator",
  Resources = "Resource Library",
  Vision = "Vision AI",

  Categories = "Categories",
  Attributes = "Attributes",
  Batch = "Batch Processing",
  Hooks = "Hooks",
  Users = "Users",
}

export const DocsPublicTags: string[] = [
  OpenApiTags.Content,
]

export const TagsDefinitions: Record<OpenApiTags, OpenAPIV3.TagObject> = {
  [OpenApiTags.Content]: {
    name: 'Content',
  },
  [OpenApiTags.Templates]: {
    name: 'Templates',
  },
  [OpenApiTags.Creator]: {
    name: 'Creator',
  },
  [OpenApiTags.Resources]: {
    name: 'Resources',
  },
  [OpenApiTags.Vision]: {
    name: 'Vision',
  },
  [OpenApiTags.Batch]: {
    name: 'Batch',
  },
  [OpenApiTags.Hooks]: {
    name: 'Hooks',
  },
  [OpenApiTags.Users]: {
    name: 'Users',
  },
  [OpenApiTags.Categories]: {
    name: 'Categories',
  },
  [OpenApiTags.Attributes]: {
    name: 'Attributes',
  },
  [OpenApiTags.ContentV2]: {
    name: 'Content V2',
  },
}
