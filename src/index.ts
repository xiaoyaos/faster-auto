import express from 'express';
import fs from 'fs';
import path from 'path';
import redoc from 'redoc-express';
import { Sequelize } from 'sequelize';
import swaggerUi from 'swagger-ui-express';
import { createApiRoutes } from './core/api';
import { loadJsonModels } from './core/loader';
import { getAllModels } from './core/modelRegistry';
import { generateSwaggerSpecFromSchemas } from './swagger/docGenerator';

export const Models = getAllModels();
export interface FastlyOptions {
  modelDir: string;
  db: {
    dialect: 'mysql' | 'postgres' | 'sqlite';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  tablePrefix?: string;
  apiPrefix?: string;
  swagger?: boolean;
  redoc?: boolean;
  logStartupInfo: boolean;
}

export function Faster(options: FastlyOptions) {
  const app = express();
  app.use(express.json());

  const apiPrefix = options.apiPrefix || '/api';
  const sequelize = new Sequelize({ ...options.db, logging: false });
  const models = loadJsonModels(options.modelDir, sequelize, options.tablePrefix);
  createApiRoutes(app, models, apiPrefix);
  sequelize.sync();

  if (options.swagger) {
    const rawSchemas: Record<string, any> = {};
    const absDir = path.resolve(process.cwd(), options.modelDir);
    for (const file of fs.readdirSync(absDir)) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(absDir, file), 'utf-8');
        const schema = JSON.parse(content);
        rawSchemas[schema.title] = schema;
      }
    }

    const spec = generateSwaggerSpecFromSchemas(rawSchemas, apiPrefix);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(spec));

    if (options.redoc) {
      app.get('/redoc', redoc({
        title: 'Fastly API Docs',
        specUrl: '/swagger.json'
      }));
      // 提供 swagger.json
      app.get('/swagger.json', (req, res) => res.json(spec));
    }

  }

  const originalListen = app.listen.bind(app);
  app.listen = (...args: any[]): any => {
    const server = originalListen(...args);

    server.on('listening', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : args[0];
      if (options.logStartupInfo === true) {
        console.log(`🚀 Fastly API running at http://localhost:${port}`);
        if (options.swagger) {
          console.log(`📚 Swagger UI: http://localhost:${port}/swagger`);
        }
        if (options.redoc) {
          console.log(`📚 Docs UI: http://localhost:${port}/redoc`);
        }
      }
    });

    server.on('error', (err) => {
      console.error('❌ Server failed to start:', err);
    });

    return server;
  };

  return app;
}
