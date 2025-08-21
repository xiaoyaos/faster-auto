import { ModelStatic } from 'sequelize';
export declare function registerModel(name: string, model: ModelStatic<any>): void;
export declare function getModel(name: string): ModelStatic<any>;
export declare function getAllModels(): Record<string, ModelStatic<any>>;
//# sourceMappingURL=modelRegistry.d.ts.map