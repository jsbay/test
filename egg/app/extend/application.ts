import * as path from "path";
import * as sql from "mssql";

const DB = Symbol("Application#db");

const mssqlConfig = require(path.join(process.cwd(), "/config/config.mssql"));
const pool = new sql.ConnectionPool(mssqlConfig);

pool.on("error", (err) => {
  err && console.log(err);
});
interface Db {
  execProcedure(procedureName: string, params?: object): Promise<object>;
}
// class Db extends Application {
//   config: string;
//
// }

export default {
  get db(): Db {
    if (this[DB]) {
      return this[DB];
    }
    this[DB] = {
      async execProcedure(procedureName, params) {
        try {
          await pool.connect();
          const ps = new sql.PreparedStatement(pool);
          if (params && Object.getOwnPropertyNames(params).length > 0) {
            for (const [key, value] of Object.entries(params)) {
              typeof value === "number"
                ? ps.input(key, sql.Int)
                : ps.input(key, sql.NVarChar);
            }
          }
          await ps.prepare(procedureName);
          const result = await ps.execute(params);
          await ps.unprepare();
          console.log(result);
          return result;
        } catch (err) {
          console.log(err);
        }
      },
    };
    return this[DB];
  },
};
