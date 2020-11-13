'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const gzip = app.middleware.gzip({ threshold: 10 });

  router.get('/', gzip, controller.home.index);
  router.get('/login', controller.home.login);

  const localStrategy = app.passport.authenticate('local');
  router.post('/login', localStrategy);

  router.get('/logout', 'home.logout');
};
