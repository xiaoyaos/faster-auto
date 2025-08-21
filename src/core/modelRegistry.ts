import { ModelStatic } from 'sequelize';

const modelMap: Record<string, ModelStatic<any>> = {};

export function registerModel(name: string, model: ModelStatic<any>) {
  modelMap[name] = model;
}

export function getModel(name: string) {
  return modelMap[name];
}

export function getAllModels() {
  return modelMap;
}
