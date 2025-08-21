"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJsonModels = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const SnowflakeId_1 = require("../util/SnowflakeId");
const modelRegistry_1 = require("./modelRegistry");
SnowflakeId_1.SnowflakeId.init(1000000000);
function loadJsonModels(modelDir, sequelize, tablePrefix = 'tb_faster_auto_') {
    const models = {};
    const absDir = path_1.default.resolve(process.cwd(), modelDir);
    for (const file of fs_1.default.readdirSync(absDir)) {
        if (!file.endsWith('.json'))
            continue;
        const content = fs_1.default.readFileSync(path_1.default.join(absDir, file), 'utf-8');
        const schema = JSON.parse(content);
        const attrs = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
            if (key === 'createdAt' || key === 'updatedAt')
                continue;
            if (prop['x-references']) {
                prop['x-references'].model = (0, modelRegistry_1.getAllModels)()[prop['x-references'].model].tableName;
            }
            const defaultValue = prop['x-snowflake'] ? SnowflakeId_1.SnowflakeId.id : (prop.default || undefined);
            if (prop['x-snowflake']) {
                if (prop.type !== 'string') {
                    throw new Error(`model:[${schema.title}] field:[${key}] must be string`);
                }
            }
            attrs[key] = {
                type: mapJsonType(prop.type),
                allowNull: !schema.required?.includes(key),
                defaultValue,
                comment: prop.description || '',
                primaryKey: prop['x-primaryKey'] || false,
                autoIncrement: prop['x-snowflake'] ? false : (prop['x-autoIncrement'] || false),
                unique: prop['x-unique'] || false,
                references: prop['x-references'] || undefined,
            };
        }
        models[schema.title] = sequelize.define(schema.title, attrs, {
            tableName: `${tablePrefix}${schema.title.toLowerCase()}`,
            timestamps: true
        });
        (0, modelRegistry_1.registerModel)(schema.title, models[schema.title]);
    }
    return models;
}
exports.loadJsonModels = loadJsonModels;
function mapJsonType(type) {
    switch (type) {
        case 'string': return sequelize_1.DataTypes.STRING;
        case 'integer': return sequelize_1.DataTypes.INTEGER;
        case 'number': return sequelize_1.DataTypes.FLOAT;
        case 'boolean': return sequelize_1.DataTypes.BOOLEAN;
        case 'object': return sequelize_1.DataTypes.JSON;
        default: return sequelize_1.DataTypes.STRING;
    }
}
