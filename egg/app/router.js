'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const gzip = app.middleware.gzip({ threshold: 10 });
  const auth = app.middleware.auth();

  router.get('/', gzip, controller.home.index);
  router.post('/login', controller.auth.login);
  router.get('/user', auth, controller.user.index);
};
