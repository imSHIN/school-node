import userModel from '../models/user'
// import finalScoreModel from "../models/finalScores"

// import { userInfo } from 'os';
// import passwordHash from 'password-hash' //密码加密

//ES6/ES7重写
class UserControllers {
  constructor(){
  }

  //学生注册(单条)
  async addNewUser(req, res) {
    let {user, password = '', name, email = '', tel = '', grade, classNo, major = ''} = req.body //从post中获取上传的数据
    password = password || '123456' //如果未设置密码 则默认密码123456
    //对上传的数据进行判断,这里前端也要再判断一下再上传
    try {
      if (!user) {
        throw new Error('用户名参数错误')
      }
      if (!name) {
        throw new Error('姓名参数错误')
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo :{
          message: err.message,
          type: 'GET_WRONG_BODY'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)//密码使用password-hash模块加密
    try {
      const userInMongo = await userModel.findOne({ user: user }) //从数据库中查找是否有已经存在的相同账号
      //新用户
      if (!userInMongo) {
        const newUser = {
          user,
          password,
          name,
          email,
          tel,
          grade,
          classNo, // class不能声明 所以用classNo代替一下
          major
        }
        await userModel(newUser).save() //保存到数据库
        res.send({
          status: 0,
          statusInfo: {
            message: '注册成功'
          }
        })
      } else { 
        //账号已经存在
        res.send({
          status: 1,
          statusInfo: {
            message: '账号已经存在'
          }
        })
      }
    } catch (err) {
      console.log('userControllers: 注册失败' , err)
      res.send({
        status: 1,
        statusInfo: {
          message: '注册失败',
          type: 'MONGO_FINDONE_ERROR'
        }
      })
    }
  }

  //学生注册(多条)
  async addNewUsers(req, res) {
    let userInfos = req.body //从post中获取上传的数据
    const length = userInfos.length //上传的userInfos的长度
    //对上传的数据进行判断,这里前端也要再判断一下再上传
    try {
      // 普通的for循环性能比较好 所以用普通的for循环来验证参数
      for (let i = 0; i < length; i++) {
        if (!userInfos[i].user) {
          throw new Error(`第${i+1}位用户名参数错误`)
        }
        if (!userInfos[i].password) {
          userInfos[i].password = '123456'
        }
        if (!userInfos[i].name) {
          throw new Error(`第${i+1}位姓名参数错误`)
        }
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo: {
          message: err.message,
          type: 'GET_WRONG_BODY'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)//密码使用password-hash模块加密
    let notAddUser = [] // 没有添加成功的user数组 保存起来 返回给前端给于提醒
    let countAddUser = 0 // 添加成功的数据数量
    try {
      for (let i = 0; i < length; i++) {
        const userInMongo = await userModel.findOne({ user: userInfos[i].user }) //从数据库中查找是否有已经存在的相同账号
        //新用户
        if (!userInMongo) {
          const newUser = {
            user: userInfos[i].user,
            password: userInfos[i].password,
            name: userInfos[i].name,
            email: userInfos[i].email,
            tel: userInfos[i].tel,
            grade: userInfos[i].grade,
            classNo: userInfos[i].classNo, // class不能声明 所以用classNo代替一下
            major: userInfos[i].major
          }
          await userModel(newUser).save() //保存到数据库
          countAddUser++ // 添加成功+1
        } else {
          //账号已经存在
          notAddUser.push(userInfos[i])
        }
      }
      res.send({
        status: 0,
        statusInfo: {
          message: `${countAddUser}位用户注册成功 ${notAddUser.length}位用户注册失败账号已经存在`
        },
        data: {
          //注册成功的用户数量
          countAddUser,
          // 这里是没有注册成功的用户
          notAddUser
        }
      })
    } catch (err) {
      console.log('userControllers: 注册失败', err)
      res.send({
        status: 1,
        statusInfo: {
          message: `${countAddUser}位注册成功 ${countAddUser+1}开始注册失败`,
          type: 'MONGO_FINDONE_ERROR'
        }
      })
    }
  }

  //注册老师(单条)
  async addNewTeacher(req, res) {
    let { user, password = '123456', name, email = '', tel = '', grade, classNo, major = '' } = req.body //从post中获取上传的数据
    password = password || '123456'
    //对上传的数据进行判断,这里前端也要再判断一下再上传
    try {
      if (!user) {
        throw new Error('用户名参数错误')
      }
      if (!name) {
        throw new Error('姓名参数错误')
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo: {
          message: err.message,
          type: 'GET_WRONG_BODY'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)//密码使用password-hash模块加密
    try {
      const userInMongo = await userModel.findOne({ user: user }) //从数据库中查找是否有已经存在的相同账号
      //新用户
      if (!userInMongo) {
        const newUser = {
          user,
          password,
          name,
          email,
          tel,
          grade,
          classNo, // class不能声明 所以用classNo代替一下
          major,
          status: 8
        }
        await userModel(newUser).save() //保存到数据库
        res.send({
          status: 0,
          statusInfo: {
            message: '注册成功'
          }
        })
      } else {
        //账号已经存在
        res.send({
          status: 1,
          statusInfo: {
            message: '账号已经存在'
          }
        })
      }
    } catch (err) {
      console.log('userControllers: 注册失败', err)
      res.send({
        status: 1,
        statusInfo: {
          message: '注册失败',
          type: 'MONGO_FINDONE_ERROR'
        }
      })
    }
  }
  
  // 教师注册(多条)
  async addNewTeachers(req, res) {
    let userInfos = req.body //从post中获取上传的数据
    const length = userInfos.length
    //对上传的数据进行判断,这里前端也要再判断一下再上传
    try {
      for (let i = 0; i < length; i++) {
        if (!userInfos[i].user) {
          throw new Error(`第${i + 1}位用户名参数错误`)
        }
        if (!userInfos[i].password) {
          userInfos[i].password = '123456'
        }
        if (!userInfos[i].name) {
          throw new Error(`第${i + 1}位姓名参数错误`)
        }
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo: {
          message: err.message,
          type: 'GET_WRONG_BODY'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)//密码使用password-hash模块加密
    let notAddUser = []
    let countAddUser = 0
    try {
      for (let i = 0; i < length; i++) {
        const userInMongo = await userModel.findOne({ user: userInfos[i].user }) //从数据库中查找是否有已经存在的相同账号
        //新用户
        if (!userInMongo) {
          const newUser = {
            user: userInfos[i].user,
            password: userInfos[i].password,
            name: userInfos[i].name,
            email: userInfos[i].email,
            tel: userInfos[i].tel,
            grade: userInfos[i].grade,
            classNo: userInfos[i].classNo, // class不能声明 所以用classNo代替一下
            major: userInfos[i].major,
            status: 8
          }
          await userModel(newUser).save() //保存到数据库
          countAddUser++
        } else {
          //账号已经存在
          notAddUser.push(userInfos[i])
        }
      }
      res.send({
        status: 0,
        statusInfo: {
          message: `${countAddUser}位用户注册成功 ${notAddUser.length}位用户注册失败账号已经存在`
        },
        data: {
          notAddUser
        }
      })
    } catch (err) {
      console.log('userControllers: 注册失败', err)
      res.send({
        status: 1,
        statusInfo: {
          message: `${countAddUser}位注册成功 ${countAddUser + 1}开始注册失败`,
          type: 'MONGO_FINDONE_ERROR'
        }
      })
    }
  }

  //登陆
  async login(req, res) {
    const {user, password} = req.body  //body获取post上传的user和password
    try {
      if (!user){
        throw new Error('账号参数出错')
      } else if (!password) {
        throw new Error('密码参数出错')
      }
    } catch (err) {
      console.log('userControllers:login()', err.message)
      res.send({
        status: 1,
        statusInfo: {
          message: err.message,
          type: 'GET_ERROR_BODY'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)
    try {
      let userInMongo = await userModel.findOne({user: user}) //查询数据库是否存在
      if (!userInMongo) {
        res.send({
          status: 1,
          statusInfo: {
            message: '账号不存在'
          }
        })
      } else if (password !== userInMongo.password){ //密码错误
        res.send({
          status: 1,
          statusInfo: {
            type: 'ERROR_PASSWORD',
            message: '密码错误'
          }
        })
      } else { //成功
        // userInMongo.loginInCount++
        // userInMongo.save()
        delete userInMongo.password
        req.session.user = userInMongo //个人信息数据保存到session
        res.send({ 
          status: 0,
          statusInfo: {
            message: '登陆成功'
          },
          data: {
            _id: userInMongo._id, // 数据库中的_id
            grade: userInMongo.grade, // 年级
            class: userInMongo.class, // 班级
            name: userInMongo.name, // 姓名
            status: userInMongo.status, // 权限
            major: userInMongo.majorm, // 专业
            tel: userInMongo.tel //手机号
          }
        })
      }
    } catch (err) {
      console.log('登陆失败', err)
      res.send({
        status: 1,
        statusInfo: {
          message: '登陆失败',
          type: 'LOGIN_FAILED'
        }
      })
      return
    }
  }

  //登出功能
  //GET
  async logout(req, res) {
    req.session.destroy() //消除session 表示删除session成功
    res.send({
      status: 0,
    })
    // res.redirect('/login')
  }


  //(教师,学生)只修改自己的个人信息
  //PUT
  async putUsetInfo(req, res) {
    const userId = req.session.user._id //从session中获取用户_id
    let { email = '', tel = '' } = req.body //获取修改的内容
    if ( !userId ) {
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_SESSION',
          message: '获取session失败,请重新登陆'
        }
      })
      return
    }
    try {
      // 更新的内容
      const updateDate = {
        email,
        tel
      }
      await userModel.findOneAndUpdate({ _id: userId }, { $set: updateDate}) //修改信息保存到数据库
      res.send({
        status: 0,
        statusInfo: {
          message: '修改成功'
        }
      })
    } catch (err) {
      console.log('userControllers:putUserInfo', err.message)
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_PUTINFO',
          message: '修改个人信息失败'
        }
      })
    }
  }

  //(管理员,教师)修改学生user信息功能
  //PUT
  async teacherPutUsetInfo(req, res) {
    const userId = req.params.userId // 从params中获取params
    const { user = '', password = '', name = '', email = '', tel = '', grade = '', classNo = '', major = '' } = req.body //获取修改的内容
    if (!userId) {
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_SESSION',
          message: '获取session失败,请重新登陆'
        }
      })
      return
    }
    try {
      if (!user) {
        throw new Error('用户名参数错误')
      }
      if (!password) {
        throw new Error('密码参数错误')
      }
      const countUser = await userModel.count({_id: userId}) // 数据库中_id存在的总数
      if (Number(countUser) === 0) { // 没有_id的用户
        throw new Error('userId参数错误')
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo: {
          message: err.message,
          type: 'GET_WRONG_BODY'
        }
      })
      return
    }
    try {
      // 更新的内容
      const updateDate = {
        user,
        password,
        name,
        email,
        tel,
        grade,
        classNo,
        major
      }
      await userModel.findOneAndUpdate({ _id: userId }, { $set: updateDate }) //修改信息保存到数据库
      res.send({
        status: 0,
        statusInfo: {
          message: '修改信息成功'
        }
      })
    } catch (err) {
      console.log('userControllers:putUserInfo', err.message)
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_PUTINFO',
          message: '修改个人信息失败'
        }
      })
      return
    }
  }
  //修改密码(自己)
  //PUT
  async updatePSW(req, res) {
    const userId = req.session.user._id // 从session中获取session内容
    const password = req.body.password // 获取上传要修改的password
    if (!userId || userId != req.params.userId) {
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_USERID',
          message: 'userId错误'
        }
      })
      return
    }
    // const hashPassword = passwordHash.generate(password)//密码使用password-hash模块加密
    try {
      await userModel.findOneAndUpdate({ _id: userId }, {$set: {password: password}}) //修改密码
      res.send({
        status: 0,
        statusInfo: {
          message: '密码修改成功'
        }
      })
    } catch (err) {
      console.log('userControllers: updatePSW', err.message)
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_UPDATE',
          message: '更新失败'
        }
      })
    }
  }

  // get
  // 获取个人信息(自己)
  async getUserInfo(req, res) {
    const userId = req.session.user._id //获取要查询的_id
    
    if (!userId){
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_USERID',
          message: 'userId参数错误'
        }
      })
    }
    try {
      let userInfo = await userModel.findOne({_id: userId}) //从数据库获取个人信息
      delete userInfo.password // json中删除密码后再返回
      // const dataInfo = {
      //   _id: userInfo._id,
      //   user: userInfo.user,
      //   name: userInfo.name,
      // }
      res.send({
        status: 0,
        data: userInfo // 返回的信息
      })
    } catch (err) {
      console.log('userControllers: getUserInfo')
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_FINDONE',
          message: '获取信息失败'
        }
      })
    }
  }

  //get
  //查询学生信息(分页)
  async getUsersInfo(req, res) {
    let {condition = {}, skipto = 0, limit = 10, sortby = '-_id'} = req.body
    // console.log(skipto)
    condition.status = 1 // 查找学生
    try {
      const countUser = await userModel.count(condition) // 查找condition这个条件下的总数
      if (skipto > countUser) skipto = countUser //如果出现skip比总数据量大 就把skipto设置为countUser
      const usersInfo = await userModel.find(condition) // 查找数据
        .sort(sortby)  //排序
        .skip(Number(skipto)) // 从skipto开始返回
        .limit(Number(limit)) // 返回skipto开始的limit条数据
      res.send({
        status: 0,
        data: {
          countUser,
          usersInfo
        }
      })
    } catch (error) {
      console.log('usercontrollers: getUsersInfo')
      res.send({
        status: 0,
        statusInfo: {
          type: 'ERROR_FIND',
          message: '查找出错'
        }
      })
    }
  }

  //get
  //(管理员)查询教师信息
  async getTeachersInfo(req, res) {
    let { condition = {}, skipto = 0, limit = 10, sortby = '-_id' } = req.body
    condition.status = 8 // 查找教师
    try {
      const countUser = await userModel.count(condition) // 查找condition这个条件下的总数
      if (skipto > countUser) skipto = countUser //如果出现skip比总数据量大 就把skipto设置为countUser
      const teachersInfo = await userModel.find(condition) // 查找数据
        .sort(sortby)  //排序
        .skip(Number(skipto)) // 从哪条数据开始返回
        .limit(Number(limit)) // 返回skipto开始的limit条数据
      console.log(teachersInfo)
      res.send({
        status: 0,
        data: {
          countUser,
          teachersInfo
        }
      })
    } catch (error) {
      console.log('usercontrollers: getTeachersInfo')
      res.send({
        status: 0,
        statusInfo: {
          type: 'ERROR_FIND',
          message: '查找出错'
        }
      })
    }
  }


  

  //del
  //(教师)(管理员)删除学生信息
  async delUserInfo(req, res) {
    const userId = req.params.userId
    // console.log(userId)
    try {
      if (!userId) throw new Error('Id参数错误')
    } catch (error) {
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_USERID',
          message: error.message
        }
      })
      return
    }
    try {
      await userModel.deleteOne({_id: userId}) // 删除_id的学生信息
      res.send({
        status: 0,
      })
    } catch (error) {
      console.log('delUserInfo')
      res.send({
        status: 1,
        statusInfo: {
          type:'ERROR_DEL',
          message: error.message
        }
      })
    }
  }

}



export default new UserControllers()