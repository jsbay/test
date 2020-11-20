'use strict';

const Service = require('egg').Service;
class UserService extends Service {
  async get() {
    // console.log(this.app.db.config);
    const params = {
      pageLimit: 20,
      opName: 'test',
      currentPage: 1,
    };
    // const procedureStr = `[UP_ATMP_R_Base_messageList] ${params.pageLimit},${params.currentPage},'${params.opName}'`;
    const procedureStr = '[UP_ATMP_R_Base_messageList] @pageLimit,@currentPage,@opName';
    const { recordset: [ result ] } = await this.app.db.execProcedure(procedureStr, params);
    // console.log(result);
    result.messageList = JSON.parse(result.messageList);
    return result;
  }
}

module.exports = UserService;