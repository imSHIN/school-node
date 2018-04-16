import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SocialPracSchema = new Schema( {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: {type: String, required: true },
    //社会实践
    socailPracTeam: {type: Number, default: 0 },//社会实践队伍获奖等级
    teamJob: {type: Number, default: 0 },//队伍担任职务
    //社会服务
    provinObjVol: { type: Number, default: 0 },//省级项目优秀志愿者次数
    provinExceVol: { type: Number, default: 0 },//省级优秀志愿者次数
    scExceVol: { type: Number, default: 0 },//校级十佳志愿者次数
    scObjVol: { type: Number, default: 0 },//校级项目优秀志愿者

    evidence: {
        id:  { type: Number, required: true },
        size: Number,//文件大小 KB为单位
        filename: String,//文件名称
        path: String //文件路径
    }
})

const SocialPracDetails = mongoose.model('SocialPracDetails', SocialPracSchema)
export default SocialPracDetails