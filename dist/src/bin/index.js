#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const degit_1 = __importDefault(require("degit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function init() {
    console.log(chalk_1.default.blue('🚀 faster-auto 初始化'));
    const projectName = process.argv.slice(2)[0];
    const template = 'github:xiaoyaos/faster-auto/template';
    const targetDir = path_1.default.resolve(process.cwd(), projectName);
    // 2. 检查目录是否已存在
    if (fs_1.default.existsSync(targetDir)) {
        console.log(chalk_1.default.red(`❌ 目录 ${projectName} 已存在！`));
        process.exit(1);
    }
    try {
        // 3. 使用 degit 拉取指定目录
        const emitter = (0, degit_1.default)(template, {
            cache: false,
            force: true,
            verbose: true
        });
        await emitter.clone(targetDir);
        console.log(chalk_1.default.green(`✅ 项目 ${projectName} 创建成功！`));
        console.log(chalk_1.default.cyan(`
      进入项目:
        cd ${projectName}
      安装依赖:
        npm install
      启动开发:
        npm run dev
    `));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ 创建失败:', error.message));
        process.exit(1);
    }
}
init();
