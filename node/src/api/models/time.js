import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  year: { type: String, required: true },//年份
  firstStartDate: { type: Date, default: Date.now }, //第一次提交时间
  firstEndDate: { type: Date, default: Date.now }, //第一次结束时间
  secondStartDate: { type: Date, default: Date.now }, //第二次提交时间
  secondEndDate: { type: Date, default: Date.now }, //第二次结束时间
})


const Time = mongoose.model('Time', UserSchema)
export default Time