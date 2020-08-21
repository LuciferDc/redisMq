const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

class composeRouter {
  constructor (routerPath) {
    this.router = router
    this.basePath = routerPath
  }

  initRouters () {
    let filePath = '/'
    this.requireRouters(filePath)
    return this.router
  }

  requireRouters (filePath) {
    let files = fs.readdirSync(`${this.basePath}${filePath}`)
    console.log('======= init routes =======')
    files.forEach(file => {
      let fileName = `${this.basePath}${filePath}${file}`
      if (fs.statSync(fileName).isFile() && path.extname(fileName) === '.js') {
        if (file !== 'composeRouter.js') {
          let innerRouter = require(fileName)
          let baseRouter = `${filePath}${file.substring(0, file.length - 3)}`
          if (file === 'index.js') {
            console.log(`router-url:`, '/', `- router-file:`, fileName)
            this.router.use('/', innerRouter.routes())
          } else {
            console.log(`router-url:`, baseRouter, `- router-file:`, fileName)
            this.router.use(baseRouter, innerRouter.routes())
          }
        }
      } else {
        this.requireRouters(this.basePath, `${filePath}${file}/`)
      }
    })
  }
}
module.exports = composeRouter