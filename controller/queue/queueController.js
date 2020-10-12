const BaseController = require('../controller.base')
class QueueController extends BaseController {
 constructor() {
   super('queue', BaseController.getServiceName(QueueController))
 }

 async getQueueList () {
   
 }
}
module.exports = QueueController