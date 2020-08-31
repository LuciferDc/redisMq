const ServiceBase = require('../service.base')
const System = require('../../utils/system')
class TestArrService extends ServiceBase {
  constructor() {
    super('testpackage', ServiceBase.getDaoName(TestArrService))
    this.redisClient = System.getObject('util.clients.redisClient')
  }
  async test (ctx) {
  // await this.redisClient.xadd('testx', '*', { a: 'b' })
  return await this.redisClient.xtrim('testf', 5)
  // return await this.redisClient.xgrouptest()
  }
}
module.exports = TestArrService