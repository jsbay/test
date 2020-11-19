import { Service } from "egg";

export default class UserService extends Service {
  public async getUser() {
    const params = {
      pageLimit: 20,
      opName: "test",
      currentPage: 1,
    };
    const procedureStr = `[UP_ATMP_R_Base_messageList] ${params.pageLimit},${params.currentPage},'${params.opName}'`;
    const result = await this.app.db.execProcedure(procedureStr, params);
  }
}
