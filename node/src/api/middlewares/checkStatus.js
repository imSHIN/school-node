export default {
  checkAdmin(req, res, next) {
    const user = req.session.user
    if (!user) { //status是9表示管理员
      res.send({
        status: 2, //表明登陆验证出错
        statusInfo: {
          message: '请先登陆'
        }
      })
      return
    } else if (user.status !== 9) {
      res.send({
        status: 2, //表示登陆验证出错
        statusInfo: {
          message: '用户权限不足'
        }
      })
      return
    }
    next()
  },
  checkTeacher(req, res, next) {
    const user = req.session.user
    if (!user) { //status是8表示教师
      res.send({
        status: 2, //表明登陆验证出错
        statusInfo: {
          message: '请先登陆'
        }
      })
      return
    } else if (user.status !== 8) {
      res.send({
        status: 2, //表示登陆验证出错
        statusInfo: {
          message: '用户权限不足'
        }
      })
      return
    }
    next()
  },
  checkStudent(req, res, next) {
    const user = req.session.user
    if (!user) {
      res.send({
        status: 2, //表明登陆验证出错
        statusInfo: {
          message: '请先登陆'
        }
      })
      return
    } else if (user.status !== 1) {
      res.send({
        status: 2, //表示登陆验证出错
        statusInfo: {
          message: '用户权限不足'
        }
      })
      return
    }
    next()
  },
  checkNotStudent(req, res, next){
    const user = req.session.user
    // console.log(user)
    if (!user) { 
      res.send({
        status: 2, //表明登陆验证出错
        statusInfo: {
          message: '请先登陆'
        }
      })
      return
    } else if (user.status === 1) {
      res.send({
        status: 2, //表示登陆验证出错
        statusInfo: {
          message: '用户权限不足'
        }
      })
      return
    }
    next()
  }
}