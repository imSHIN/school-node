<template>
    <div>
        <p class="title"><span><i class="el-icon-tickets"></i> 个人发展素质-社会实践能力</span></p> 
        <div class="border">
          <p class="h2">一、社会实践：获得省级优秀团队可加4分，校级优秀团队可加2分，院级优秀小分队加1分，立项团队加0.5分，其中负责人加全分，其他成员50％计分。</p>
          <el-select v-model="valueOne" placeholder="请选择">
            <el-option
            v-for="item in optionsOne"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-radio-group v-model="radio">
            <el-radio :label="1">负责人</el-radio>
            <el-radio :label="0.5">其他成员</el-radio>
          </el-radio-group>
        </div>
        <div class="border">
            <p class="h2">二、社会服务：获得省级优秀志愿者加4分，校级十佳志愿者加2分,省级项目优秀志愿者加3分/项，校级项目优秀志愿者加1分/项。对于志愿者级别由学院团委进行认定，志愿者活动级别以证书盖章为准，其中校级项目证书需盖校学生处（部）或校团委章。</p>
            <el-button type="primary" round @click="addService">添加社会服务</el-button>
            <div v-for="item in socialService" :key="item.id">
                <div class="border">
                  <p class="h2">项目id：{{item.id}}</p>
                  <el-form label-position="left">
                    <el-form-item label="社会服务描述">
                        <el-input  v-model="item.name" placeholder="请输入描述" class="shortinput"></el-input>
                    </el-form-item>
                    <el-form-item label="评定类别:">
                      <el-select v-model="item.points" placeholder="请选择">
                        <el-option v-for="item in serviceOption" :key="item.value"  :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <myup :file-path="filePath(item.id)" :item-id="item.id" ref="myup"></myup>
                  <el-button type="primary" round @click="removeService(item.id)">删除该事迹</el-button>
                </div>
              </div>
        </div>
        <div class="border">
          <el-button type="primary" round @click="onSocialPracAbili" class="buttonPosition">提交</el-button>
          <el-tag type='success' v-show="showSocialPracAbili">已提交</el-tag>
          <span>返回成绩：{{totalScore}}</span>
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
      showSocialPracAbili: false,
      totalScore: 0,
      socialService: [],
      optionsOne: [
        {
          value: 0,
          label: '无'
        },
        {
          value: 4,
          label: '省级优秀团队'
        },
        {
          value: 2,
          label: '校级优秀团队'
        },
        {
          value: 1,
          label: '院级优秀小队'
        },
        {
          value: 0.5,
          label: '立项团队'
        }
      ],
      serviceOption: [{value: '省级优秀志愿者'}, {value: '校级十佳志愿者'}, {value: '省级项目优秀志愿者'}, {value: '校级项目优秀志愿者'}],
      valueOne: 0,
      radio: 0.5
    }
  },
  components: {
    myup
  },
  methods: {
    addService () {
      this.socialService.push({
        id: new Date().getTime(),       // id 唯一标识
        name: '',         // 社会服务名称名称string
        point: '',          // 等级string
        requireCerti: true,  // 是否需要提交证明 同下
        reqiuredInfo: '待提交'
      })
    },
    removeService (id) {
      this.socialService = this.socialService.filter(item => {
        return item.id !== id
      })
    },
    onSocialPracAbili () {
      const self = this
      axios.post('user/uploadSocialPractice/' + self.user._id, {
        socialPracTeam: self.valueOne,
        teamJob: self.radio,
        socialService: self.socialService
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
         this.totalScore = response.data.totalScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.showSocialPracAbili = true
       }).catch(error => {
         console.log('fail ' + error)
       })
      let myups = this.$refs.myup
      for (let i = 0; i < myups.length; i++) {
        myups[i].submitMe()
      }
    },
    filePath () {
      return 'user/socialPractice/uploadEvidence/' + this.user._id
    }
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
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
.title {
  margin-bottom: 30px;
  color: #303133;
  font-size: 20px;
}
.h2 {
  margin-bottom: 16px;
  font-size: 16px;
}
</style>