const System = require('../utils/system')

class BaseController {
  constructor(packageName, serviceName) {
    this.service = System.getObject(`service.${packageName}.${serviceName}`)
  }

  static getServiceName (classObj) {
    let serviceName = `${classObj["name"].substring(0, classObj["name"].lastIndexOf("Controller"))}Service`
    serviceName = serviceName.replace(/[A-Z]/, str => {
      return str.toLowerCase()
    })
    return serviceName
  }
}
module.exports = BaseController