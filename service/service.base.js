const System = require('../utils/system')

class BaseService {
  constructor(packageName, daoName) {
    this.db = System.getObject('db.connect').getCon()
    this.daoName = daoName
    this.dao = System.getObject(`dao.${packageName}.${daoName}`)
  }

  static getDaoName(classObj) {
    let daoName = `${classObj["name"].substring(0, classObj["name"].lastIndexOf("Service"))}Dao`
    daoName = daoName.replace(/^[A-Z]/, str => {
      return str.toLowerCase()
    })
    return daoName
  }
}
module.exports = BaseService