const Sequelize = require('sequelize');
const db = new Sequelize(
  "queue",
  "root",
  "123456",
  {
    host: 'localmysql',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 90000000,
      idle: 1000000
    },
    debug: false,
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      // instanceName:'DEV'
    }  //设置MSSQL超时时间
  }
)
console.log('seq init')
module.exports = db;