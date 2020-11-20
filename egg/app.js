'use strict';

module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    // console.log('ctx', ctx);
    // console.log('user', user);
    // console.log(app.db.execProcedure(procedureStr, ));
    return user;
  });

  app.passport.serializeUser(async (ctx, user) => {
    // return pick(user, ['id', 'name', 'username', 'email']);
    return user;
  });

  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
};
