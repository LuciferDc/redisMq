const BaseService = require('../service.base')
const System = require('../../utils/system')
const axios = require('axios')
class ConsumerService extends BaseService {
  constructor() {
    super()
    this.redisClient = System.getObject('util.clients.redisClient')
    this.config = System.getObject('config.default').queueConfig()
  }

  async doConsumer () {
    try {
      let popData = await this.redisClient.xreadGroup(this.config.groupName, this.config.consumerName, [this.config.queueName], ['>'], 1, 0)
      console.log(popData)
      await this.consumerRequest(popData)
    } catch (error) {
      console.log('doConsumer Error: ', error)
      // TODO: 记录日志
    }
    this.doConsumer()
  }

  async doPendingConsumer () {
    try {
      let pendingList = await this.redisClient.xpending(this.config.queueName, this.config.groupName, ['-', '+', 1], this.config.consumerName);
      if (pendingList.length > 0) {
        console.log(pendingList)
        let pendingData = pendingList[0]
        if (pendingData.count >= 5) {
          await this.redisClient.xack(this.config.queueName, this.config.groupName, pendingData.id);
          // TODO: 重试五次失败 记录日志
        } else if (pendingData.exp > 30000) {
          let popData = await this.redisClient.xreadGroup(this.config.groupName, this.config.consumerName, [this.config.queueName], [pendingData.id])
          console.log(popData)
          await this.consumerRequest(popData)
        }
      }
    } catch (error) {
      console.log('doPendingConsumer Error: ', error)
      // TODO: 记录日志
    }

    // setTimeout(async () => {
    //   await this.doPendingConsumer()
    // }, 5000);
  }

  async consumerRequest (popData) {
    let id = popData[0].value[0].id
    let data = popData[0].value[0].data

    let requestConfig = this.getRequestConfig(data)
    let res = await axios.request(requestConfig)
    // TODO: 记录日志
    if (res.code == 0) {
      await this.redisClient.xack(this.config.queueName, this.config.groupName, id)
    }
  }

  getRequestConfig (data) {
    let typeBody = ['PUT', 'POST', 'PATCH']
    let httpConfig = {
      url: data.url,
      timeout: 20000,
    }

    if (data.param) {
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