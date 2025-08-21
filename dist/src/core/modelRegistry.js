"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllModels = exports.getModel = exports.registerModel = void 0;
const modelMap = {};
function registerModel(name, model) {
    modelMap[name] = model;
}
exports.registerModel = registerModel;
function getModel(name) {
    return modelMap[name];
}
exports.getModel = getModel;
function getAllModels() {
    return modelMap;
}
exports.getAllModels = getAllModels;
