import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    user: {type:String, required: true},//账号
    password: { type: String, required: true }, //密码
    name: String, //姓名
    tel: {type: String}, //电话
    grade: {type: Number}, //入学年份 只能数字
    classNo: { type: String}, //班级
    major: { type: String }, //专业
    status: { type: Number, default: 1 }, //权限 1:学生 9:管理员 8:教师
    createDate: { type: Date, default: Date.now }, //账号创建时间 默认就是系统当前时间
    updateDate: { type: Date, default: Date.now }, //账号更新时间
    lastLoginDate: { type: Date}, //最后一次登陆日期
    loginCount: { type: Number, default: 0}, //登陆次数
    email : String  //邮箱
})


UserSchema.statics.findByCondition = (condition, skip, limit, sortby = '_id') => {
    return this
        .find(condition)
        .sort(sortby)
        .skip(skip)
        .limit(limit)
}

const User = mongoose.model('User', UserSchema)
// module.exports = UserSchema;
export default User