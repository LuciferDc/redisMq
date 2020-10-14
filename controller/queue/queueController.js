const BaseController = require('../controller.base')
const System = require('../../utils/system')
class QueueController extends BaseController {
  constructor() {
    super('queue', BaseController.getServiceName(QueueController))
    this.consumerService = System.getObject('service.queue.consumerService')
    this.emitter = System.getObject('util.emitters.eventEmitters').emitter
    this.emitter.on('queueInitFinish', () => {
      this.initConsumers()
    })
  }

  async getQueueList (ctx, next) {
    ctx.body = await this.service.getQueueList()
  }

  async initConsumers () {
    console.log('======= start consumers =======')
    this.consumerService.doConsumer()
    this.consumerService.doPendingConsumer()
  }
}
module.exports = QueueController