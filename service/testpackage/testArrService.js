const BaseService = require('../service.base')
const System = require('../../utils/system')
class TestArrService extends BaseService {
  constructor() {
    super('testpackage', BaseService.getDaoName(TestArrService))
    this.queueService = System.getObject('service.queue.queueService');
  }
  async test (ctx) {
    // await this.redisClient.xadd('testx', '*', { a: 'b' })
  }
}
module.exports = TestArrService