import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    if (schema.body === undefined) {
      schema.body = {
        type: 'object',
        required: [],
        properties: {},
      };
    };

    (schema.body as any).properties.file = {
      type: 'string',
      format: 'binary',
    };

		(schema.body as any).required.push('file');
  }
	
	return { schema, url };
}
