/* eslint valid-jsdoc: "off" */

'use strict';
const ms = require('ms');
const mssqlConfig = require('./config.mssql');
const redisConfig = require('./config.redis');

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
    myAppName: 'ATMP',
    security: {
      csrf: false, // 关闭 csrf 校验
    },
    mssql: mssqlConfig,
    redis: redisConfig,
    session: {
      key: 'ATMP',
      maxAge: ms('1 days'), // 7d
      renew: true,
      httpOnly: true,
      encrypt: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
