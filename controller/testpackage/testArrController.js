const controllerBase = require('../controller.base')
class TestArrController extends controllerBase {
  constructor() {
    super('testpackage', controllerBase.getServiceName(TestArrController))
  }
  async test (ctx, next) {
    ctx.body = 'test ctl'
  }
}
module.exports = TestArrController