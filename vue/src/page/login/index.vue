<template>
  <div class="login-wrap">
    <div class="ms-title">奖学金申报系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;">管理员账号:admin 密码:111</p>
        <p style="font-size:12px;line-height:30px;color:#999;">教师账号:teacher 密码:111</p>
        <p style="font-size:12px;line-height:30px;color:#999;">学生账号:stu 密码:111</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  // import {setStore} from '@/config/localStorage'
  import axios from 'axios'
  import { mapActions } from 'vuex'
  export default {
    data: function () {
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['setUserInfo']),
      submitForm (formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            // localStorage.setItem('ms_username', self.ruleForm.username)
            // const res = userLogin({userId: self.ruleForm.username, password: self.ruleForm.password})
            // const { userId, password } = data
            axios.post('/user', {
              user: self.ruleForm.username,
              password: self.ruleForm.password
            })
              .then(response => {
                // console.log(JSON.stringify(response))
                if (response.data.status === 1 || response.data.status === 2) {
                  this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '错误', {
                    confirmButtonText: '确定'
                  })
                  return
                } else if (response.data.status !== 0) {
                  this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '发生未知错误', '错误', {
                    confirmButtonText: '确定'
                  })
                  return
                }
                const {_id = '', status = '', name = ''} = response.data.data
                // localStorage.setItem('_id', _id)
                // localStorage.setItem('name', name)
                // localStorage.setItem('status', status)
                this.setUserInfo({
                  _id,
                  status,
                  name
                })
                if (status === 1) {
                  this.$router.push('home')
                } else if (status === 9) {
                  this.$router.push('admin/students')
                } else if (status === 8) {
                  this.$router.push('teacher')
                }
              })
              .catch(error => {
                console.log('fail' + error)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>