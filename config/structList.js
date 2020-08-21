import path from 'path'
const basePath = path.normalize(path.join(__dirname, '..'))
const structList = {
  controller:path.join(basePath, 'controller/impl'),
  service:path.join(basePath, 'service/impl'),
  db:path.join(basePath, 'db'),
  dao: path.join(basePath, 'db/dao'),
  model: path.join(basePath, 'db/model'),
  util:path.join(basePath, 'utils')
}
module.exports = structList