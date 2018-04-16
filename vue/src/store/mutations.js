import { setStore, removeStore } from '../config/localStorage'
const SET_USERINFO = 'SET_USERINFO'
const DEL_USERINFO = 'DEL_USERINFO'

export default {
  // 登陆成功设置用户信息
  [SET_USERINFO] (state, userInfo) {
    const {_id = '', name = '', status = 0} = userInfo
    state.user._id = _id
    state.user.name = name
    state.user.status = status
    setStore('_id', _id)
    setStore('name', name)
    setStore('status', status)
  },

  // 退出登陆 删除用户相关信息
  [DEL_USERINFO] (state) {
    state.user = {_id: '', name: '', status: 0}
    removeStore('user')
  }
}
