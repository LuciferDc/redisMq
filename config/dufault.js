const ENVI = {
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PWD: process.env.MYSQL_PWD,
  MYSQL_DB_NAME: 'queue',
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PWD: process.env.REDIS_PWD,
  REDIS_DB: 0,
  SERVER_ENV: process.env.SERVER_ENV || 'development'
}

const config = {
  port: 3000,
  env: ENVI.SERVER_ENV,
  mysqlConfig: () => {
    return {
      dbname: ENVI.MYSQL_DB_NAME,
      user: ENVI.MYSQL_USER,
      password: ENVI.MYSQL_PWD,
      config: {
        host: ENVI.MYSQL_HOST,
        port:ENVI.MYSQL_PORT,
        dialect: 'mysql',
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
        }
      },
    };
  }

}
module.exports = config
