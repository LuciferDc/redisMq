const BaseService = require('../service.base')
const System = require('../../utils/system')
class ProductService extends BaseService {
  constructor() {
    super()
    this.redisClient = System.getObject('util.clients.redisClient')
    this.config = System.getObject('config.default').queueConfig()
  }

  async push(data) {
    try {
      let res = await this.redisClient.xadd(this.config.queueName, '*', data, 1000, true)
      return null
    } catch (error) {
      console.log('pushQueue Error: ', error.message)      
      return error.message
    }
  }
}
module.exports = ProductService