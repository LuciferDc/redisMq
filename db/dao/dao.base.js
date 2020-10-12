const System = require('../../utils/system')
class BaseDao {
  constructor(modelName) {
    this.modelName = modelName
    const db = System.getObject('db.connect').getCon()
    this.db = db
    this.model = db.models[this.modelName]
  }

  static getModelName(classObj) {
    let modelName = classObj["name"].substring(0, classObj["name"].lastIndexOf("Dao"))
    modelName = modelName.replace(/^[A-Z]/, str => {
      return str.toLowerCase()
    })
    return modelName
  }
}
module.exports = BaseDao