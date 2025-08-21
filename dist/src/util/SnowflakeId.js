"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowflakeId = void 0;
//生成雪花id
const flake_idgen_1 = __importDefault(require("flake-idgen"));
const int_format = require('biguint-format');
class SnowflakeId {
    static flake_id;
    static init(id) {
        SnowflakeId.flake_id = new flake_idgen_1.default({ id: id });
    }
    static id() {
        return int_format(SnowflakeId.flake_id.next(), 'hex').padStart(16, '0');
    }
}
exports.SnowflakeId = SnowflakeId;
