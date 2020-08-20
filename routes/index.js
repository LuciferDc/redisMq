import { DataTypes } from 'sequelize'
import db from '../db/connect'
import arr from '../db/testarr'
const router = require('koa-router')()
const arrModel = arr(db, DataTypes)
router.get('/', async (ctx, next) => {
  let res = await db.models.ts.findAll()
  await ctx.render('index', {
    title: JSON.stringify(res[0].dataValues)
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
