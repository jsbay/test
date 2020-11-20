'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();

  const localStrategy = app.passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login' });

  router.get('/', auth, controller.home.index);

  router.get('/login', controller.home.login);

  router.post('/login', localStrategy);

  router.get('/logout', 'home.logout');

  router.get('/user', controller.user.index);
};
