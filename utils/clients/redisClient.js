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
      db: this.config.db
    })

    this.client.on("error", function (err) {
      console.log("Redis Error --- " + err)
    })
  }

  async keys (reg) {
    return this.client.keysAsync(reg)
  }


  /**
   * @description
   * @author liangwk
   * @param {*} key
   * @param {*} id
   * @param {*} data
   * @param {*} max
   * @param {boolean} dim
   * @returns 
   * @memberof RedisClient
   */
  async xadd (key, id, data, max, dim) {
    let func = `this.client.xaddAsync('${key}'`
    if (dim) {
      func += `, 'maxlen', '~', ${max}`
    } else if (max) {
      func += `, 'maxlen', ${max}`
    }

    func += `, '${id}'`
    let keys = Object.keys(data)
    keys.forEach(i => {
      func += `, '${i}', '${data[i]}'`
    })
    func += ')'
    let res = this.evalf(func)
    return res
  }

  async xack (key, group, id) {
    let func = `this.client.xackAsync('${key}', '${group}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xclaim (key, group, consumer, exprie, id) {
    let func = `this.client.xclaimAsync('${key}', '${group}', '${consumer}', '${exprie}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xdel (key, id) {
    let func = `this.client.xdelAsync('${key}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xgroupCreate (key, group, id) {
    let func = `this.client.xgroupAsync('create', '${key}', '${group}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xgroupDel (key, group) {
    let func = `this.client.xgroupAsync('destroy', '${key}', '${group}')`
    let res = this.evalf(func)
    return res
  }

  async xgroupDelConsumer (key, group, consumer) {
    let func = `this.client.xgroupAsync('delconsumer', '${key}', '${group}', '${consumer}')`
    let res = this.evalf(func)
    return res
  }

  async xgroupSetId (key, group, id) {
    let func = `this.client.xgroupAsync('setid', '${key}', '${group}', '${id}')`
    let res = this.evalf(func)
    return res
  }

  async xinfoStream (key) {
    let func = `this.client.xinfoAsync('stream', '${key}')`
    let res = await this.doSync(func)
    res = res ? this.orgStreamInfoData(res) : res
    return res
  }

  async xinfoGroup (key) {
    let func = `this.client.xinfoAsync('groups', '${key}')`
    let res = await this.doSync(func)
    res = res ? res.map(data => {
      return this.orgGroupInfoData(data)
    }) : res
    return res
  }

  async xinfoConsumer (key, group) {
    let func = `this.client.xinfoAsync('consumers', '${key}', '${group}')`
    let res = await this.doSync(func)
    res = res ? res.map(data => {
      return this.arrToObj(data)
    }) : res
    return res
  }

  async xlen (key) {
    let func = `this.client.xlenAsync('${key}')`
    let res = this.evalf(func)
    return res
  }

  /**
   * @description
   * @author liangwk
   * @param {*} key
   * @param {*} group
   * @param {array} range [start, end, count]
   * @param {*} consumer
   * @returns 
   * @memberof RedisClient
   */
  async xpending (key, group, range, consumer) {
    let func = `this.client.xpendingAsync('${key}', '${group}'`
    if (range && range.length == 3) {
      func += `, '${range[0]}', '${range[1]}', '${range[2]}'`
      if (consumer) {
        func += `, '${consumer}'`
      }
    }
    func += ')'
    let res = await this.doSync(func)
    if (res) {
      if (range && range.length == 3) {
        res = this.orgPending2(res)
      } else {
        res = this.orgPending1(res)
      }
    }

    return res
  }

  /**
   * @description
   * @author liangwk
   * @param {*} key
   * @param {array} range [start, end]
   * @param {*} count
   * @memberof RedisClient
   */
  async xrange (key, range, count) {
    let func = `this.client.xrangeAsync('${key}', '${range[0]}', '${range[1]}'`
    if (count) {
      func += `, 'COUNT', ${count}`
    }
    func += ')'
    let res = await this.doSync(func)
    res = res ? res.map(it => {
      return {
        id: it[0],
        data: this.arrToObj(it[1])
      }
    }) : res
    return res
  }

  /**
   * @description
   * @author liangwk
   * @param {array} keys
   * @param {array} ids
   * @param {*} count
   * @param {*} block
   * @returns 
   * @memberof RedisClient
   */
  async xread (keys, ids, count, block) {
    let func = `this.client.xreadAsync(`
    if (count) {
      func += `'count', ${count}, `
    }
    if (block >= 0) {
      func += `'block', ${block}, `
    }
    func += `'streams', `
    keys.forEach(i => {
      func += `'${i}', `
    })
    ids.forEach((i, idx, arr) => {
      if (idx < arr.length - 1) {
        func += `'${i}', `
      } else {
        func += `'${i}'`
      }
    })
    func += ')'
    let res = await this.doSync(func)
    res = res ? this.orgXReadInfo(res) : res
    return res
  }


  /**
   * @description
   * @author liangwk
   * @param {*} group
   * @param {*} consumer
   * @param {array} keys
   * @param {array} ids
   * @param {*} count
   * @param {*} block
   * @returns 
   * @memberof RedisClient
   */
  async xreadGroup (group, consumer, keys, ids, count, block) {
    let func = `this.client.xreadgroupAsync('group', '${group}', '${consumer}'`
    if (count) {
      func += `, 'count', ${count}`
    }
    if (block) {
      func += `, 'block', ${block}`
    }
    func += `, 'streams'`
    keys.forEach(i => {
      func += `, '${i}'`
    })
    ids.forEach(i => {
      func += `, '${i}'`
    })
    func += ')'
    let res = await this.doSync(func)
    res = res ? this.orgXReadInfo(res) : res
    return res
  }


  /**
   * @description
   * @author liangwk
   * @param {*} key
   * @param {array} range [end, start]
   * @param {*} count
   * @memberof RedisClient
   */
  async xrevrange (key, range, count) {
    let func = `this.client.xrevrangeAsync('${key}', '${range[0]}', '${range[1]}'`
    if (count) {
      func += `, 'COUNT', ${count}`
    }
    func += ')'
    let res = await this.doSync(func)
    res = res ? res.map(it => {
      return {
        id: it[0],
        data: this.arrToObj(it[1])
      }
    }) : res
    return res
  }


  /**
   * @description
   * @author liangwk
   * @param {*} key
   * @param {*} max
   * @param {boolean} dim
   * @returns 
   * @memberof RedisClient
   */
  async xtrim(key, max, dim) {
    let func = `this.client.xtrimAsync('${key}', 'maxlen'`
    if (dim) {
      func += `, '~'`
    }
    func += `, ${max})`
    let res = this.evalf(func)
    return res
  }

  async xgrouptest () {
    // let res = await this.client.xgroupAsync('create', 'testf', 'g1', 0)
    // console.log('g', res)
    let res = await this.client.xreadgroupAsync('group', 'g1', 'c1', 'streams', 'testf', '>')
    res = this.orgStreamData(res)
    console.log('s', res)
  }

  evalf (fn) {
    console.log(fn)
    return new Function(`return ${fn}`).apply(this)
  }

  async doSync (fn) {
    return this.evalf(fn)
  }

  orgStreamInfoData (data) {
    let res = {
      length: data[1],
      radixTree: {
        keyNum: data[3],
        nodeNum: data[5]
      },
      groupNum: data[7],
      lastKey: data[9],
      firstStream: {
        id: data[11][0],
        data: this.arrToObj(data[11][1])
      },
      lastStream: {
        id: data[13][0],
        data: this.arrToObj(data[13][1])
      }
    }
    return res
  }

  orgGroupInfoData (data) {
    let res = {
      name: data[1],
      consumerNum: data[3],
      pendingNum: data[5]
    }
    return res
  }

  orgPending1 (data) {
    let res = {
      num: data[0],
      firstId: data[1],
      lastId: data[2],
      consumers: data[3].map(it => {
        return { name: it[0], num: it[1] }
      })
    }
    return res
  }

  orgPending2 (data) {
    let res = data.map(it => {
      return {
        id: it[0],
        consumer: it[1],
        exp: it[2],
        count: it[3]
      }
    })
    return res
  }

  orgXReadInfo (data) {
    let res = data.map(i => {
      return {
        key: i[0],
        value: i[1].map(k => {
          return {
            id: k[0],
            data: this.arrToObj(k[1])
          }
        })
      }
    })
    return res
  }

  arrToObj (data) {
    return data.reduce((con, cur, idx, arr) => idx % 2 ? con : Object.assign(con, { [cur]: arr[idx + 1] }), {});
  }
}
module.exports = RedisClient