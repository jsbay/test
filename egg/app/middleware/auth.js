'use strict';

module.exports = () => {
  return async function (ctx, next) {
    if (!ctx.session.user) {
      ctx.status = 403;
      ctx.body = 'forbidden';
      return;
    }
    await next();
  };
};
