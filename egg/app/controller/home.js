'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    if (ctx.isAuthenticated()) {
      // passport 存储的信息
      // console.log(ctx.session.passport);
      // passport 挂载到 ctx 的 user
      // console.log(ctx.user);
      ctx.body = `<!DOCTYPE html>
                  <html>
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <meta http-equiv="X-UA-Compatible" content="ie=edge">
                      <title> welcome, ${ctx.user.username}</title>
                  </head>
                  <body>
                    <h1>welcome, ${ctx.user.username} </h1>
                    <p><a href="/logout">log out</a></p>
                  </body>
                  </html>`;
    } else {
      console.log('redirect to: ', ctx.path);
      ctx.session.returnTo = ctx.path;
      ctx.redirect('/login');
    }
  }

  async login() {
    this.ctx.body = `<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>LoginPage</title>
                    </head>
                    <body>
                        <form action="/login" method="post">
                            <label for="usernmae">
                                Usernmae:
                                <input type="text" value="bay" id="usernmae" name="username">
                            </label>
                            <label for="password">
                                Password:
                                <input type="text" value="123456" id="password" name="password">
                            </label>
                            <input type="submit" value="Submit">
                        </form>
                    </body>
                    </html>`;
  }

  async logout() {
    await this.ctx.logout();
    this.ctx.redirect(this.ctx.get('referer') || '/');
  }
}

module.exports = HomeController;
