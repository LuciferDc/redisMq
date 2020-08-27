const ServiceBase = require('../service.base')
const System = require('../../utils/system')
class TestArrService extends ServiceBase {
  constructor() {
    super('testpackage', ServiceBase.getDaoName(TestArrService))
    this.redisClient = System.getObject('util.clients.redisClient')
  }
  async test (ctx) {
  return await this.redisClient.xadd('testf', '*', { a: 'b' })
    // return await this.redisClient.xgrouptest()
  }
}
module.exports = TestArrService