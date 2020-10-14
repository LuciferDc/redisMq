const BaseController = require('../controller.base')
const System = require('../../utils/system')
class ProductController extends BaseController {
  constructor() {
    super('queue', BaseController.getServiceName(ProductController))
  }

  async push(ctx, next) {
    let param = ctx.request.body
    if(param.url) {
      param = this.orgParam(param)
      let res = await this.service.push(param)
      res = res ? System.orgResult(null, -1, res) : System.orgResult(null, 0, 'success')
      ctx.body = res
    } else {
      ctx.body = System.orgResult(null, -1, 'url can\'t be null')
    }
  }

  orgParam(param) {
    if (param.param) {
      param.param = JSON.stringify(param.param)
    }
    if (param.header) {
      param.header = JSON.stringify(param.header)
    }
    return param
  }
}
module.exports = ProductController