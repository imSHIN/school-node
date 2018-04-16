export default {
  login (req, res, next) {
    // console.log(req.session.user)
    if (!req.session.user) {
      res.send({
        status: 2, //表明登陆验证出错
        statusInfo: {
          message: '请先登陆'
        }
      })
      return
    }
    next()
  },
  notLogin (req, res, next) {
    // if (req.session.user) {
    //   res.send({
    //     status: 1, //表明登陆验证出错
    //     statusInfo: {
    //       message: '你已经登陆了'
    //     }
    //   })
    //   return
    // }
    next()
  }
}