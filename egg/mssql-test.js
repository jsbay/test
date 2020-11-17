
'use strict';
const sql = require('mssql');
const mssqlConfig = require('./config/config.mssql');
// const procedureName = 'R_ALL_USERS';
// const params = '';

// const ps = new sql.PreparedStatement(config);
// if (params) {
//   for (const param of params.values()) {
//     if (typeof param === 'number') {
//       ps.input(param, sql.Int);
//     } else {
//       ps.input(param, sql.Nvarchar);
//     }
//   }
// }
// ps.prepare(procedureName, err => {
//   if (err) {
//     return console.log('prepare failed', err);
//   }
//   ps.exceute(params, (err, result) => {
//     if (err) {
//       return console.log('exceute failed', err);
//     }
//     ps.unprepare(err => {
//       if (err) {
//         return console.log('unprepare failed', err);
//       }
//     });
//     return result;
//   });
// });

// const request = new sql.Request(mssqlConfig);
// request.execute('R_ALL_USERS', (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log('res:', result);
// });

const pool = new sql.ConnectionPool(mssqlConfig);

pool.on('error', err => {
  err && console.log(err);
});

// pool.connect()
//   .then(pool => {
//     pool.query('SELECT * FROM ISHS_USER', (err, result) => {
//       console.log('res:', result);
//     });
//   })
//   .then(() => {
//     return sql.close();
//   })
//   .catch(err => {
//     console.log(err);
//   });

const db = async () => {
  await pool.connect();
  // const ps = new sql.PreparedStatement(pool);
  // ps.input('userName', sql.NVarChar);
  // ps.input('psw', sql.NVarChar);

  // ps.prepare('select * from ATMP_UM_User where eMail = @userName', err => {
  //   // ... error checks
  //   err && console.log('prepare err', err);
  //   ps.execute({
  //     userName: 'baizhanying@autobio.com.cn',
  //   }, (err, result) => {
  //     // ... error checks
  //     err && console.log('execute err', err);

  //     console.log('execute success', result);
  //     // release the connection after queries are executed
  //     ps.unprepare(err => {
  //       // ... error checks
  //       err && console.log('unprepare err', err);
  //     });
  //   });
  // });

  // ps.prepare('UP_ATMP_R_UM_User', err => {
  // // ... error checks
  //   err && console.log('prepare err', err);
  //   ps.execute({
  //     userName: 'baizhanying@autobio.com.cn',
  //   }, (err, result) => {
  //   // ... error checks

  //     err && console.log('execute err', err);

  //     console.log('execute success', result);
  //     // release the connection after queries are executed
  //     ps.unprepare(err => {
  //     // ... error checks
  //       err && console.log('unprepare err', err);
  //     });
  //   });
  // });

  try {
    const request = new sql.Request(pool);
    const userName = 'baizhanying@autobio.com.cn';
    const result = await request.query(`select * from ATMP_UM_User where eMail = '${userName}'`);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const request = new sql.Request(pool);
  //   request.input('userName', sql.NVarChar, 'test');
  //   request.input('psw', sql.NVarChar, 'e10adc3949ba59abbe56e057f20f883e');
  //   const { recordset: [ result ] } = await request.execute('UP_ATMP_R_UM_User');
  //   console.log(result);
  // } catch (error) {
  //   console.log(error);
  // }
};

db();

// const pool = new sql.ConnectionPool(mssqlConfig);
// pool.on('error', err => {
//   if (err) {
//     console.log('\x1B[31m%s\x1B[0m', 'pool error' + err);
//   }
// });

// const aa = async () => {
//   try {
//     const conn = await pool.connect();
//     const request = await conn.request();
//     request.execute('R_ALL_USERS', function(err, recordsets) {
//       if (err) {
//         console.log('\x1B[31m%s\x1B[0m', 'R_ALL_USERS execute error: ' + err);
//       } else {
//         console.log('R_ALL_USERS execute success: ');
//         console.log(recordsets);
//       }
//       conn.close();
//     });
//   } catch (err) {
//     console.error('SQL error', err);
//   }
// };

// aa();

// --- ok
// const exec = async () => {
//   try {
//     const request = new sql.Request(pool);
//     request.input('userName', sql.NVarChar, 'baizhanying@autobio.com.cn');
//     request.input('psw', sql.NVarChar, 'e10adc3949ba59abbe56e057f20f883e1');
//     const { recordset: [ result ] } = await request.execute('UP_ATMP_R_UM_User');
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exec();
// --- ok

const exec = async () => {
  try {
    await pool.connect();
    const transaction = await pool.transaction();
    // console.log(transaction);
    await transaction.begin();
    const request = transaction.request();
    request.input('userName', sql.NVarChar, 'baizhanying@autobio.com.cn');
    request.input('psw', sql.NVarChar, 'e10adc3949ba59abbe56e057f20f883e1');
    const { recordset: [ result ] } = await request.execute('UP_ATMP_R_UM_User');
    await transaction.commit();
    return result;
  } catch (error) {
    console.log(error);
  }
};

exec();
