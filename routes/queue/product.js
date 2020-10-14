const System = require('../../utils/system')
const router = require('koa-router')()
const productCtl = System.getObject('controller.queue.productController')
router.post('/push', productCtl.push.bind(productCtl))
module.exports = router
