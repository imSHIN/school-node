import timeModel from '../models/time'
import moment from 'moment'

class TimeControllers {
  constructor() {
    this.canSubmit = this.canSubmit.bind(this)
    this.newDate = this.newDate.bind(this)
  }

  // 获取数据库年份
  async getYear() {
    try {
      const dateinfo = await timeModel.findOne()
      return dateinfo.year
    } catch (error) {
      return
    }
  }

  // 获取数据库日期
  // 由于时区问题,取出来需要加8小时 使用moment自动格式化日期格式 不使用moment 时间将少8小时
  async getDate() {
    try {
      const dateinfo = await timeModel.findOne()
      const firstStartDate = moment(dateinfo.firstStartDate).format('YYYY-MM-DD HH:mm')
      const firstEndDate = moment(dateinfo.firstEndDate).format('YYYY-MM-DD HH:mm')
      const secondEndDate = moment(dateinfo.secondEndDate).format('YYYY-MM-DD HH:mm')
      const secondStartDate = moment(dateinfo.secondStartDate).format('YYYY-MM-DD HH:mm')
      return {
        firstStartDate,
        firstEndDate,
        secondStartDate,
        secondEndDate
      }
    } catch (err) {
      return
    }
  }

  // 判断是否可以提交
  async canSubmit() {
    const dateinfo = await this.getDate()
    if (dateinfo) {
      // 使用moment比较时间
      return moment().isBetween(dateinfo.firstStartDate, dateinfo.firstEndDate) ||
        moment().isBetween(dateinfo.secondStartDate, dateinfo.secondEndDate)
    } else {
      throw new Error('获取日期失败')
    } 
  }

  //修改当前进行的年份(教师) 使用moment模块
  //POST
  // 年份格式 'YYYY' 比如'2018'
  // 日期格式 'YYYY-MM-DD HH:mm' '2018-01-01 12:12'
  async newDate(req, res) {
    let { year = '', firstStartDate = '', secondEndDate = '', secondStartDate = '', firstEndDate = '' } = req.body //获取修改的内容
    try {
      if (!moment(year, 'YYYY').isValid()) {
        throw new Error('年份参数错误')
      }
      if (!moment(firstStartDate, 'YYYY-MM-DD HH:mm').isValid()
        || !moment(secondEndDate, 'YYYY-MM-DD HH:mm').isValid()
        || !moment(secondStartDate, 'YYYY-MM-DD HH:mm').isValid()
        || !moment(firstEndDate, 'YYYY-MM-DD HH:mm').isValid()) {
        throw new Error('起始或结束日期参数错误')
      }
    } catch (err) {
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_BODY',
          message: err.message
        }
      })
      return
    }
    try {
      // 更新的内容
      const updateData = {
        year,
        firstStartDate,
        firstEndDate,
        secondStartDate,
        secondEndDate
      }
      const time = await timeModel.findOneAndUpdate({}, { $set: updateData })
      if (!time) {
        await timeModel(updateData).save()
      }
      res.send({
        status: 0,
        statusInfo: {
          message: '修改成功',
        }
      })
    } catch (err) {
      console.log('timeControllers:newDate', err.message)
      res.send({
        status: 1,
        statusInfo: {
          type: 'ERROR_PUTINFO',
          message: '修改失败'
        }
      })
    }
  }
}

export default new TimeControllers()