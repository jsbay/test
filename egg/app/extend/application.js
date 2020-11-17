/*
 * @@Date @Author
 * @Create       : 2020-11-16 16:04:32
 * @Author       : BayMax <13140111181@163.com>
 * @FilePath     : /TEST/egg/app/extend/application.js
 * @Description  :
 */
'use strict';
const path = require('path');

const sql = require('mssql');
const mssqlConfig = require(path.join(process.cwd(), '/config/config.mssql'));
const pool = new sql.ConnectionPool(mssqlConfig);

pool.on('error', err => {
  err && console.log(err);
});

const DB = Symbol('Application#db');

module.exports = {
  get db() {
    if (this[DB]) {
      return this[DB];
    }
    this[DB] = {
      config: this.config.mssql,
      async execProcedure(procedureName, params) {
        // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
        console.log('execProcedure', this);
        await pool.connect();
        const ps = new sql.PreparedStatement(pool);
        if (params && Object.getOwnPropertyNames(params).length > 0) {
          for (const [ key, value ] of Object.entries(params)) {
            typeof value === 'number' ? ps.input(key, sql.Int, value) : ps.input(key, sql.NVarChar, value);
          }
        }
        await ps.prepare(procedureName);
        const result = await ps.execute(params);
        await ps.unprepare();
        // console.log(result);
        return result;
      },
    };
    return this[DB];
  },
};

