import { OpenAPIV3 } from 'openapi-types';

export function generateSwaggerSpecFromSchemas(
  schemas: Record<string, any>,
  apiPrefix: string = '/api'
): OpenAPIV3.Document {
  const paths: OpenAPIV3.PathsObject = {};
  const componentsSchemas: OpenAPIV3.ComponentsObject['schemas'] = {};

  for (const [name, schema] of Object.entries<any>(schemas)) {
    const route = `${apiPrefix}/${name.toLowerCase()}`;
    const idParam: OpenAPIV3.ParameterObject = {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' }
    };

    paths[route] = {
      get: {
        summary: `Get all ${name}`,
        tags: [name],
        responses: {
          200: {
            description: `List of ${name}`,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${name}` }
                }
              }
            }
          }
        }
      },
      post: {
        summary: `Create ${name}`,
        tags: [name],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${name}` }
            }
          }
        },
        responses: { 200: { description: 'Created' } }
      }
    };

    paths[`${route}/{id}`] = {
      get: {
        summary: `Get single ${name}`,
        tags: [name],
        parameters: [idParam],
        responses: {
          200: {
            description: `${name} found`,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${name}` }
              }
            }
          },
          404: { description: 'Not found' }
        }
      },
      put: {
        summary: `Update ${name}`,
        tags: [name],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${name}` }
            }
          }
        },
        responses: { 200: { description: 'Updated' } }
      },
      delete: {
        summary: `Delete ${name}`,
        tags: [name],
        parameters: [idParam],
        responses: { 204: { description: 'Deleted' } }
      }
    };

    const props = Object.entries(schema.properties).reduce((acc, [key, val]) => {
      acc[key] = { type: (val as { type?: string }).type || 'string' };
      return acc;
    }, {} as Record<string, any>);

    componentsSchemas[name] = {
      type: 'object',
      properties: props,
      required: schema.required || []
    };
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'fastly-auto API',
      version: '1.0.0'
    },
    paths,
    components: { schemas: componentsSchemas }
  };
}
