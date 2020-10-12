const BaseController = require('../controller.base')
class TestArrController extends BaseController {
  constructor() {
    super('testpackage', BaseController.getServiceName(TestArrController))
  }
  async test (ctx, next) {
    ctx.body = await this.service.test(ctx)
  }
}
module.exports = TestArrController
