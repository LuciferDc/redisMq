const structList = require('../config/structList')
class System {
  static getObject (oPath) {
    let arr = oPath.split('.')
    let structName = arr[0]
    let packageName = arr[1]
    let className = arr[2]
    let classPath = className ? `${structList[structName]}/${packageName}/${className}.js` : `${structList[structName]}/${packageName}.js`

    if (System.objectList[classPath]) {
      return System.objectList[classPath]
    } else {
      if (packageName === 'undefined' && className === 'undefined') {
        return null
      }
      let classObject = null
      try {
        classObject = require(classPath)
        return System.register(classPath, classObject, packageName, className)
      } catch (err) {
        console.log('wrong package:', oPath, 'path:', classPath)
        console.log("getObj err msg", err)
      }
    }
  }

  static register (classPath, classObject, packageName, className) {
    if (System.objectList[classPath]) {
      throw new Error('重名文件')
    } else {
      let obj = null
      obj = new classObject(packageName, className)
      System.objectList[classPath] = obj
    }
    return System.objectList[classPath]
  }

  static orgResult(data = {}, code = 0, msg = 'success') {
    return {
      data,
      code,
      msg
    }
  }
}

System.objectList = {}
module.exports = System