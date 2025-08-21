# 🚀 faster-auto

> 一款基于 Node.js + Sequelize 的自动化 API 快速构建工具，支持从模型文件（JSON Schema / DBML / SQL DDL）中自动生成 RESTful 接口和 Swagger 文档。

## ✨ 特性

- ⚡ 仅需一行代码，快速启动 Web API  
- 📦 自动加载模型文件（支持 `.json` / `.dbml` / `.sql`）  
- 🔄 自动生成 CRUD 接口  
- 📚 自动生成 Swagger 文档（支持调试）  
- 🔧 支持模型扩展：字段校验、默认值、主键、自增、外键、唯一索引等  
- 🧩 Sequelize 模型自动导出，支持手动操作或关联  
- 🛠️ 支持模型热更新（开发模式）  
- 🌐 内置 Swagger UI + Redoc 文档浏览  

---

## 📦 安装

```bash
npm install faster-auto

npx faster-auto my-app
```

---

## 🚀 快速开始

项目目录结构如下：

```
my-app/
├── models/
│   ├── user.json
│   ├── post.dbml
│   └── comment.sql
└── index.js
```

### 启动服务：

```ts
// index.js
import { Faster, Models } from 'faster-auto';

const app = Faster({
  modelDir: './models',
  db: {
    dialect: 'sqlite',
    storage: ':memory:' // 也可支持 mysql, postgres 等
  }
});

app.listen(3000);
```

---

## 📁 模型格式支持

### 1. JSON Schema（推荐）

```json
{
  "title": "User",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "x-primaryKey": true,
      "x-autoIncrement": true,
      "x-snowflake": true
    },
    "calss":{
      "type": "string",
      "x-references": {
        "model": "Class",
        "key": "id"
      }
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "default": "now"
    }
  },
  "required": ["email"]
}
```

### 2. DBML

```dbml
Table tb_faster_auto_user {
  id int [pk, increment]
  email varchar [not null, unique]
  createdAt timestamp [not null]
  updatedAt timestamp [not null]
}
```

### 3. SQL DDL

```sql
CREATE TABLE tb_faster_auto_user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class varchar(255) COLLATE "pg_catalog"."default",
  email VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" timestamptz(6) NOT NULL,
  "updatedAt" timestamptz(6) NOT NULL,

  CONSTRAINT "tb_faster_auto_user_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tb_faster_auto_user_class_fkey" FOREIGN KEY ("class") REFERENCES "public"."tb_faster_auto_class" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
```

---

## 🛠️ 高级配置

```ts
Faster({
  modelDir: './models',
  db: {
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '123456',
    database: 'test'
  },
  swagger: true,              // 启用 swagger
  redoc: true,                // 启用 redoc
  logStartupInfo: true,       // 启动时打印 API 地址
  // onModelsLoaded(models) {    // 自定义模型 hook（如添加关联）
  //   models.User.hasMany(models.Post);
  //   models.Post.belongsTo(models.User);
  // }
});
```

---

## 📚 API 文档

- Swagger UI: [http://localhost:3000/swagger](http://localhost:3000/swagger)  
- Redoc 文档: [http://localhost:3000/redoc](http://localhost:3000/redoc)  

---

## 📤 自动生成的接口

假设有一个模型 `user`，将自动生成以下接口：

| 方法   | 路径        | 描述         |
| ------ | ----------- | ------------ |
| GET    | `/user`     | 获取列表     |
| GET    | `/user/:id` | 获取单条记录 |
| POST   | `/user`     | 创建记录     |
| PUT    | `/user/:id` | 更新记录     |
| DELETE | `/user/:id` | 删除记录     |

---

## 💡 TODO 计划

- [x] 支持自定义API
- [x] 模型字段中文文档描述提取  
- [ ] 支持 GraphQL 自动生成  
- [ ] 自动生成 Markdown 接口文档  
- [ ] 支持模型字段级权限控制  

---

## 🧠 谁适合使用？

- 希望快速构建内部/后台接口的开发者  
- 用 Sequelize 写了很多重复接口逻辑的人  
- 想快速做一个低代码 API 服务骨架  

---

## 🧑‍💻 作者

[@yao xiao](https://github.com/xiaoyaos)  
开源、自由、极简主义者  

---

## 🪪 License

MIT
