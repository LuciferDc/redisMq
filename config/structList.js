const path = require('path')
const basePath = path.normalize(path.join(__dirname, '..'))
const structList = {
  controller: path.join(basePath, 'controller'),
  service: path.join(basePath, 'service'),
  db: path.join(basePath, 'db'),
  dao: path.join(basePath, 'db/dao'),
  model: path.join(basePath, 'db/model'),
  util: path.join(basePath, 'utils'),
  config: path.join(basePath, 'config')
}
module.exports = structList