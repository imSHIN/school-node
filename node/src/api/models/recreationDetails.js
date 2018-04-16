import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RecreationSchema = new Schema( {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String, required: true },
    
    morning: { type: Number, default: 0 },//早打卡 0~100
    evening: { type: Number, default: 0 },//晚打卡 0~100
    activities: [{
        id: { type: Number, required: true},
        actiName: String,//获奖名称
        level: String,   //获奖等级
        requireCerti: { type: Boolean, default: true},
        requiredInfo: { type: String, default: "待提交"}
    }],
    evidence: {
        id:  { type: Number, required: true },
        size: Number,//文件大小 KB为单位
        filename: String,//文件名称
        path: String //文件路径
    }
})

const RecreationDetails = mongoose.model('RecreationDetails', RecreationSchema)
export default RecreationDetails