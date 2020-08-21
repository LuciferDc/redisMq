const ServiceBase = require('../../service.base')

class TestArrService extends ServiceBase {
  constructor() {
    super('testpackage', ServiceBase.getDaoName(TestArrService))
  }
}
module.exports = TestArrService