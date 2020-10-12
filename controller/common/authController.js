const BaseController = require('../controller.base')
const System = require('../../utils/system')
class AuthController extends BaseController {
  constructor() {
    super('common', BaseController.getServiceName(AuthController))
  }

  async login (ctx, next) {
    let param = ctx.request.body
    if (param.username === process.env.ADMIN_USER && param.password === process.env.ADMIN_PWD) {
      let res = await this.service.login(param)
      ctx.body = System.orgResult(res)
    } else {
      ctx.body = System.orgResult(null, -1, '用户名或密码错误')
    }
  }
}
module.exports = AuthController