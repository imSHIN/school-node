import mongoose from "mongoose"
const Schema = mongoose.Schema

const SocialWorkDetailsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    userId: { type: String, required: true},
    //社会工作能力
    workList: [{
        id: { type: Number, required: true },//唯一标识
        teamName: String,//学生团体名称
        teamJob: String,//担任职务
        workTime: { type: Number, default: 0},//工作时间   /年
        requireCerti: { type: Boolean, default: true },//是否需要提供证明
        requiredInfo: { type: String, default: "待提交" },//是否已经提供证明
        workPerFirst: { type: Number, default: 0},//第一学期工作业绩分
        workPerSecond: { type: Number, default: 0},//第二学期工作业绩分
        teamPrize: { type: String, default:"无"}
    }],
    titleList: [{
        id: { type: Number, required: true },
        titleName: String,
        requireCerti: { type: Boolean, default: true },
        requiredInfo: { type: String, default: "待提交" }
    }],
    //保存文件信息
    evidence: {
        id:  { type: Number, required: true },
        size: Number,//文件大小 KB为单位
        filename: String,//文件名称
        path: String //文件路径
    }

})

const SocialWorkDetails = mongoose.model("SocialWorkDetails", SocialWorkDetailsSchema)
export default SocialWorkDetails