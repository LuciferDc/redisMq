import Sequelize from 'sequelize'
import config from '../config/dufault'
import glob from 'glob'
import path from 'path'
class DbFactory {
  constructor() {
    console.log('======= seq init =======')
    const mysqlConfig = config.mysqlConfig()
    console.log(mysqlConfig)
    this.db = new Sequelize(
      mysqlConfig.dbname,
      mysqlConfig.user,
      mysqlConfig.password,
      mysqlConfig.config
    )
    this.db.Sequelize = Sequelize
    this.db.Op = Sequelize.Op
    this.initModels()
    this.initRelations()
  }

  async initModels () {
    const modelpath = path.normalize(`${__dirname}/models/`)
    const models = glob.sync(`${modelpath}/**/*.js`)
    models.forEach(m => {
      const modelTmp = require(m)
      modelTmp(this.db, Sequelize.DataTypes)
    })
    console.log('======= init models =======')
  }

  async initRelations() {
    console.log('======= init relations =======')
    // this.db.models.user.belongsToMany(this.db.models.role, { as: "Roles", through: 'p_userrole', constraints: false, });
  }

  getCon () {
    return this.db
  }
}
module.exports = DbFactory
