export const OpenAPIDefaultPaginationParameters = [
  {
    name: 'limit',
    in: 'query',
    description: 'Limit',
    required: false,
    schema: {
      type: 'integer',
      default: 10,
    }
  },
  {
    name: 'offset',
    in: 'query',
    description: 'Offset',
    required: false,
    schema: {
      type: 'integer',
      default: 0,
    }
  }
]
