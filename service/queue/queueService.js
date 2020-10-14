const BaseService = require("../service.base")
const System = require('../../utils/system')
class QueueService extends BaseService {
  constructor() {
    super()
    this.redisClient = System.getObject('util.clients.redisClient')
    this.config = System.getObject('config.default').queueConfig()
    this.init()
    this.emitter = System.getObject('util.emitters.eventEmitters').emitter
  }

  async init () {
    console.log('======= init queue =======')

    // 如果 key 不存在 1 xadd 2 创建组 3 xgroupread 4 xack 5 开始消费
    // 如果 key 存在 1 (try 上面 2 cache) 上面 5
    let keys = await this.redisClient.getKeys(this.config.queueName)
    if (0 === keys.length) {
      await this.redisClient.xadd(this.config.queueName, '*', { start: '0' }, 1000, true)
      await this.redisClient.xgroupCreate(this.config.queueName, this.config.groupName, 0)
      let firstData = await this.redisClient.xreadGroup(this.config.groupName, this.config.consumerName, [this.config.queueName], ['>'], 1, 0)
      let id = firstData[0].value[0].id
      await this.redisClient.xack(this.config.queueName, this.config.groupName, id)
      this.emitter.emit('queueInitFinish')
    } else {
      try {
        await this.redisClient.xgroupCreate(this.config.queueName, this.config.groupName, 0)
        this.emitter.emit('queueInitFinish')
      } catch (error) {
        if ('BUSYGROUP Consumer Group name already exists' !== error.message) {
          console.log(error)
        } else {
          this.emitter.emit('queueInitFinish')
        }
      }
    }
  }

  async getQueueList() {
    return await this.redisClient.getKeys('*Queue')
  }
}
module.exports = QueueService