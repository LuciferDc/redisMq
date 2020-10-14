const System = require('../../utils/system')
const router = require('koa-router')()
const queueCtl = System.getObject('controller.queue.queueController')
router.post('/getQueueList', queueCtl.getQueueList.bind(queueCtl))
module.exports = router