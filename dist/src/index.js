"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faster = exports.Models = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const sequelize_1 = require("sequelize");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_1 = require("./core/api");
const loader_1 = require("./core/loader");
const modelRegistry_1 = require("./core/modelRegistry");
const docGenerator_1 = require("./swagger/docGenerator");
exports.Models = (0, modelRegistry_1.getAllModels)();
function Faster(options) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const apiPrefix = options.apiPrefix || '/api';
    const sequelize = new sequelize_1.Sequelize({ ...options.db, logging: false });
    const models = (0, loader_1.loadJsonModels)(options.modelDir, sequelize);
    (0, api_1.createApiRoutes)(app, models, apiPrefix);
    sequelize.sync();
    if (options.swagger) {
        const rawSchemas = {};
        const absDir = path_1.default.resolve(process.cwd(), options.modelDir);
        for (const file of fs_1.default.readdirSync(absDir)) {
            if (file.endsWith('.json')) {
                const content = fs_1.default.readFileSync(path_1.default.join(absDir, file), 'utf-8');
                const schema = JSON.parse(content);
                rawSchemas[schema.title] = schema;
            }
        }
        const spec = (0, docGenerator_1.generateSwaggerSpecFromSchemas)(rawSchemas, apiPrefix);
        app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
        if (options.redoc) {
            app.get('/redoc', (0, redoc_express_1.default)({
                title: 'Fastly API Docs',
                specUrl: '/swagger.json'
            }));
            // 提供 swagger.json
            app.get('/swagger.json', (req, res) => res.json(spec));
        }
    }
    const originalListen = app.listen.bind(app);
    app.listen = (...args) => {
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
exports.Faster = Faster;
