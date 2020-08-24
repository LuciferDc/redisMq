const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const Klogger = require('koa-logger')
const koaJwt = require('koa-jwt')
const authGuard = require('./middleware/authGuard')

const composeRouter = require('./routes/composeRouter')
const composeR = new composeRouter(`${__dirname}/routes`)
require('dotenv').config({ path: `${__dirname}/env/.env` })

const logger = Klogger((str) => {                // 使用日志中间件
  console.log(`[Router-${new Date}] ${str}`)
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger)
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// vetrify
app.use(koaJwt({ passthrough: true }).unless({ path: [/^\/user\/login/] }))
app.use(authGuard)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// origin
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
})

// routes
app.use(composeR.initRouters().routes())
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
