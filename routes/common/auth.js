const System = require('../../utils/system')
const router = require('koa-router')()
const authCtl = System.getObject('controller.common.authController')
router.post('/login', authCtl.login.bind(authCtl))
module.exports = router