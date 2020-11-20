'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    try {
      const result = await this.service.user.get();
      this.ctx.body = result;
    } catch (error) {
      this.ctx.body = error;
    }


    // 调用service层操作数据库
    // console.log((await this.service.user.get()));
  }
}

module.exports = UserController;
