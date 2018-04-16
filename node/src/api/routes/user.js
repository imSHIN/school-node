import UserControllers from '../controllers/userControllers'
import ScoresControllers from '../controllers/scoresControllers'
import express from 'express'
import { checkLogin, checkStatus } from '../middlewares'
import FileControllers from '../controllers/fileControllers'
// const upload = require("../middlewares/multerUtil")
import upload from "../middlewares/multerUtil"
import InfoControllers from "../controllers/infoControllers"

const router = express.Router()
//post
//登陆
//必须:
//user: String, password: String
router.post('/', checkLogin.notLogin, UserControllers.login)

//学生注册
//上传数据:
//必须 user: string ,password: string ,name: string
//可选 email: string (不上传默认为空字符串)
router.post('/signup', UserControllers.addNewUser)

//获取用户信息
router.get('/', checkLogin.login, UserControllers.getUserInfo)

//获取用户信息
router.get('/:userId', checkLogin.login, UserControllers.getUserInfo)

//put
//修改个人信息
router.put('/', checkLogin.login, UserControllers.putUsetInfo)

//post
//登出
router.post('/signout', UserControllers.logout)

// 学生注册(多条) array数组上传
router.post('/signups', checkStatus.checkNotStudent, UserControllers.addNewUsers)

//put
//修改密码
router.put('/updatepwd/:userId', checkLogin.login, UserControllers.updatePSW)

//post
//身体素质分
router.post('/uploadPhysical/:userId', checkLogin.login, ScoresControllers.uploadPhysical)

//post
//智育分
router.post('/uploadGPA/:userId', checkLogin.login, ScoresControllers.uploadGPA)

//post
//创新创业
//router.post('/uploadInnovation/:userId', checkLogin.login, ScoresControllers.uploadInnovation)

//post
//德育分 自我评价 
router.post('/morality/uploadSelfAssessment/:userId', checkLogin.login, ScoresControllers.uploadSelfAssessment)

//post
//德育分 班级等级分 
router.post('/morality/uploadClassLevel/:userId', checkLogin.login, ScoresControllers.uploadClassLevel)

//post
//德育分 寝室分数 
router.post('/morality/uploadDormitory/:userId', checkLogin.login, ScoresControllers.uploadDormitory)

//post
//德育分 履行责任、服务奉献记实分 
router.post('/morality/uploadVolunteer/:userId', checkLogin.login, ScoresControllers.uploadVolunteer)

//post
//德育分 遵章守纪加减分
router.post('/morality/uploadObedience/:userId', checkLogin.login, ScoresControllers.uploadObedience)

//post
//创新创业能力 科技竞赛
// router.post('/innovation/uploadTechCompetition/:userId', checkLogin.login, ScoresControllers.uploadTechCompetition)

// post
// 创新创业能力 认证考试
router.post('/uploadInnovation/:userId', checkLogin.login, ScoresControllers.uploadInnovation)

//post
//上传创新创业证明图片
router.post('/innovation/uploadEvidence/:userId', checkLogin.login, upload.array("file"), FileControllers.uploadInnovationFile)

//post
//社会实践能力
router.post('/uploadSocialPractice/:userId', checkLogin.login, ScoresControllers.uploadSocialPractice)

//post
//上传社会实践能力证明
router.post('/socialPractice/uploadEvidence/:userId', checkLogin.login, upload.array("file"), FileControllers.uploadSocialPracFile)

//post
//社会工作能力
router.post('/uploadSocialWork/:userId', checkLogin.login, ScoresControllers.uploadSocialWork)

//post
//社会工作证明
router.post('/socialWork/uploadEvidence/:userId', checkLogin.login, upload.array("file"), FileControllers.uploadSocialWorkFile)

//post
//文体拓展素质
router.post('/uploadRecreation/:userId', checkLogin.login, ScoresControllers.uploadRecreation)

// post
// 文体素质拓展证明图片
router.post('/recreation/uploadEvidence/:userId', checkLogin.login, upload.array("file"), FileControllers.uploadRecreationFile)

//------------------------------获取信息-----------------------------------------

//get
//获取德育 智育 身体素质 分数
router.get('/getTentativeScore/:userId', checkLogin.login, InfoControllers.getTentativeScore)




// module.exports = router;
export default router