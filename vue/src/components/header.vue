<template>
  <div class="header">
    <div class="logo">奖学金申报系统</div>
    <div class="user-info">
      <!-- <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
              <img class="user-logo" src="../../../static/img/img.jpg">
              {{username}}
          </span>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loginout">退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import {getStore} from '../config/localStorage'
  import axios from 'axios'
  export default {
    data () {
      return {
      }
    },
    computed: {
      username () {
        const username = getStore('name') || this.name
        return username
      }
    },
    methods: {
      ...mapActions(['delUserInfo']),
      handleCommand (command) {
        if (command === 'loginout') {
          // localStorage.removeItem('ms_username')
          this.delUserInfo()
          axios.post('/signout')
            .then(response => {
              this.$router.push('/login')
            })
            .catch(error => {
              this.$router.push('/login')
              console.log(error)
            })
        }
      }
    }
  }
</script>
<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
  }
  .header .logo{
    float: left;
    width:250px;
    text-align: center;
  }
  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
  }
  .user-info .el-dropdown-link{
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
  }
  .user-info .user-logo{
    position: absolute;
    left:0;
    top:15px;
    width:40px;
    height:40px;
    border-radius: 50%;
  }
  .el-dropdown-menu__item{
    text-align: center;
  }
</style>
