<template>
    <div>
        <p class="title"><span><i class="el-icon-tickets"></i> </span>个人发展素质-文体拓展素质</p> 
        <div class="border">
            <p class="h2">1.早锻炼、晚自修（满分4分）</p>
            <el-form>
                <el-form-item label="早锻炼出勤 %">
                    <el-input-number v-model="morning" controls-position="right" :min="0" :max="100"></el-input-number>
                    <span>免修同学请填80</span>
                </el-form-item>
                <el-form-item label="晚自修出勤率 %">
                    <el-input-number v-model="night" controls-position="right" :min="0" :max="100"></el-input-number>
                    <span>免修同学请填80</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="border">
            <p class="h2">2.参加校内外文体、美术竞赛等活动获奖</p>
            <el-collapse>
                <el-collapse-item title="相关活动介绍（点击查看）" name="liteAndSpoActivity">
                    <div>（1）发表新闻稿件（包括暑期社会实践新闻、论文）</div>
                    <div>（2）各类活动加分，即参加由学校团委、教务处、学工部等职能部门、各学院团委或者各类学生团体组织的各种活动（如及其他各类文化、体育、文艺类比赛等），以及校外企事业单位活动，一律按校级加分</div>
                    <div>（3）各类体育赛事加分</div>
                </el-collapse-item>
            </el-collapse>
            <el-button type="primary" round @click="addAItem">添加一个文体活动等</el-button>
            <div v-for="item in activities" :key="item.id">
                <div class="border">
                    <p class="projectId">项目id：{{item.id}}</p>
                    <el-form>
                        <el-form-item label="活动名称">
                            <el-input  v-model="item.name" placeholder="请输入称号名称"></el-input>
                            <span></span>
                        </el-form-item>
                        <el-form-item label="获奖级别">
                            <el-input  v-model="item.lever" placeholder="请输入获奖级别"></el-input>
                            <span></span>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(item.id)" :item-id="item.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeItem(item.id)">删除该项目</el-button>
                </div>
            </div>
        </div>  
        <div class="border">
            <el-button type="primary" round @click="onSubmit">提交</el-button>
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
      morning: 0,
      night: 0,
      activities: []
    }
  },
  components: {
    myup
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
  },
  methods: {
    addAItem () {
      this.activities.push({
        id: new Date().getTime(),
        actiName: '',
        lever: '',
        requireCerti: true,
        reqiured: false
      })
    },
    removeItem (id) {
      this.activities = this.activities.filter(item => {
        return item.id !== id
      })
    },
    filePath () {
      return 'user/recreation/uploadEvidence/' + this.user._id
    },
    onSubmit () {
      const self = this
      axios.post('user/updataSocialWork/' + self.user._id, {
        morning: self.morning,
        night: self.night,
        activities: self.activities
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