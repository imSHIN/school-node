// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui' // 引入element
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store' // vuex
import axios from 'axios'
// import vueXlsxTable from 'vue-xlsx-table'
Vue.prototype.$http = axios
// Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(axios)
axios.defaults.baseURL = 'http://localhost:3000' // api地址
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

// Vue.use(vueXlsxTable, {
//   rABS: false
// }) // 浏览器的FileReader API 有两个方法可以读取本地文件 readAsBinaryString 和 readAsArrayBuffer, 默认rABS为false，也就是使用readAsArrayBuffer

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
// new Vue({
//   router,
//   store
// }).$mount('#app')
