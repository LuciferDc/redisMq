const BaseService = require('../service.base')
const System = require('../../utils/system')
class ConsumerService extends BaseService {
  constructor() {
    super()
    this.redisClient = System.getObject('util.clients.redisClient')
    this.config = System.getObject('config.default').queueConfig()
  }

  async doConsumer() {
    try {
      let popData = await this.redisClient.xreadGroup(this.config.queueGroup, this.config.queueConsumer, [this.config.queueName], ['>'], 1, 0)
      let id = popData[0].value[0].id
      let data = popData[0].value[0].data
      
    } catch (error) {
      
    }
  }

  async doPendingConsumer() {

  }
}
module.exports = ConsumerService