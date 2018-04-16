<template>
  <section>
    <div class="top" v-loading.fullscreen.lock="loading">
      <el-button
        class="addOneBtm"
        size="mini"
        type="primary"
        @click="handleAddOne">添加单条数据</el-button>
        <el-button
        class="addOneBtm"
        size="mini"
        type="primary"
        @click="handleUploadBtnClick">上传excel文件</el-button>
        <el-button
        class="addOneBtm"
        size="mini"
        type="primary"
        @click="handleAdd">确认上传所有学生账号</el-button>
        <input id="upload-input" type="file" :accept="accept" style="display:none;" @change="handkeFileChange">
    </div>
        <el-collapse accordion style="margin-top:20px;">
    <el-collapse-item>
      <template slot="title">
        批量上传账号注意事项 <i class="header-icon el-icon-info"></i>
      </template>
      <div>EXCEL标题须用英文 例子如下:</div>
      <el-table
        :data="example"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="name">
        </el-table-column>
        <el-table-column
          prop="user"
          label="user">
        </el-table-column>
        <el-table-column
          prop="password"
          label="password">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="tel">
        </el-table-column>
        <el-table-column
          prop="grade"
          label="grade">
        </el-table-column>
        <el-table-column
          prop="classNo"
          label="classNo">
        </el-table-column>
        <el-table-column
          prop="major"
          label="major">
        </el-table-column>
      </el-table>
      <div>1.name:姓名 必须所有人都要有name参数</div>
      <div>2.user:账号(学号) 必须所有人都要有user参数并且和数据库中的都不同</div>
      <div>3.password:密码 可以不设置,空的密码默认123456</div>
      <div>4.tel:电话 选填</div>
      <div>5.grade:年级 为了以后好分类筛选建议填上</div>
      <div>6.classNo:班级 为了以后好分类筛选建议填上</div>
      <div>7.major:专业 为了以后好分类筛选建议填上</div>
    </el-collapse-item>
    </el-collapse>
    <el-table
    :data="tableData.body"
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
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
    <el-table-column
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
    </el-table-column>
    <el-table-column
      label="操作"
      width="180">
    <template slot-scope="scope">
      <el-button
        size="mini"
        @click="handleEdit(scope.$index, scope.row, scope.store)">编辑</el-button>
      <el-button
        size="mini"
        type="danger"
        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
    </template>
    </el-table-column>
    </el-table>

    <el-dialog title="学生信息" :visible.sync="dialogFormVisible">
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
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="form.grade" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="form.classNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="form.major" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogUpdate()">保存修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="学生信息" :visible.sync="dialogAddVisible">
      <el-form :model="add" :rules="rules">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="add.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="user">
          <el-input v-model="add.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="add.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="add.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="add.grade" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="add.classNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="add.major" auto-complete="off"></el-input>
        </el-form-item>
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
  import XLSX from 'xlsx'
  export default {
    methods: {
      // 上传所有数据
      handleAdd () {
        this.loading = true // 加载loading动画
        // 先判断是不是空的数组
        if (Object.keys(this.tableData.body).length === 0) {
          this.$message({
            type: 'warning',
            message: '请先上传正确格式的excel文件!'
          })
          this.loading = false
          return
        }
        // 通过接口获取数据
        this.$http.post('/user/signups', this.tableData.body)
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
            this.loading = false // 关闭loading动画
            // 显示成功标志
            this.$alert(response.data.statusInfo, '添加成功', {
              type: 'success',
              message: response.data.statusInfo.message
            })
            // 把未添加成功的数据继续显示在页面上
            this.tableData.body = response.data.data.notAddUser
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
        this.dialogAddVisible = true // 显示dialog框
      },
      // 点击添加一条学生信息dialog里的添加按钮
      dialogAdd () {
        this.tableData.body.unshift(this.add) // 把add的数据添加到body数据中显示在页面上
        this.dialogAddVisible = false // 关闭dialog框
      },
      // 点击编辑
      handleEdit (indexArr, rowInfo, store) {
        // console.log(store)
        this.dialogFormVisible = true // 显示dialog框
        // console.log(index, rowInfo)
        const {major = '', classNo = '', grade = '', tel = '', password = '', user = '', name = ''} = rowInfo
        this.form = {
          indexArr,
          major,
          classNo,
          grade,
          tel,
          password,
          user,
          name
        }
      },
      // 点击删除
      handleDelete (index, rowInfo) {
        this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 点击确定
          this.tableData.body.splice(index, 1)
        }).catch(() => { // 点击取消后事件
        })
      },
      // 点击保存修改信息
      dialogUpdate () {
        // delete this.tableData.body[this.form.index]
        // indexArr代表的是这条数据在body中的位置
        const {indexArr = -1, major = '', classNo = '', grade = '', tel = '', password = '', user = '', name = ''} = this.form
        this.tableData.body[indexArr].user = user
        this.tableData.body[indexArr].major = major
        this.tableData.body[indexArr].classNo = classNo
        this.tableData.body[indexArr].grade = grade
        this.tableData.body[indexArr].tel = tel
        this.tableData.body[indexArr].password = password
        this.tableData.body[indexArr].name = name
        // const data = this.tableData.body
        // console.log(this.tableData.body)
        // this.tableData.body = data
        this.dialogFormVisible = false // 关闭dialog框
      },
      handkeFileChange (e) {
        if (this.rawFile !== null) {
          return
        }
        this.rawFile = e.target.files[0]
        this.fileConvertToWorkbook(this.rawFile)
          .then((workbook) => {
            let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
            this.workbook = workbook
            this.initTable(
              this.xlsxArrToTableArr(xlsxArr)
            )
            // console.log(this.tableData)
          })
          .catch((err) => {
            console.error(err)
          })
      },
      fileConvertToWorkbook (file) {
        let reader = new FileReader()
        let fixdata = (data) => {
          let o = ''
          let l = 0
          let w = 10240
          for (; l < data.byteLength / w; ++l) {
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
          }
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
          return o
        }
        return new Promise((resolve, reject) => {
          try {
            reader.onload = (renderEvent) => {
              let data = renderEvent.target.result
              if (this.rABS) {
                /* if binary string, read with type 'binary' */
                resolve(XLSX.read(data, {type: 'binary'}))
              } else {
                /* if array buffer, convert to base64 */
                let arr = fixdata(data)
                resolve(XLSX.read(btoa(arr), {type: 'base64'}))
              }
            }
            reader.onerror = (error) => {
              reject(error)
            }
            if (this.rABS) {
              reader.readAsBinaryString(file)
            } else {
              reader.readAsArrayBuffer(file)
            }
          } catch (error) {
            reject(error)
          }
        })
      },
      xlsxArrToTableArr (xlsxArr) {
        let tableArr = []
        let length = 0
        let maxLength = 0
        let maxLengthIndex = 0
        xlsxArr.forEach((item, index) => {
          length = Object.keys(item).length
          if (maxLength < length) {
            maxLength = length
            maxLengthIndex = index
          }
        })
        let tableHeader = Object.keys(xlsxArr[maxLengthIndex])
        // 修改两个参数使得空数据也给一一个''
        tableHeader = this.excelHeader
        maxLength = 7
        // end
        let rowItem = {}
        xlsxArr.forEach((item) => {
          rowItem = {}
          for (let i = 0; i < maxLength; i++) {
            rowItem[tableHeader[i]] = item[tableHeader[i]] || ''
          }
          tableArr.push(rowItem)
        })
        return {
          header: tableHeader,
          data: tableArr
        }
      },
      tableArrToXlsxArr ({data, header}) {
        let xlsxArr = []
        let tempObj = {}
        data.forEach((rowItem) => {
          tempObj = {}
          rowItem.forEach((item, index) => {
            tempObj[header[index]] = item
          })
          xlsxArr.push(tempObj)
        })
        return xlsxArr
      },
      initTable ({data, header}) {
        this.tableData.header = header
        this.tableData.body = data
        // this.$emit('on-select-file', this.tableData)
      },
      handleUploadBtnClick () {
        this.clearAllData()
        document.getElementById('upload-input').click()
      },
      clearAllData () {
        document.getElementById('upload-input').value = null
        this.tableData = {
          header: [],
          body: []
        }
        this.rawFile = null
        this.workbook = null
      }
    },
    data () {
      return {
        rABS: false,
        excelHeader: ['user', 'name', 'password', 'major', 'classNo', 'grade', 'tel'],
        rawFile: null,
        workbook: null,
        tableData: { // table表格显示的数据
          header: [], // 表头
          body: [] // 数据
        },
        loading: false, // loading动态效果
        form: { // dialog框参数
          index: -1,
          major: '',
          classNo: '',
          grade: '',
          tel: '',
          password: '',
          user: '',
          name: ''
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
        example: [{ // 例子的数据
          major: '软件工程(中外合作)',
          classNo: '软工1604',
          grade: '1604',
          tel: '132XXXXXXXX',
          password: '123456',
          user: 'XXX学号XXX',
          name: 'XXX'
        }],
        dialogFormVisible: false, // 控制dialog的显示
        dialogAddVisible: false, // 控制添加用户的dialog的显示
        formLabelWidth: '120px', // dialog框大小
        rules: { // 提交验证规则
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '请输入账号(学号)', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      accept: {
        type: String,
        default: '.xlsx, .xls' // 可以提交的文件类型
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
.top{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

</style>
