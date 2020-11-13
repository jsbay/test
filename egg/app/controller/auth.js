'use strict';

const ms = require('ms');

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const { ctx } = this;
    ctx.session.user = 6;
    ctx.session.maxAge = ms('30d');
    ctx.body = { message: '登录成功' };
    ctx.status = 200;
  }
}

module.exports = AuthController;
