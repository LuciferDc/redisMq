const BaseController = require('../controller.base')
const System = require('../../utils/system')
class QueueController extends BaseController {
  constructor() {
    super('queue', BaseController.getServiceName(QueueController))
    this.consumerService = System.getObject('service.queue.consumerService')
    this.initConsumers()
  }

  async getQueueList (ctx, next) {
    ctx.body = await this.service.getQueueList()
  }

  async initConsumers () {
    setTimeout(() => {
      console.log('start consumers')
      this.consumerService.doConsumer()
      this.consumerService.doPendingConsumer()
    }, 5000);
  }
}
module.exports = QueueController