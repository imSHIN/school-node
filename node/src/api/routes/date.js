import TimeControllers from '../controllers/timeControllers'
import express from 'express'
import { checkStatus } from '../middlewares'
const router = express.Router()


// 修改奖学金提交年份
router.post('/', checkStatus.checkNotStudent, TimeControllers.newDate)


export default router