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
        // console.log(this);
        try {
          await this.pool.connect();
          // console.log(this.pool);
          const ps = new sql.PreparedStatement(this.pool);
          if (params && Object.getOwnPropertyNames(params).length > 0) {
            for (const [ key, value ] of Object.entries(params)) {
              typeof value === 'number' ? ps.input(key, sql.Int, value) : ps.input(key, sql.NVarChar, value);
            }
          }
          await ps.prepare(procedureName);
          // console.log(procedureName);
          const result = await ps.execute(params);
          await ps.unprepare();
          // console.log(result);
          return result;
        } catch (error) {
          console.log(error);
        }

      },
    };
    return this[DB];
  },
};
