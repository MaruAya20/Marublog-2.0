# Marublog v2

基于 Spring Boot 3 + Vue 3 的博客系统重构版本。

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Spring Boot 3.3.5 / Spring Data JPA / Spring Security / MySQL 8.0 |
| 前端 | Vue 3 / Vite 5 / TypeScript / Pinia / Vue Router |
| 数据库 | MySQL 8.0（旧架构为 PostgreSQL 18，数据已完成迁移） |
| JDK | 17+ |
| Node.js | 20+ |

## 目录结构

```
Marublog-v2/
├── backend/              # Spring Boot 后端
│   ├── src/main/java/com/marublog/
│   │   ├── controller/   # REST API 控制器
│   │   ├── service/      # 业务逻辑层
│   │   ├── repository/   # JPA 数据访问层
│   │   ├── entity/       # 数据库实体
│   │   ├── dto/          # 数据传输对象
│   │   ├── security/     # JWT + Spring Security
│   │   ├── config/       # 配置类
│   │   └── exception/   # 全局异常处理
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── frontend/             # Vue 3 前端
│   ├── src/
│   │   ├── api/          # Axios API 封装
│   │   ├── views/        # 页面组件
│   │   ├── components/   # 通用组件
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── router/       # 路由配置
│   │   └── types/        # TypeScript 类型定义
│   ├── vite.config.ts
│   └── package.json
└── sql/                  # 数据库相关脚本
    └── migrate_insert.sql
```

## 环境要求

| 依赖 | 版本 | 说明 |
|---|---|---|
| JDK | 17+ | 本项目编译目标为 Java 17 |
| Maven | 3.9+ | 也可直接用 IDEA 内置 Maven |
| Node.js | 20+ | 推荐 LTS 版本 |
| MySQL | 8.0+ | 端口默认 3306 |

## 数据库准备

1. 启动 MySQL 服务
2. 创建数据库（如不存在）：
```sql
CREATE DATABASE IF NOT EXISTS marublog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. 配置账号密码（默认读取 `backend/src/main/resources/application.yml`）：
   - 用户名：`root`
   - 密码：`z123qweasd`
   - 如需修改请编辑 `application.yml` 的 `spring.datasource` 块

4. 导入已有数据（可选，数据迁移文件在 `sql/migrate_insert.sql`）：
```bash
mysql -u root -p marublog < sql/migrate_insert.sql
```

> Hibernate 配置为 `ddl-auto: update`，首次启动会自动建表。

## 启动后端

```bash
cd backend

# 开发模式（热编译）
mvn spring-boot:run

# 或先打包再运行
mvn clean package -DskipTests
java -jar target/marublog-backend-1.0.0.jar
```

后端默认启动在 http://localhost:8080

常用环境变量（可覆盖 application.yml 中的默认值）：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `JWT_SECRET` | dev-secret-change-me... | JWT 签名密钥，生产环境务必更换 |
| `SMTP_HOST` | （空） | SMTP 服务器地址，用于邮箱验证码 |
| `SMTP_PORT` | 465 | SMTP 端口 |
| `SMTP_USER` | （空） | SMTP 用户名 |
| `SMTP_PASS` | （空） | SMTP 密码 |
| `SMTP_FROM` | 同 SMTP_USER | 发件人邮箱 |
| `ADMIN_OP_CODE` | 123456 | 管理员操作码（敏感操作二次验证） |
| `ADMIN_EMAIL` | （空） | 限制只有该邮箱可获取管理员提权 |
| `UPLOAD_DIR` | ./uploads | 上传文件存储目录 |

## 启动前端

```bash
cd frontend

# 首次运行安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

前端默认启动在 http://localhost:5173，已配置 Vite 代理将 `/api` 和 `/uploads` 请求转发到后端 `http://localhost:8080`。

## 启动顺序

必须先启动数据库，再启动后端，最后启动前端：

```
MySQL ──→ 后端 (8080) ──→ 前端 (5173)
```

## 快速验证

后端启动后，访问以下接口确认服务正常：

```bash
# 健康检查
curl http://localhost:8080/api/site

# 文章列表
curl http://localhost:8080/api/posts

# 标签列表
curl http://localhost:8080/api/tags

# 访客注册（测试完整流程）
curl -X POST http://localhost:8080/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{"guestName":"test"}'
```

前端启动后直接浏览器访问 http://localhost:5173

## 旧架构迁移说明

旧架构使用 Next.js 16 + Prisma + PostgreSQL 18，新架构重写为 Spring Boot + JPA + MySQL 8.0。

### 数据类型映射

| PostgreSQL | MySQL | 说明 |
|---|---|---|
| `boolean` (`t`/`f`) | `TINYINT(1)` (`1`/`0`) | |
| `text[]` (`{a,b,c}`) | `JSON` (`["a","b","c"]`) | |
| `bytea` | `BLOB` | |
| timestamp | DATETIME(6) | |

### 数据库表

完整 17 张表已完成迁移：

user, post, comment, `like`, favorite, tag_def, upload, site_settings,
page_view, admin_session, admin_log, comment_ban, user_ban,
rate_limit, login_code, user_preference, user_liked_award

### 迁移脚本

`sql/migrate_insert.sql` 包含完整的 INSERT 语句，可随时重新导入。

## 项目状态

当前为 **Phase 1** 重构版本，数据模型 100% 迁移，后端核心 CRUD API 已实现，前端基础页面可用。

**已知缺失**（参见项目审计文档）：
- 后端：邮箱验证码校验、XP 奖励系统、管理员仪表盘、标签合并、上传文件服务端点
- 前端：管理后台整套、发现页、草稿列表、设置页、Topbar/无限滚动/Toast 等组件

## License

MIT