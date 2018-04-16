import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MoralityDetailsSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // user表id
    user: { type: Schema.Types.ObjectId, ref: 'User' }, //指向user表

    selfAssessment: {type: Array, default: [0, 0, 0, 0, 0, 0, 0, 0, 0]},//自我评价
    selfIsSubmit : { type: Boolean, default: false },
    //寝室纪实分 （满分14分）
    dormitory: {
        dormitoryWeek: { type: Number, default: 0, min: 0, max: 100},//寝室日常考核基本分
        dormitoryRadio: { type: Number, default: 0 },//文明寝室加分项
        dormitoryPraiseNum: { type: Number, default: 0 },//寝室表扬次数
        dormitoryDisciplineNum: { type: Number, default: 0 },//寝室违纪次数
        info: { type: String },
        certi: { type: Boolean, default: true},
    },
    dormitoryIsSubmit: { type: Boolean, default: false },
    //班级等级分 11 12 14分
    // classLevel: { type: Number, default: 0},
    classIsSubmit: { type: Boolean, default: false },
    classLevel: {
        score: { type: Number },
        certi: { type: Boolean, default: true },
        info: { type: String }
    },

    //履行责任、服务奉献记实分（满分8分）
    // goodDeedSc: { type:Number, default: 0},     //校级及以上好人好事次数
    // goodDeedCo: { type: Number, default: 0},    //院级好人好事
    // volunteer: { type: Number, default: 0},     //志愿者工时
    // volunCountry: { type: Number, default: 0},  //参加过志愿者国家级活动的次数
    // volunProvince: { type: Number, default: 0},  //参加过志愿者省、市级活动的次数
    deedIsSubmit: { type: Boolean, default: false },
    volunteer: {
        goodDeed: [{
            id: { type: Number, required: true },
            name: { type: String },
            rank: { type: String },
            score: { type: Number }
        }],
        volunteerIn: { type: Number, default: 0},
        volunteerOut: [{
            id: { type: Number , required: true },
            name: { type: String },
            rank: { type: String },
            time: { type: Number },
            score: { type: Number }
        }],
        volunCountry: { type: Number, default: 0},  //参加过志愿者国家级活动的次数
        volunProvince: { type: Number, default: 0},  //参加过志愿者省、市级活动的次数
        
    },

    //遵章守纪加减分
    //违纪处分
    obey: {
        bad: {
            probation: { type: Number, default: 0},//留校察看次数
            demerit: { type: Number, default: 0},//记过处分次数
            seriousAdmonish: { type: Number, default: 0},//严重警告次数
            admonish: { type: Number, default: 0},//警告次数
            //通报批评
            criticismSc: { type: Number, default: 0},//校级通报批评次数
            criticismCo: { type: Number, default: 0},//院级通报批评次数
            //通报表扬
            praiseSc: { type: Number, default: 0},//校级通报表扬次数
            praiseCo: { type: Number, default: 0},//院级通报表扬次数
            info: { type: String },
            certi: { type: Boolean, default: true }
        },
        good: {
            praise: [{
                id: { type: Number , required: true },
                name: { type: String },
                rank: { type: String },
                score: { type: Number }
            }]
        }
    },
    obedienceIsSubmit: { type: Boolean, default: false },
    //证明图片
    evidence: [{ 
        id: { type: Number, required: true },
        size: String,
        filename: String,
        path: String //文件路径
    }]
})

const MoralityDetails = mongoose.model('MoralityDetails', MoralityDetailsSchema)
export default MoralityDetails