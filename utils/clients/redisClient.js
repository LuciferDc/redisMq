const System = require('../system')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)
class RedisClient {
  constructor() {
    this.config = this.config = System.getObject('config.default').redisConfig()
    console.log('======= init redis =======')
    console.log(this.config)
    this.client = redis.createClient({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: 1
    })

    this.client.on("error", function (err) {
      console.log("Redis Error --- " + err)
    })
  }

  async keys (reg) {
    return this.client.keysAsync(reg)
  }

  async xadd (key, id, data) {
    let func = `this.client.xaddAsync('${key}', '${id}'`
    let keys = Object.keys(data)
    keys.forEach(i => {
      func += `, '${i}', '${data[i]}'`
    })
    func += ')'
    let res = this.evalf(func)
    return res
  }

  async xack(key, group, id) {
    let func = `this.client.xackAsync('${key}', '${group}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xread () {
    let res = await this.client.xreadAsync('STREAMS', 'testx', 0)
    console.log(res[0][1][0][1])
  }

  async xgrouptest () {
    // let res = await this.client.xgroupAsync('create', 'testx', 'g1', 0)
    // console.log('g', res)
    let res = await this.client.xreadgroupAsync('group', 'g1', 'c1', 'noack', 'streams', 'testx', '>')
    res = this.orgStreamData(res)
    console.log('s', res)
  }

  evalf (fn) {
    console.log(fn)
    return new Function(`return ${fn}`).apply(this)
    
  }

  orgStreamData (data) {
    let res = {}
    data = data[0]
    res.streamName = data[0]
    data = data[1]
    data = data[0]
    res.id = data[0]
    data = data[1]
    res.data = {}
    for (let i = 0; i < data.length; i += 2) {
      res.data[data[i]] = data[i + 1]
    }
    return res
  }
}
module.exports = RedisClient