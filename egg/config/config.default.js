/* eslint valid-jsdoc: "off" */

'use strict';

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
    security: {
      csrf: false, // 关闭 csrf的防范
    },
    // passportLocal: {
    // 要校验的 username 字段 defaults to username
    // usernameField: 'username',
    // 要校验的 password 字段 defaults to password
    // passwordField: 'password',
    // },
  };

  return {
    ...config,
    ...userConfig,
  };
};
