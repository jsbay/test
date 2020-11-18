## egg-mssql

依赖
- "mssql": "^6.2.3",
- "egg": "^2.15.1",

配置

1. 安装 mssql
```bash
yarn add mssql
```
2. 新建 ${root}/app/extend/application.js
> 将 mssql 封装到 app 上

```bash
touch ${root}/app/extend/application.js
```
3. ${root}/app/extend/application.js 内容
```js
// ${root}/app/extend/application.js
'use strict';
const sql = require('mssql');

const DB = Symbol('Application#db');

module.exports = {
  get db() {
    if (this[DB]) {
      return this[DB];
    }
    this[DB] = {
      config: this.config.mssql,
      pool: new sql.ConnectionPool(this.config.mssql),
      async execProcedure(procedureName, params) {
        // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
        console.log(this);
        try {
          await this.pool.connect();
          console.log(this.pool);
          const ps = new sql.PreparedStatement(this.pool);
          if (params && Object.getOwnPropertyNames(params).length > 0) {
            for (const [ key, value ] of Object.entries(params)) {
              typeof value === 'number' ? ps.input(key, sql.Int, value) : ps.input(key, sql.NVarChar, value);
            }
          }
          await ps.prepare(procedureName);
          const result = await ps.execute(params);
          await ps.unprepare();
          console.log(result);
          return result;
        } catch (error) {
          console.log(error);
        }

      },
    };
    return this[DB];
  },
};
```
4. config.default.js
```js
// /app/config/config.default.js

/* eslint valid-jsdoc: "off" */

'use strict';

const mssqlConfig = require('./config.mssql');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1605160183719_3847';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    mssql: mssqlConfig, // 新增
  };

  return {
    ...config,
    ...userConfig,
  };
};
```
5. config.mssql.js
```js
// /app/config/config.mssql.js
'use strict';

module.exports = {
  server: '192.168.49.10',
  port: 1433,
  user: 'ATMP01',
  password: '10AD7A7a',
  database: 'ATMP',
};
```
使用

1. service/user.js
```js
// /app/service/user.js
'use strict';

const Service = require('egg').Service;
class UserService extends Service {
  async get() {
    console.log(this.app.db.config);
    const params = {
      pageLimit: 20,
      opName: 'test',
      currentPage: 1,
    };
    const procedureStr = `[UP_ATMP_R_Base_messageList] ${params.pageLimit},${params.currentPage},'${params.opName}'`;
    const result = await this.app.db.execProcedure(procedureStr, params);
    // console.log(result);
    // result.roleList = JSON.parse(result.roleList);
    return result;
  }
}

module.exports = UserService;
```
2. controller/user.js
```js
// /app/controller/user.js
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    try {
      const result = await this.service.user.get();
      this.ctx.body = result;
    } catch (error) {
      this.ctx.body = error;
    }


    // 调用service层操作数据库
    // console.log((await this.service.user.get()));
  }
}

module.exports = UserController;
```