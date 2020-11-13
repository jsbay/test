## session-redis 测试

\> 本文由 \[简悦 SimpRead\](http://ksria.com/simpread/) 转码， 原文地址 \[www.jianshu.com\](https://www.jianshu.com/p/6c28413c5ccf)

> 关于 Egg.js 介绍 可以参考 [egg - 为企业级框架和应用而生](https://eggjs.org/zh-cn/)

## 概览

- 开始 -> 登录 -> 鉴权 -> Redis -> 记住
- 哈希 -> 数据库 -> ORM -> 迁移 -> 关联
- 小结 -> 特点 -> 已解决 -> 待验证 -> 发布

## 开始

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

nvm install --lts

npm i -g cnpm --registry=https://registry.npm.taobao.org


```

> 更多参考 [nvm 官网](https://github.com/creationix/nvm)

```
cnpm i -g egg-init


```

```
egg-init --type=simple saas-admin-server

cd saas-admin-server && cnpm i

cnpm run dev # localhost:7001


```

- 测试

```
curl localhost:7001 # hi, egg


```

> 更多参考 [eggjs 快速入门](http://eggjs.org/zh-cn/intro/quickstart.html)

## 登录

```
vim app/router.js


```

```
'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);
};


```

```
vim app/controller/auth.js


```

```
'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    ctx.session.user = 6;
    ctx.body = { message: '登录成功' };
    ctx.status = 200;
  }
}

module.exports = AuthController;


```

```
vim config/config.default.js


```

```
// 省略了未修改的代码
  config.session = {
    key: 'EGG\_SESS',
    maxAge: 24 \* 3600 \* 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };
// 省略了未修改的代码


```

- 测试

```
curl -c cookies -X POST localhost:7001/login # {"message":"登录成功"}


```

## 鉴权

```
vim app/router.js


```

```
'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);
  router.get('/user', controller.user.index);
};


```

```
vim app/controller/user.js


```

```
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    this.ctx.body = 'hi, user';
  }
}

module.exports = UserController;


```

- 测试

```
curl localhost:7001/user # hi, user


```

```
mkdir app/middleware

vim app/middleware/auth.js


```

```
'use strict';

module.exports = () => {
  return async function(ctx, next) {
    if (!ctx.session.user) {
      ctx.status = 403;
      ctx.body = 'forbidden!';
      return;
    }
    await next();
  };
};


```

```
vim app/router.js


```

```
'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth();

  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);
  router.get('/user', auth, controller.user.index);
};


```

- 测试

```
curl localhost:7001/user # forbidden!

curl -b cookies localhost:7001/user # hi, user


```

## Redis

```
docker run --name redis-egg -p 6379:6379 -d redis


```

```
cnpm i --save egg-session-redis egg-redis


```

```
vim config/config.default.js


```

```
// 省略了未修改的代码
  config.redis = {
    client: {
      host: process.env.EGG\_REDIS\_HOST || '127.0.0.1',
      port: process.env.EGG\_REDIS\_PORT || 6379,
      password: process.env.EGG\_REDIS\_PASSWORD || '',
      db: process.env.EGG\_REDIS\_DB || '0',
    },
  };
// 省略了未修改的代码


```

```
vim config/plugin.js


```

```
'use strict';

// had enabled by egg
// exports.static = true;

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};


```

> 更多参考 [egg-session-redis](https://github.com/eggjs/egg-session-redis)

- 测试

```
curl -b cookies localhost:7001/user # forbidden!

curl -c cookies -X POST localhost:7001/login # {"message":"登录成功"}

curl -b cookies localhost:7001/user # hi, user


```

## 记住

```
vim app/controller/auth.js


```

```
'use strict';

const ms = require('ms');
const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    ctx.session.user = 6;
    ctx.session.maxAge = ms('30d');
    ctx.body = { message: '登录成功' };
    ctx.status = 200;
  }
}

module.exports = AuthController;


