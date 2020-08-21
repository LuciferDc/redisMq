import System from '../utils/system'
const db = System.getObject('db.connect').getCon()
const router = require('koa-router')()
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'test'
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
