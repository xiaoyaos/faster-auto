import fs from 'fs';
import path from 'path';
import { DataTypes, ModelStatic, Sequelize } from 'sequelize';
import { SnowflakeId } from '../util/SnowflakeId';
import { getAllModels, registerModel } from './modelRegistry';
SnowflakeId.init(1000000000)
export function loadJsonModels(modelDir: string, sequelize: Sequelize, tablePrefix: string = 'tb_faster_auto_'): Record<string, ModelStatic<any>> {
  const models: Record<string, ModelStatic<any>> = {};
  const absDir = path.resolve(process.cwd(), modelDir);

  for (const file of fs.readdirSync(absDir)) {
    if (!file.endsWith('.json')) continue;
    const content = fs.readFileSync(path.join(absDir, file), 'utf-8');
    const schema = JSON.parse(content);
    const attrs: Record<string, any> = {};

    for (const [key, prop] of Object.entries<any>(schema.properties)) {
      if (key === 'createdAt' || key === 'updatedAt') continue
      if (prop['x-references']) {
        prop['x-references'].model = getAllModels()[prop['x-references'].model].tableName
      }
      const defaultValue = prop['x-snowflake'] ? SnowflakeId.id : (prop.default || undefined)
      if (prop['x-snowflake']) {
        if (prop.type !== 'string') {
          throw new Error(`model:[${schema.title}] field:[${key}] must be string`)
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
    registerModel(schema.title, models[schema.title]);
  }

  return models;
}

function mapJsonType(type: string) {
  switch (type) {
    case 'string': return DataTypes.STRING;
    case 'integer': return DataTypes.INTEGER;
    case 'number': return DataTypes.FLOAT;
    case 'boolean': return DataTypes.BOOLEAN;
    case 'object': return DataTypes.JSON;
    default: return DataTypes.STRING;
  }
}
