<template>
  <section>
    <section class="top">
      <el-button
        class="addOneBtm"
        size="mini"
        type="primary"
        @click="handleAddOne()">添加</el-button>
        <el-input placeholder="请输入查询内容" v-model="search.content" class="input-with-select" style="width:350px">
          <el-select v-model="search.title" slot="prepend" placeholder="请选择" style="width:100px">
            <el-option label="无" value="none"></el-option>
            <el-option label="账号" value="user"></el-option>
            <el-option label="姓名" value="name"></el-option>
            <el-option label="密码" value="password"></el-option>
            <el-option label="手机" value="tel"></el-option>
            <!-- <el-option label="年级" value="grade"></el-option>
            <el-option label="班级" value="classNo"></el-option>
            <el-option label="专业" value="major"></el-option> -->
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch(search.title, search.content)"></el-button>
        </el-input>
    </section>
    <el-table
    :data="studentData"
    style="width: 100%">
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="user"
      label="账号">
    </el-table-column>
    <el-table-column
      prop="password"
      label="密码">
    </el-table-column>
    <el-table-column
      prop="tel"
      label="手机">
    </el-table-column>
    <!-- <el-table-column
      prop="grade"
      label="年级">
    </el-table-column>
    <el-table-column
      prop="classNo"
      label="班级">
    </el-table-column>
    <el-table-column
      prop="major"
      label="专业">
    </el-table-column> -->
    <el-table-column
      label="操作">
    <template slot-scope="scope">
      <el-button
        size="mini"
        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
      <el-button
        size="mini"
        type="danger"
        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
    </template>
    </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>

    <el-dialog title="教师信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.tel" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="form.grade" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="form.classNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="form.major" auto-complete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogUpdate()">保存修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="教师信息" :visible.sync="dialogAddVisible">
      <el-form :model="add" :rules="rules">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="add.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="user">
          <el-input v-model="add.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="add.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="add.tel" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="add.grade" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="add.classNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="add.major" auto-complete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAdd()">添 加</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
  import axios from 'axios'
  export default {
    methods: {
      // 分页跳转
      handleCurrentChange (val) {
        console.log(val)
        this.getStudentsInfo(this.condition, this.currentPage * 10 - 10, this.limit, this.sortby)
      },
      // 搜索按钮
      handleSearch (title = '', content = '') {
        this.condition = {}
        if (!content) {
          this.initializeSearch()
          this.getStudentsInfo({}, this.currentPage * 10 - 10, this.limit, this.sortby)
          return
        }
        if (title === 'user') {
          this.condition.user = content
        } else if (title === 'name') {
          this.condition.name = content
        } else if (title === 'password') {
          this.condition.password = content
        } else if (title === 'tel') {
          this.condition.tel = content
        } else if (title === 'grade') {
          this.condition.grade = content
        } else if (title === 'classNo') {
          this.condition.classNo = content
        } else if (title === 'major') {
          this.condition.major = content
        }
        this.initializeSearch()
        this.getStudentsInfo(this.condition, this.skipto, this.limit, this.sortby)
      },
      // 点击添加一条用户信息
      handleAddOne () {
        this.add = {
          major: '',
          classNo: '',
          grade: '',
          tel: '',
          password: '',
          user: '',
          name: ''
        }
        this.dialogAddVisible = true
      },
      // 点击添加一条教师信息dialog里的添加按钮
      dialogAdd () {
        axios.post('/teacher/signup', {
          user: this.add.user,
          password: this.add.password,
          name: this.add.name,
          // email: this.add.email
          tel: this.add.tel,
          grade: this.add.grade,
          classNo: this.add.classNo,
          major: this.add.major
        })
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
            this.dialogAddVisible = false
            this.search = { // 搜索参数
              title: '',
              content: ''
            }
            this.condition = {}
            this.initializeSearch()
            this.getStudentsInfo()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
          .catch(error => {
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      },
      // 点击编辑
      handleEdit (index, rowInfo) {
        this.dialogFormVisible = true // 显示dialog框
        // console.log(index, rowInfo)
        const {major = '', classNo = '', grade = '', tel = '', password = '', user = '', name = '', _id = ''} = rowInfo
        this.form = {
          major,
          classNo,
          grade,
          tel,
          password,
          user,
          name,
          _id
        }
      },
      // 点击删除
      handleDelete (index, rowInfo) {
        // console.log(index, rowInfo)
        this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 点击确定
          axios.delete('/teacher/deluser/' + rowInfo._id)
            .then(response => {
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
              this.getStudentsInfo(this.condition, this.currentPage * 10 - 10, this.limit, this.sortby)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(error => {
              console.log('fail' + error)
              this.$notify.error({
                title: '错误',
                message: '网络连接错误,请检查网络状态或联系管理员.'
              })
            })
        }).catch(() => { // 点击取消后事件
        })
      },
      // 点击保存修改信息
      dialogUpdate () {
        // console.log('tade_id')
        this.$message('正在提交学生信息修改操作')
        // put提交
        axios.put('/teacher/updatestudent/' + this.form._id, this.form)
          .then(response => {
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
            this.getStudentsInfo(this.condition, this.currentPage * 10 - 10, this.limit, this.sortby) // 提交成功重新加载信息
            this.dialogFormVisible = false // 关闭dialogu
            this.$message({
              message: '学生信息修改操作完成',
              type: 'success'
            })
          })
          .catch(error => {
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      },
      // 从服务器获得所有学生信息
      getStudentsInfo (condition = {}, skipto = 0, limit = 10, sortby = '-_id') {
        axios.post('/admin/teachers', {
          condition,
          skipto,
          limit,
          sortby
        })
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
            this.studentData = response.data.data.teachersInfo || undefined // 把得到的数据返回给studentData给表格显示
            this.totalPage = response.data.data.countUser || 0
          })
          .catch(error => {
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
      },
      // 初始化分页参数
      initializeSearch () {
        this.totalPage = 0
        this.currentPage = 1
        this.skipto = 0 // 翻页参数
        this.limit = 10 // 翻页参数
        this.sortby = '-_id' // 排序参数
      }
    },
    data () {
      return {
        studentData: [], // 后台返回的信息用数组保存
        form: { // dialog框参数
          major: '',
          classNo: '',
          grade: '',
          tel: '',
          password: '',
          user: '',
          name: '',
          _id: ''
        },
        add: { // 添加用户dialog框参数
          major: '',
          classNo: '',
          grade: '',
          tel: '',
          password: '',
          user: '',
          name: ''
        },
        dialogFormVisible: false, // 控制dialog的显示
        dialogAddVisible: false, // 控制添加用户的dialog的显示
        formLabelWidth: '120px', // dialog框大小
        condition: {}, // 筛选参数
        skipto: 0, // 翻页参数
        limit: 10, // 翻页参数
        currentPage: 1, // 当前页数
        totalPage: 0, // 总共有多少条学生信息
        sortby: '-_id', // 排序参数
        search: { // 搜索参数
          title: '',
          content: ''
        },
        rules: { // 提交规则
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '请输入账号(学号)', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    created () {
      this.studentData = this.getStudentsInfo() // 页面渲染成功调用函数从数据库获取信息
    }
  }
</script>

<style scoped>
.top{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.addOneBtm{
}
.pagination{
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
}
</style>
