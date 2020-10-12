const BaseService = require('../service.base')
const jwt = require('jsonwebtoken')
const System = require('../../utils/system')
class AuthService extends BaseService {
  constructor() {
    super()
    this.config = System.getObject('config.default').jwtConfig()
  }

  async login (param) {
    const token = jwt.sign({ username: param.username, id: 0 }, this.config.privateKey, { algorithm: 'RS256', expiresIn: this.config.accessTokenExp })
    return { token }
  }
}
module.exports = AuthService