const System = require('../../utils/system')
const router = require('koa-router')()
const queueCtl = System.getObject('controller.queue.queueController')
const productCtl = System.getObject('controller.queue.productController')
router.post('/getQueueList', queueCtl.getQueueList.bind(queueCtl))
router.post('/push', productCtl.push.bind(productCtl))
module.exports = router