const ControllerBase = require('../controller.base')
class TestArrController extends ControllerBase {
  constructor() {
    super('testpackage', ControllerBase.getServiceName(TestArrController))
  }
  async test (ctx, next) {
    ctx.body = 'test ctl'
  }
}
module.exports = TestArrController