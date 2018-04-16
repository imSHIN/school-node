// import state from './state'
import {getStore} from '../config/localStorage'
export default {
  // 获得用户信息
  UserInfo (state) {
    if (getStore('_id') && !state.user._id) {
      state.user._id = getStore('_id')
      state.user.name = getStore('name')
      state.user.status = getStore('status')
      state.user.login = getStore('login')
    }
    return state.user
  },
  // 获取登陆状态
  UserLogin (state) {
    if (getStore('_id') && !state.user._id) {
      state.user._id = getStore('_id')
      state.user.name = getStore('name')
      state.user.status = getStore('status')
    }
    if (state.user._id) {
      return true
    } else {
      return false
    }
  },
  siderbarItem (state, getters) {
    if (getStore('_id') && !state.user._id) {
      state.user._id = getStore('_id')
      state.user.name = getStore('name')
      state.user.status = getStore('status')
    }
    const status = Number(getters.UserStatus)
    // console.log('siderbarItem', status)
    // console.log('siderbarItem', status === 9)
    if (status === 1) return state.sidebarForStu
    else if (status === 8) return state.sidebarForTeacher
    else if (status === 9) return state.sidebarForAdmin
    else return false
    // switch语句返回undefined 不知道什么bug
    // switch (status) {
    //   case 1:
    //     return state.sidebarForStu
    //   case 8:
    //     return state.siderbarForTeacher
    //   case 9:
    //     return state.siderbarForAdmin
    //   default:
    //     return false
    // }
  },
  // 获取权限status
  UserStatus (state) {
    // console.log('UserStatus', getStore('_id'))
    if (getStore('_id') && !state.user._id) {
      state.user._id = getStore('_id')
      state.user.name = getStore('name')
      state.user.status = getStore('status')
      // console.log('UserStatus', getStore('_id'))
    }
    return state.user.status
  },
  StudentScore (state) {
    if (getStore('_id') && !state.user._id) {
      state.user._id = getStore('_id')
      state.user.name = getStore('name')
      state.user.status = getStore('status')
    }
    return state.StudentScore
  }
}
