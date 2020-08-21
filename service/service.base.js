const System = require('../utils/system')

class ServiceBase {
  constructor(packageName, daoName) {
    this.db = System.getObject('db.connect').getCon()
    this.daoName = daoName
    this.dao = System.getObject(`dao.${packageName}.${daoName}`)
  }

  static getDaoName(classObj) {
    let modelName = `${classObj["name"].substring(0, classObj["name"].lastIndexOf("Service"))}Dao`
    modelName = modelName.replace(/[A-Z]/, str => {
      return str.toLowerCase()
    })
    return modelName
  }
}
module.exports = ServiceBase