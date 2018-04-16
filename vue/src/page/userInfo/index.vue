<template>
  <div class="stuinfo">
    <div class="info info-border">
      <div class="info-top">
        <span><i class="el-icon-setting"></i> 个人信息 </span>
        <el-button
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="haddleupdateclick">修改信息</el-button>
      </div>
      
      <div class="info-item">姓名: {{userInfo.name}}</div>
      <div class="info-item">学号: {{userInfo.user}}</div>
      <div class="info-item">入学年份: {{userInfo.grade}}</div>
      <div class="info-item">班级: {{userInfo.classNo}}</div>
      <div class="info-item">专业: {{userInfo.major}}</div>
      <div class="info-item">手机: {{userInfo.tel}}</div>
    </div>

    <div class="todo info-border">
      <span><i class="el-icon-tickets"></i> 代提交内容</span>
    </div>

    <div class="result info-border">
      <span><i class="el-icon-circle-check-outline"></i> 预得分查看</span>
      <el-button type="primary"  @click="getScore"> 更新数据</el-button>
      <el-table
        :data="resultData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="得分项">
        </el-table-column>
        <el-table-column
          prop="score"
          label="得分">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="学生信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input style="width:70%;" v-model="form.tel" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="haddleupdate()">保存修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    watch: {
      '$route': function (route) {
        var query = route.query
        this.page = query.page
      }
    },
    computed: {
      ...mapGetters({user: 'UserInfo'})
    },
    methods: {
      haddleupdateclick () {
        this.dialogFormVisible = true // 显示dialog框
        const {tel = ''} = this.userInfo
        this.form = {
          tel
        }
      },
      haddleupdate () {
        this.$http.put('/user', this.form)
          .then(response => {
            this.loading = false
            if (response.data.status === 1 || response.data.status === 2) {
              this.$alert(response.data.statusInfo.message || '错误', {
                confirmButtonText: '确定'
              })
              return
            } else if (response.data.status !== 0) {
              this.$alert(response.data.statusInfo.message || '发生未知错误', '错误', {
                confirmButtonText: '确定'
              })
              return
            }
            this.getUserInfo()
            this.dialogFormVisible = false // 关闭dialog框
            this.$message({
              message: '修改操作完成',
              type: 'success'
            })
          })
          .catch(error => {
            this.loading = false
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      },
      getUserInfo () {
        this.$http.get('/user')
          .then(response => {
            this.loading = false
            if (response.data.status === 1 || response.data.status === 2) {
              this.$alert(response.data.statusInfo.message || '错误', {
                confirmButtonText: '确定'
              })
              return
            } else if (response.data.status !== 0) {
              this.$alert(response.data.statusInfo.message || '发生未知错误', '错误', {
                confirmButtonText: '确定'
              })
              return
            }
            const {major = '', classNo = '', grade = '', tel = '', user = '', name = ''} = response.data.data
            this.userInfo = {
              major,
              classNo,
              grade,
              tel,
              user,
              name
            }
          })
          .catch(error => {
            this.loading = false
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      },
      getScore () {
        this.$http.get('/user/getTentativeScore/' + this.user._id)
          .then(response => {
            if (response.data.status === 1 || response.data.status === 2) {
              this.$alert(response.data.statusInfo.message || '错误', {
                confirmButtonText: '确定'
              })
              return
            } else if (response.data.status !== 0) {
              this.$alert(response.data.statusInfo.message || '发生未知错误', '错误', {
                confirmButtonText: '确定'
              })
              return
            }
            this.resultData = response.data.scoreItems
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success'
            })
          })
          .catch(error => {
            // this.loading = false
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      }
    },
    data () {
      return {
        userInfo: {
          name: '',
          user: '',
          major: '',
          grade: '',
          classNo: '',
          tel: ''
        },
        form: {
          tel: ''
        },
        resultData: [],
        dialogFormVisible: false, // 控制dialog的显示
        formLabelWidth: '50px' // dialog框大小
      }
    },
    created () {
      this.getUserInfo()
      this.getScore()
    }
  }
</script>

<style scoped>
.stuinfo{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.info-border{
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  padding: 20px;
  margin-bottom: 30px;
}
.info-border:hover{
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
}
.info{
  width: 43%;
  /* height: 100px; */
}
.info-top{
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
}
.info-item{
  margin-top: 10px;
}
.todo{
  width: 43%;
  height: 100px;
}
/* @media (min-width: 850px) and (max-width: 1188px) {
  .info{
    width: 40%;
  }
  .todo{
    width: 40%;
    height: 100px;
  }
} */
@media (max-width: 1000px) {
  .info-top{
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .info-top span{
    margin: 0 30px 10px 0;
  }
  .info{
    width: 100%;
    /* height: 100px; */
  }
  .todo{
    width: 100%;
    height: 100px;
  }
}
.result{
  width: 100%;
  /* height: 100px; */
}
</style>