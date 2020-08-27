const ControllerBase = require('../controller.base')
class QueueController extends ControllerBase {
 constructor() {
   super('queue', ControllerBase.getServiceName(QueueController))
 }

 async push (ctx, next) {
   ctx.body = await this.service.test(ctx)
 }
}
module.exports = QueueController