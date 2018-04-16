import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FinalScoresSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // user表id
  user: { type: Schema.Types.ObjectId, ref: 'User' }, //指向user表
  personalBasicQuality: { type: Number, default: 0 }, // 个人基础素质
  qualityOfMoralEducation: { type: Number, default: 0 }, // 德育素质
  assessment: { type: Number, default: 0 }, // 基本评定
  addOrSub: { type: Number, default: 0 }, // 记实加减
  classLevel: { type: Number, default: 0 }, // 班级等级
  bedroom: { type: Number, default: 0 , min: 0, max: 14 }, // 寝室记实
  serviceDedication: { type: Number, default: 0 , min: 0, max: 8 }, // 服务奉献
  obeyObedience: { type: Number, default: 0 }, //遵章守纪 
  intellectualQualityEducation: { type: Number, default: 0 }, // 智育素质
  // 智育排名根据智育素质自动排名
  gradePointAverage: { type: Number, default: 0 }, //平均绩点
  physicalFitness: { type: Number, default: 0 }, //身体素质
  gradeIsSubmit: { type: Boolean, default: false},//平均绩点是否已提交
  phyIsSubmit: { type: Boolean, default: false },//身体素质是否提交
  personalDevelopmentQuality: { type: Number, default: 0 }, //个人发展素质
  innovation: { type: Number, default: 0 }, // 创新创业
  technologyCompetition: { type: Number, default: 0 },// 科技竞赛
  certificationExam: { type: Number, default: 0 },// 认证考试
  academicPaper: { type: Number, default: 0 }, // 学术论文
  socialPractice: { type: Number, default: 0 }, //社会实践
  socialWork: { type: Number, default: 0 }, //社会工作
  styleDevelopment: { type: Number, default: 0 }, // 文体拓展
  selfStudy: { type: Number, default: 0 }, //早晚自习
  newsRelease: { type: Number, default: 0 },// 新闻稿件
  activities: { type: Number, default: 0 }, //各类活动
  sportingEvent: { type: Number, default: 0 },// 体育赛事
  comprehensiveQuality: { type: Number, default: 0 },// 综合素质
  // 综合排名 根据综合素质自动排名
})

const FinalScores = mongoose.model('FinalScores', FinalScoresSchema)
export default FinalScores