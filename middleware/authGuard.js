const jwt = require('jsonwebtoken')
const System = require('../utils/system')
const whiteList = ['/common/auth/login_POST']
module.exports = async (ctx, next) => {
  const config = System.getObject('config.default').jwtConfig()
  let url = `${ctx.url}_${ctx.method}`
  if (whiteList.indexOf(url) !== -1) {
    await next()
  } else {
    try {
      const token = (ctx.headers.authorization.replace('Bearer ', '')) || ctx.headers.token
      const payload = jwt.verify(token, config.publicKey);
      ctx.state.user = payload
      await next()
    } catch (err) {
      // TODO: refreshtoken 无感应刷新 暂时不做
      if (err.message === 'jwt expired') {
        let payload = jwt.decode(token, config.publicKey)
        console.log('refreshtoken todo ---')
      }
      ctx.throw(401)
      // err
    }
  }
}