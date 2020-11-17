'use strict';

const sql = require('mssql');
const mssqlConfig = require('./config/config.mssql');

const pool = new sql.ConnectionPool(mssqlConfig); // 初始化 一个连接池

pool.on('error', err => {
  err && console.log(err);
});

const db = async () => {
  await pool.connect();

  try {
    const ps = new sql.PreparedStatement(pool);
    // 执行一个 需要传参的存储过程时
    // 拼接成字符串执行 OK
    // const params = {
    //   userName: 'baizhanying@autobio.com.cn',
    //   pwd: 'e10adc3949ba59abbe56e057f20f883e',
    // };
    // await ps.prepare(`UP_ATMP_R_UM_User '${params.userName}', '${params.pwd}'`);
    // const result = await ps.execute();
    // 传参

    ps.input('userName', sql.NVarChar);
    ps.input('psw', sql.NVarChar);
    await ps.prepare('UP_ATMP_R_UM_User \'@userName\', \'@psw\'');
    const params = {
      userName: 'baizhanying@autobio.com.cn',
      pwd: 'e10adc3949ba59abbe56e057f20f883e',
    };
    const result = await ps.execute(params);


    // 执行无需传参的存储过程时, OK
    // UP_ATMP_R_UM_RoleList 是一个无需传参的存储过程
    // await ps.prepare('UP_ATMP_R_UM_RoleList');
    // const result = await ps.execute();
    console.log(result);
    await ps.unprepare();
  } catch (error) {
    console.log(error);
  }

};

db();
