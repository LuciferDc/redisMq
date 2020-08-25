const fs = require('fs')
class Config {
  constructor() {
    this.ENVI = {
      MYSQL_HOST: process.env.MYSQL_HOST,
      MYSQL_PORT: process.env.MYSQL_PORT,
      MYSQL_USER: process.env.MYSQL_USER,
      MYSQL_PWD: process.env.MYSQL_PWD,
      MYSQL_DB_NAME: 'queue',
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PWD: process.env.REDIS_PWD,
      REDIS_DB: 0,
      SERVER_ENV: process.env.SERVER_ENV || 'development',
      ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP,
      REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP
    }
  }
  baseConfig () {
    return {
      port: 3000,
      env: this.ENVI.SERVER_ENV
    }
  }

  mysqlConfig () {
    return {
      dbname: this.ENVI.MYSQL_DB_NAME,
      user: this.ENVI.MYSQL_USER,
      password: this.ENVI.MYSQL_PWD,
      config: {
        host: this.ENVI.MYSQL_HOST,
        port: this.ENVI.MYSQL_PORT,
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
  jwtConfig () {
    return {
      privateKey: fs.readFileSync(`${__dirname}/../env/private.pem`).toString(),
      publicKey: fs.readFileSync(`${__dirname}/../env/public.pem`).toString(),
      accessTokenExp: this.ENVI.ACCESS_TOKEN_EXP,
      refreshTokenExp: this.ENVI.REFRESH_TOKEN_EXP
    }
  }
}
module.exports = Config