<template>
    <div>
        <p class="title"><span><i class="el-icon-tickets"></i> </span>个人发展素质-社会工作能力</p> 
        <div class="border">
            <p class="h2">1.学生团体任职</p>
            <el-button type="primary" round @click="addAWork">添加一个学生工作</el-button>
            <div v-for="workItem in workList" :key="workItem.id">
                <div class="border">
                    <p class="projectId">项目id：{{workItem.id}}</p>
                    <el-form>
                        <el-form-item label="学生团体名称">
                            <el-input  v-model="workItem.teamName" placeholder="请输入组织名称"></el-input>
                        </el-form-item>
                        <el-form-item label="团体奖项(如‘十佳社团’等，没有请填‘无’)">
                            <el-input  v-model="workItem.teamPrize" placeholder="请输入团体奖项名称"></el-input>
                        </el-form-item>
                        <el-form-item label="担任职位">
                            <el-input  v-model="workItem.teamJob" placeholder="请输入职位名称"></el-input>
                        </el-form-item>
                        <el-form-item label="任职时间">
                           <el-radio-group v-model="workItem.workTime">
                            <el-radio :label="0.5">半学年</el-radio>
                            <el-radio :label="1">一学年</el-radio>
                           </el-radio-group>
                        </el-form-item>
                        <p>没有业绩考评分的团体请选C</p>
                        <el-form-item label="上学期工作业绩分">
                          <el-radio-group v-model="workItem.workPerFirst">
                            <el-radio :label="0.5">A</el-radio>
                            <el-radio :label="0.25">B</el-radio>
                            <el-radio :label="0">C</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="下学期工作业绩分"> 
                          <el-radio-group v-model="workItem.workPerSecond">
                            <el-radio :label="0.5">A</el-radio>
                            <el-radio :label="0.25">B</el-radio>
                            <el-radio :label="0">C</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                          <span>任职基本分：</span>
                          <el-slider v-model="workItem.workBaseScore" :step="0.5" :max="3.5" show-stops></el-slider>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(workItem.id)" :item-id="workItem.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeWorkItem(workItem.id)">删除该项目</el-button>
                </div>
            </div>
        </div>
        <div class="border">
            <p class="h2">2.各类荣誉称号</p>
            <el-button type="primary" round @click="addATitle">添加一个荣誉称号</el-button>
            <div v-for="titleItem in titleList" :key="titleItem.id">
                <div class="border">
                    <p class="projectId">项目id：{{titleItem.id}}</p>
                    <el-form>
                        <el-form-item label="荣誉称号名称">
                            <el-input  v-model="titleItem.titeName" placeholder="请输入称号名称"></el-input>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(titleItem.id)" :item-id="titleItem.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeTitleItem(titleItem.id)">删除该项目</el-button>
                </div>
            </div>
        </div>
        <div class="border">
            <el-button type="primary" round @click="onSubmit">提交</el-button>
            <el-button type="primary" round @click="test">测试用按钮</el-button>
        </div>   
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import myup from './components/myup.vue'
export default {
  data () {
    return {
      workList: [],
      titleList: [],
      fileList: []
    }
  },
  components: {
    myup
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
  },
  methods: {
    addAWork () {
      this.workList.push({
        id: new Date().getTime(),
        teamName: '',
        teamJob: '',
        workTime: 1,
        requireCerti: true,
        reqiured: false,
        workPerFirst: 0,
        workPerSecond: 0,
        workBaseScore: 0,
        teamPrize: '无'
      })
    },
    addATitle () {
      this.titleList.push({
        id: new Date().getTime(),
        titeName: '',
        requireCerti: true,
        reqiured: false
      })
    },
    removeWorkItem (id) {
      this.workList = this.workList.filter(item => {
        return item.id !== id
      })
    },
    removeTitleItem (id) {
      this.titleList = this.titleList.filter(item => {
        return item.id !== id
      })
    },
    onSubmit () {
      const self = this
      axios.post('user/uploadSocialWork/' + self.user._id, {
        workList: self.workList,
        titleList: self.titleList
      })
       .then(response => {
         if (response.data.status === 1) {
           this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '错误', {
             confirmButtontext: '确定'
           })
           return
         } else if (response.data.status !== 0) {
           this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '发生未知错误', '错误', {
             confirmButtontext: '确定'
           })
           return
         }
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
       }).catch(error => {
         console.log('fail ' + error)
       })
      let myups = this.$refs.myup
      for (let i = 0; i < myups.length; i++) {
        myups[i].submitMe()
      }
    },
    test () {
      const self = this
      console.log(self.workList)
      console.log(self.titleList)
    },
    filePath () {
      return 'user/socialWork/uploadEvidence/' + this.user._id
    },
    handleError (err, file, fileList) {
      console.log('fail ' + err)
    },
    upload () {
      let formData = new FormData()
      let fileValue = document.querySelector('.el-upload .el-upload__input')
      for (let i = 0; i < fileValue.files.length; i++) {
        formData.append('socialWorkFile', fileValue.files[i])
      }
      console.log('formData.......................')
      console.log(formData)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post(this.filePath(), formData, config)
      .then(response => {
        if (response.data.status === 1) {
          this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '错误', {
            confirmButtontext: '确定'
          })
        } else if (response.data.status !== 0) {
          this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '发生未知错误', '错误', {
            confirmButtontext: '确定'
          })
        }
        this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
          confirmButtontext: '确定'
        })
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  padding: 20px;
  margin-bottom: 30px;
  width: 80%;
}
.border:hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.h2 {
  margin-bottom: 16px;
  font-size: 16px;
}
.title {
  color: #303133;
  font-size: 20px;
  margin-bottom: 20px;
}

</style>