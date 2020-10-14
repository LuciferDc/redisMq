const BaseService = require('../service.base')
const System = require('../../utils/system')
const axios = require('axios')
class ConsumerService extends BaseService {
  constructor() {
    super()
    this.redisClient = System.getObject('util.clients.redisClient')
    this.config = System.getObject('config.default').queueConfig()
  }

  async doConsumer() {
    try {
      let popData = await this.redisClient.xreadGroup(this.config.queueGroup, this.config.queueConsumer, [this.config.queueName], ['>'], 1, 0)
      await this.consumerRequest(popData)
    } catch (error) {
      // TODO: 记录日志
    }
    this.doConsumer()
  }

  async doPendingConsumer() {
    try {
      let pendingList = await this.redisClient.xpending(this.config.queueName, this.config.queueGroup, ['-', '+', 1], this.config.queueConsumer);
      if (pendingList.length > 0) {
        let pendingData = pendingList[0]
        if (pendingData.count >= 5) {
          await this.redisClient.xack(this.config.queueName, this.config.queueGroup, pendingData.id);
          // TODO: 重试五次失败 记录日志
        } else if (pendingData.exp > 30000) {
          let popData = await this.redisClient.xreadGroup(this.config.queueGroup, this.config.queueConsumer, [this.config.queueName], [pendingData.id])
          await this.consumerRequest(popData)
        }
      }
    } catch (error) {
      // TODO: 记录日志
    }

    setTimeout(async () => {
      await this.doPendingConsumer()
    }, 5000);
  }

  async consumerRequest(popData) {
    let id = popData[0].value[0].id
    let data = popData[0].value[0].data
    
    let requestConfig = this.getRequestConfig(data)
    let res = await axios.request(requestConfig)
    // TODO: 记录日志
    if (res.code == 0) {
      await this.redisClient.xack(this.config.queueName, this.config.queueGroup, id)
    }
  }

  getRequestConfig(data) {
    let typeBody = ['PUT', 'POST', 'PATCH']
    let httpConfig = {
      url: data.url,
      timeout: 20000,
    }

    if(data.param) {
      if (data.method && typeBody.includes(data.method)) {
        httpConfig.method = data.method
        httpConfig.data = data.param
      } else {
        httpConfig.param = data.param
      }
    }

    if (data.header) {
      httpConfig.headers = data.header
    }
  }
}
module.exports = ConsumerService