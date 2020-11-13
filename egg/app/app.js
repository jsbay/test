/*
 * @Create       : 2020-11-13 14:22:13
 * @Author       : BayMax <13140111181@163.com>
 * @FilePath     : /TEST/egg/app/app.js
 * @Description  :
 */
'use strict';
// const USERS = [
//   {
//     username: 'bay',
//     password: '123456',
//   },
//   {
//     username: 'admin',
//     password: '666666',
//   },
// ];

module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    console.log('ctx', ctx);
    return user;
  });
  // app.passport.serializeUser(async (ctx, user) => {
  //   // 序列化user信息
  // });
  // app.passport.deserializeUser(async (ctx, user) => {
  //   // 反序列化user信息
  // });
};
