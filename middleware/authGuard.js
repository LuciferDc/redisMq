module.exports = async (ctx, next) => {
  try {
    console.log(ctx.state)
    await next()
  } catch (err) {
    console.log(err)
  }
}