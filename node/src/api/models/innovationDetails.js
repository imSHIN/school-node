import mongoose from 'mongoose'
const Schema = mongoose.Schema
//前端上传考试的属性名改成name
const InnovationDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // user表id
  user: { type: Schema.Types.ObjectId, ref: 'User' }, //指向user表
  //科技竞赛
  techCompetition: [{ 
    id: { type: Number, required: true },
    // id: { type: Number },
    name: { type: String},
    job: String,
    requireCerti: { type: Boolean, default: true },
    requiredInfo: { type: String, default: "待提交"}
  }],   
  //计算机专业认证类考试
  computerExam: [{ 
    id: { type: Number, required: true },
    name: String, 
    points: { type: Number, default: 0 } ,
    requireCerti: { type: Boolean, default: true },
    requiredInfo: { type: String, default: "待提交"}
  }],
  //英语专业类认证考试 以及英语四六级
  englishExam: [{
    id: { type: Number, required: true },
    // id: { type: Number },
    name: String, 
    points: { type:Number, default: 0},//通过加5分，参加加2分 如果名称为 英语4，6级则记录分数
    requireCerti: { type: Boolean, default: true },
    requiredInfo: { type: String, default: "待提交"}
  }],
  //其它专业类认证考试
  otherExam: [{
    id: { type: Number, required: true },
    name: String, 
    points: { type:Number, default: 0},//通过加1分，参加加0.5分
    requireCerti: { type: Boolean, default: true },
    requiredInfo: { type: String, default: "待提交" }
  }],
  //学术论文发表与专利
  academicPaper: [{
    id: { type: Number, required: true },
    name: { type: String },
    level: { type: String },
    requireCerti: { type: Boolean, default: true },
    requiredInfo: { type: String, default: "待提交" }
  }],
  //证明图片
  evidence: [{ 
    id:  { type: Number, required: true },
    size: String,
    filename: String,
    path: String //文件路径
  }]

})

const InnovationDetails = mongoose.model('InnovationDetails', InnovationDetailsSchema)
export default InnovationDetails