```

> 基于 Remember me Token 与 Session 实现的 "记住我" 的区别 详细参考 [Why remember me token?](https://stackoverflow.com/questions/5314785/why-remember-me-token)

## 哈希

```
cnpm i --save node-php-password


```

```
vim app/controller/auth.js


```

```
'use strict';

const ms = require('ms');
const crypto = require('crypto');
const Password = require('node-php-password');
const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const password = '18020125636';
    const plain = password + 'Well,you-feel\_invincible';
    const hash = crypto.createHash('sha256').update(plain).digest('hex');
    const result = Password.verify(hash, '$2y$10$aKQnebsmTLrsz2rJzjbiyOp3ddCr8N2rcwW56dQlwIXCfqeWxw9pm');
    if (result) {
      this.ctx.session.user = 6;
      this.ctx.session.maxAge = ms('30d');
      this.ctx.body = { message: '登录成功' };
      this.ctx.status = 200;
    } else {
      this.ctx.session.user = null;
      this.ctx.body = { message: '登录失败' };
      this.ctx.status = 401;
    }
  }
}

module.exports = AuthController;


```

- 测试

```
curl -c cookies -X POST localhost:7001/login # {"message":"登录成功"}


```

## 数据库

```
docker run --name mysql-egg -p 3306:3306 -e MYSQL\_ROOT\_PASSWORD=123456 -d mysql:5.7.17

docker exec -i mysql-egg mysql -uroot -p123456  <<< "CREATE DATABASE IF NOT EXISTS zhg DEFAULT CHARSET utf8 COLLATE utf8\_general\_ci;"

docker exec -i mysql-egg mysql -uroot -p123456 zhg < ./test/users.sql


```

## ORM

```
cnpm i --save egg-sequelize mysql2


```

```
vim config/config.default.js


```

```
// 省略了未修改的代码
  config.sequelize = {
    dialect: 'mysql',
    database: 'zhg',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: '123456',
  };
// 省略了未修改的代码


```

```
vim config/plugin.js


```

```
// 省略了未修改的代码
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};


```

> 更多参考 [egg-sequelize](https://github.com/eggjs/egg-sequelize)

```
mkdir app/model

vim app/model/user.js


```

```
'use strict';

module.exports = app => {
  const { BIGINT, TINYINT, DATE, STRING } = app.Sequelize;

  const User = app.model.define('users', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    created\_at: DATE,
    updated\_at: DATE,
    nick\_name: STRING(50),
    unique\_name: STRING(16),
    password: STRING(128),
    is\_active: TINYINT,
  }, {
    tableName: 'users',
    createdAt: 'created\_at',
    updatedAt: 'updated\_at',
    indexes: \[
      {
        unique: true,
        fields: \[ 'unique\_name' \],
      },
    \],
  });

  return User;
};


```

> 更多参考 [Model definition](http://docs.sequelizejs.com/manual/tutorial/models-definition.html) 或 [Model definition - 模型定义](https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/models-definition.md)

```
vim app/controller/user.js


```

```
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const id = this.ctx.session.user;
    const user = await this.ctx.model.User.findById(id);
    this.ctx.body = 'hi, ' + user.nick\_name;
  }
}

module.exports = UserController;


```

- 测试

```
curl -b cookies localhost:7001/user # hi, 王世新


```

## 迁移

```
vim package.json


```

```
// 省略了未修改的代码
    "autod": "autod",
    "migrate:new": "egg-sequelize migration:create",
    "migrate:up": "egg-sequelize db:migrate",
    "migrate:down": "egg-sequelize db:migrate:undo"
// 省略了未修改的代码


```

```
cnpm run migrate:new -- --name create-posts-table

vim migrations/\*create-posts-table.js


```

```
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, BIGINT } = Sequelize;

    return queryInterface.createTable('posts', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created\_at: {
        type: DATE,
      },
      updated\_at: {
        type: DATE,
      },
      title: STRING(50),
      user\_id: {
        type: BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('posts');
  },
};


