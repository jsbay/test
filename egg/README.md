# egg-ts-basic

> egg ts 基础版

## 目标继承

> 一键安装依赖
>
> yarn add egg-session-redis egg-redis egg-passport egg-passport-local mssql

- session-redis
- passport
- mssql

## 配置

### 1. 开启插件

```ts
// ${root}/config/plugin.ts
import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  // static: true,
  redis: {
    enable: true,
    package: "egg-redis",
  },
  sessionRedis: {
    enable: true,
    package: "egg-session-redis",
  },
  passport: {
    enable: true,
    package: "egg-passport",
  },
  passportLocal: {
    enable: true,
    package: "egg-passport-local",
  },
};

export default plugin;
```

### 2. 配置 redis/mssql ip/账号/密码

```ts
// ${root}/config/config.redis.ts
export default {
  host: process.env.EGG_REDIS_HOST || "127.0.0.1",
  port: process.env.EGG_REDIS_PORT || 6379,
  password: process.env.EGG_REDIS_PASSWORD || "",
  db: process.env.EGG_REDIS_DB || "0",
};
// ${root}/config/config.mssql.ts
export default {
  server: "192.168.49.10",
  port: 1433,
  user: "ATMP01",
  password: "10AD7A7a",
  database: "ATMP",
};
```
