import express, { Router } from 'express'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
const MongoStore = ConnectMongo(session)
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
// import winston from 'winston'
// import expressWinston from 'express-winston'
//全局配置文件
//const config = require('./config.js')
import config from './config'
import routes from './api/routes'

// import cors from 'cors'

const app = express()

mongoose.Promise = global.Promise
const db = mongoose.connection.openUri(config.dbconfig.mongodb)
console.log('正在连接mongo数据库...', config.dbconfig.mongodb)
db.once('open', () => console.log('mongo 连接成功!'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称，默认为 connect.sid
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.dbconfig.mongodb// mongodb 地址
  })
}))
//express-formidable处理文件上传
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: path.join(__dirname, '/public/images'),
//   multiples: true, // req.files to be arrays of files 
//   keepExtensions: true// 保留后缀
//   })
// )

//routes
//设置跨域访问
// app.use(cors({
//   origin: ['http://localhost:3000'],
//   // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // enable set cookie
// }))
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true') // 解决跨域问题
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080') // 因为跨域问题 所以要加上指定的地址
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})
routes(app) //正常routes
// app.use(function (err, req, res, next) {
//   console.log(req)
//   next()
// })
// 简单的错误处理
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// // error handlers

// // development error handler
// // will print stacktraceß
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res) {
//     res.status(err.status || 500)
//     res.render('error', {
//       message: err.message,
//       error: err
//     })
//   })
// }

app.listen(config.nodePort, () => console.log('sever start on ' + config.nodePort) ) 

export default  app
