import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import home from '@/components/home'
import userInfo from '@/page/userInfo'
import login from '@/page/login'
import adminStuInfo from '@/page/admin/studentInfo.vue'
import adminTeacherInfo from '@/page/admin/teacherInfo.vue'
import uploadstu from '@/page/admin/uploadstu.vue'
import uploadteah from '@/page/admin/uploadteah.vue'

// const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')

// Student page
import updataPhysical from '@/page/student/updataPhysical.vue'
import updataGPA from '@/page/student/updataGPA.vue'
import updataMorality from '@/page/student/updataMorality.vue'
import updataSocialPracAbili from '@/page/student/updataSocialPracAbili.vue'
import updataInnovation from '@/page/student/updataInnovation.vue'
import updataSocialWork from '@/page/student/updataSocialWork.vue'
import updataLiteAndSpo from '@/page/student/updataLiteAndSpo.vue'
// teacher page
import setTime from '@/page/teacher/setTime.vue'
import examine from '@/page/teacher/examine.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: login // 登陆界面
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: '/',
          component: userInfo // 个人信息
        },
        {
          path: 'updataPhysical',
          component: updataPhysical // 体育成绩提交界面
        },
        {
          path: 'updataGPA',
          component: updataGPA   // 智育素质提交
        },
        {
          path: 'updataMorality', // 德育素质
          component: updataMorality
        },
        {
          path: 'updataSocialPracAbili',   // 社会实践能力
          component: updataSocialPracAbili
        },
        {
          path: 'updataInnovation',    // 创新创业能力
          component: updataInnovation
        },
        {
          path: 'updataSocialWork',   // 社会工作
          component: updataSocialWork
        },
        {
          path: 'updataLiteAndSpo',  // 文体拓展
          component: updataLiteAndSpo
        }
      ]
    },
    {
      path: '/teacher',
      component: home,
      children: [
        {
          path: '/',
          component: adminStuInfo // 个人信息
        },
        {
          path: 'students',
          component: adminStuInfo // 所有学生信息
        },
        {
          path: 'uploadstu', // 批量上传学生账号
          component: uploadstu
        },
        {
          path: 'setTime', // 设置申报时间
          component: setTime
        },
        {
          path: 'examine', // 设置申报时间
          component: examine
        }
      ]
    },
    {
      path: '/admin',
      component: home,
      children: [
        {
          path: '/',
          component: adminStuInfo
        },
        {
          path: 'students', // 所有学生信息
          component: adminStuInfo
        },
        {
          path: 'teachers', // 所有老师信息
          component: adminTeacherInfo
        },
        {
          path: 'uploadteah', // 批量上传老师账号
          component: uploadteah
        },
        {
          path: 'uploadstu', // 批量上传学生账号
          component: uploadstu
        }
      ]
    }
  ]
})
