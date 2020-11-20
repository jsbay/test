'use strict';

module.exports = () => {
  return async function auth(ctx, next) {
    if (!ctx.isAuthenticated()) {
      console.log('Authentication failed');
      ctx.body = {
        errNo: 300,
        errMsg: 'Authentication failed',
      };

      ctx.session.returnTo = ctx.path;
      return;
      // ctx.redirect('/login');
    }
    await next();
  };
};