```

```
cnpm run migrate:up


```

```
vim app/model/post.js


```

```
'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING, BIGINT } = app.Sequelize;

  const Post = app.model.define('posts', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created\_at: DATE,
    updated\_at: DATE,
    title: STRING(50),
    user\_id: BIGINT.UNSIGNED,
  }, {
    tableName: 'posts',
    createdAt: 'created\_at',
    updatedAt: 'updated\_at',
  });

  return Post;
};


```

```
vim app/router.js


```

```
'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth();

  router.get('/', controller.home.index);
  router.post('/login', controller.auth.login);
  router.get('/user', auth, controller.user.index);
  router.post('/post', auth, controller.post.store);
  router.get('/post', auth, controller.post.index);
};


```

```
vim app/controller/post.js


```

```
'use strict';

const Controller = require('egg').Controller;

class PostController extends Controller {
  async store() {
    const post = await this.ctx.model.Post.create({
      title: '你好',
      user\_id: this.ctx.session.user,
    });
    this.ctx.body = 'hi, ' + post.title;
  }

  async index() {
    const post = await this.ctx.model.Post.findById(1);
    this.ctx.body = 'hi, ' + post.title;
  }
}

module.exports = PostController;


```

- 测试

```
curl -b cookies -X POST localhost:7001/post # hi, 你好

curl -b cookies localhost:7001/post # hi, 你好


```

## 关联

```
vim app/model/user.js


```

```
// 省略了未修改的代码
  User.associate = function() {
    app.model.User.hasMany(app.model.Post, { foreignKey: 'user\_id' });
  };
// 省略了未修改的代码


```

```
vim app/model/post.js


```

```
// 省略了未修改的代码
  Post.associate = function() {
    app.model.Post.belongsTo(app.model.User, { foreignKey: 'user\_id' });
  };
// 省略了未修改的代码


```

```
vim app/controller/user.js


```

```
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const id = this.ctx.session.user;
    const include = {
      include: \[{
        model: this.ctx.model.Post,
        as: 'posts',
      }\],
    };
    const user = await this.ctx.model.User.findById(id, include);
    this.ctx.body = 'hi, ' + user.nick\_name + ' ' + user.posts\[0\].title;
  }
}

module.exports = UserController;


```

```
vim app/controller/post.js


```

```
// 省略了未修改的代码
  async index() {
    const include = {
      include: \[{
        model: this.ctx.model.User,
        as: 'user',
      }\],
    };
    const post = await this.ctx.model.Post.findById(1, include);
    this.ctx.body = 'hi, ' + post.title + ' ' + post.user.nick\_name;
  }
// 省略了未修改的代码


```

- 测试

```
curl -b cookies localhost:7001/user # hi, 王世新 你好

curl -b cookies localhost:7001/post # hi, 你好 王世新


```

> 更多参考 [Associations](http://docs.sequelizejs.com/manual/tutorial/associations.html) 或 [Associations - 关联](https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/associations.md)

## 小结

#### 特点

- [渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html)

#### 已解决

- 登录 (基于 redis session) -> 记住密码 (基于 redis session)
- 鉴权 ([中间件](https://eggjs.org/zh-cn/basics/middleware.html))
- 与 php password 打通 (基于 node-php-password)
- ORM 基础 (参考 [Model definition](http://docs.sequelizejs.com/manual/tutorial/models-definition.html))
- ORM 关联 (一对多 参考 [Associations - 关联](https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/associations.md))

#### 待验证

- 分页
- 参数校验 (参考 [egg-validate](https://github.com/eggjs/egg-validate))
- [异常处理](https://eggjs.org/zh-cn/core/error-handling.html) & [统一错误处理](https://eggjs.org/zh-cn/tutorials/restful.html)

#### 发布

- [生产环境和配置](https://eggjs.org/zh-cn/basics/config.html)
- [logger](https://eggjs.org/zh-cn/core/logger.html)
- [性能监控](https://www.aliyun.com/product/nodejs)
