import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

import redisConfig from "./config.redis";
import mssqlConfig from "./config.mssql";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1605770222875_5281";

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    security: {
      csrf: false, // 关闭 csrf 校验
    },
    mssql: mssqlConfig,
    redis: redisConfig,
    session: {
      key: "EGG_TEST",
      maxAge: 30 * 24 * 3600 * 1000, // 30 天
      renew: true,
      httpOnly: true,
      encrypt: true,
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
