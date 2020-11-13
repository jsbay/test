'use strict';

const mssql = require('mssql');
const Service = require('egg').Service;
class UserService extends Service {
  async get() {
    // use db1
    const request = new mssql.Request();
    const rows = await request.execute();

    return rows;
  }
}

module.exports = UserService;
