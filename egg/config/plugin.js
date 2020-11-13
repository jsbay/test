'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // },
  mssql: {
    enable: true,
    package: 'egg-mssql',
  },
};
