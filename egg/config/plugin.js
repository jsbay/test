'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportLocal: {
    enable: true,
    package: 'egg-passport-local',
  },
};
