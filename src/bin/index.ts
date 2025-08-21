#!/usr/bin/env node
import chalk from 'chalk';
import degit from 'degit';
import fs from 'fs';
import path from 'path';

async function init() {
  console.log(chalk.blue('🚀 faster-auto 初始化'))

  const projectName = process.argv.slice(2)[0]
  const template = 'github:xiaoyaos/faster-auto/template'

  const targetDir = path.resolve(process.cwd(), projectName);

  // 2. 检查目录是否已存在
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`❌ 目录 ${projectName} 已存在！`));
    process.exit(1);
  }

  try {
    // 3. 使用 degit 拉取指定目录
    const emitter = degit(template, {
      cache: false,
      force: true,
      verbose: true
    });

    await emitter.clone(targetDir);

    console.log(chalk.green(`✅ 项目 ${projectName} 创建成功！`));
    console.log(chalk.cyan(`
      进入项目:
        cd ${projectName}
      安装依赖:
        npm install
      启动开发:
        npm run dev
    `));
  } catch (error: any) {
    console.error(chalk.red('❌ 创建失败:', error.message));
    process.exit(1);
  }
}

init();