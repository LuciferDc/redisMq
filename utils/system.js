import fs from 'fs'
import structList from '../config/structList'
class System {
  static getObject(oPath) {
    let arr = oPath.split('.')
    let structName = arr[0]
    let packageName = arr[1]
    let className = arr[2]
    let classPath = className ? `${structList[structName]}/${packageName}/${className}.js` : `${structList[structName]}/${packageName}.js`

    if (!System.objectList[classPath]) {
      return System.objectList[classPath]
    } else {
      let classObject = null
      try {
        classObject = require(classPath)
      } catch (err) {
        console.log('wrong package:', oPath, 'path:', classPath)
      }
      
    }
  }
}

System.objectList = {}
module.exports = System