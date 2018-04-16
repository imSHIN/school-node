import UserControllers from '../controllers/userControllers'
import express from 'express'
import { checkStatus } from '../middlewares'
import TimeControllers from "../controllers/timeControllers"
import InfoControllers from "../controllers/infoControllers"
const router = express.Router()


// 查询学生信息
router.post('/students', checkStatus.checkNotStudent, UserControllers.getUsersInfo)

//教师注册(单条)
router.post('/signup', UserControllers.addNewTeacher)

// 教师注册(多条) array数组上传
router.post('/signups', checkStatus.checkNotStudent, UserControllers.addNewTeachers)

//修改学生信息
router.put('/updatestudent/:userId', checkStatus.checkNotStudent, UserControllers.teacherPutUsetInfo)

//删除学生信息
router.delete('/deluser/:userId', checkStatus.checkNotStudent, UserControllers.delUserInfo)

//上传申报时间选择界面
router.post('/updateTime', checkStatus.checkNotStudent, TimeControllers.newDate)

//返回学生提交情况
router.post('/getStuUploadInfo', checkStatus.checkNotStudent, InfoControllers.getStuUploadInfo)

// module.exports = router;
export default router