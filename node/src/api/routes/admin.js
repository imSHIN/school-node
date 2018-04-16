import UserControllers from '../controllers/userControllers'
import express from 'express'
import { checkStatus } from '../middlewares'
const router = express.Router()


// 查询教师信息
router.post('/teachers', checkStatus.checkAdmin, UserControllers.getTeachersInfo)


export default router