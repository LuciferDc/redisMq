const System = require('../utils/system')
const ctl = System.getObject('controller.testpackage.testArrController')
const router = require('koa-router')()
router.get('/', ctl.test.bind(ctl))

module.exports = router
