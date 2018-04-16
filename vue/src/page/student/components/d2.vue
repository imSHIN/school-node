<template>
    <div>
        <p class="h1">二.学生德育素质纪实加减分</p>
        <div class="border">
            <span class="h2">(1)班级等级分: {{classLevel.score}}</span> 
            
            <!-- <el-radio-group v-bind="classLevel.score" disabled>
              <el-radio :label="14">A</el-radio>
              <el-radio :label="12">B</el-radio>
              <el-radio :label="11">C</el-radio>
            </el-radio-group> -->
            <!-- <el-button type="primary" round @click="onClassLev" class="buttonPosition">提交</el-button> -->
            <el-button type="primary" round @click="inputshow.class = !inputshow.class" class="buttonPosition">
              {{inputshow.class ? '删除描述' : '若信息有误，点击申请' }}
            </el-button>
            <div v-if="inputshow.class">
                <span>错误描述：</span>
                <el-input v-model="classLevel.info" style="width:38.2%"></el-input>
                <el-button type="primary" round @click="onClassLev" class="buttonPosition">提交申请</el-button>
            </div>
        </div>
        <div class="border">
            <p class="h2">(2)寝室纪实分</p>
            <el-form  label-position='left' label-width="230px">
                <el-form-item label="学年每周公寓检查结果平均分: ">
                    <el-input-number v-model="domi.dormitoryWeek" :min="0" :max="100" :step="1" disabled></el-input-number>
                </el-form-item>
                 <el-form-item label="文明寝室-获奖: ">
                  <el-radio-group v-model="domi.dormitoryRadio" disabled>
                  <el-radio :label="3">校级</el-radio>
                  <el-radio :label="2">院级</el-radio>
                  <el-radio :label="0">无</el-radio>
                 </el-radio-group>
                </el-form-item>
                <el-form-item label="寝室表扬次数: " prop='dormitoryPraiseNum'>
                    <el-input-number v-model="domi.dormitoryPraiseNum" :min="0" disabled></el-input-number>
                </el-form-item>
                <el-form-item label="寝室违纪次数: " prop='dormitoryDisciplineNum' >
                    <el-input-number v-model="domi.dormitoryDisciplineNum" :min="0" disabled></el-input-number>
                    <el-button type="primary" round @click="inputshow.domi = !inputshow.domi" class="buttonPosition">
                      {{inputshow.domi ? '删除描述' : '若信息有误，点击申请' }}
                   </el-button>
                   <!-- <div v-if="inputshow.domi">
                    <span>错误描述：</span>
                    <el-input v-model="domi.info" style="width:38.2%"></el-input>
                    <el-button type="primary" round @click="onDomi" class="buttonPosition">提交</el-button>
                   </div>                         -->
                </el-form-item>
                <el-form-item label="错误描述:" v-if="inputshow.domi">
                    <el-input v-model="domi.info" style="width:38.2%" ></el-input>
                    <el-button type="primary" round @click="onDomi" class="buttonPosition">提交申请</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="border">
            <p class="h2">（3）履行责任、服务奉献记实分（满分8分）</p> 
            <el-form  label-position='left' label-width="230px">
                <p class="h2">1.学生拾金不昧、好人好事等行为经社会认可，经校级及以上组织认定加4.0分/项，经学院团委认定加2.0分/次.</p>
                <el-button type="primary" round @click="addDeed">添加认证事迹</el-button>
                <!-- 添加事迹 -->
                <div v-for="item in goodDeed" :key="item.id">
                  <div class="border">
                    <p class="h2">项目id：{{item.id}}</p>
                    <el-form label-position="right">
                        <el-form-item label="事迹名">
                            <el-input  v-model="item.name" placeholder="请输入事迹名称" class="longinput"></el-input>
                        </el-form-item>
                        <el-form-item label="事迹认证等级:">
                          <el-select v-model="item.points" placeholder="请选择">
                            <el-option v-for="item in deedOption" :key="item.value"  :value="item.value" :label="item.label"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(item.id)" :item-id="item.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeADeed(item.id)">删除该事迹</el-button>
                  </div>
                </div>
                <!-- 事迹结束 -->
                <p class="h2">2.参加志愿者服务当学年工时达到20工时，加4.0分，超过20工时每增加1工时，加0.1分。参加国家级志愿服务活动叠加1.0分/项，参加省、市级志愿服务活动叠加0.5分/项。</p>
                <el-form-item label="志愿者协会志愿者工时： ">
                    <el-input-number v-model="volunteer.volunteerIn" :min="0" disabled></el-input-number>
                    <el-button type="primary" round @click="inputshow.volun = !inputshow.volun" class="buttonPosition">
                      {{inputshow.volun ? '删除描述' : '若信息有误，点击申请' }}
                   </el-button>
                </el-form-item>
                <el-form-item label="错误描述:" v-if="inputshow.volun">
                    <el-input v-model="volunteer.info" style="width:38.2%"></el-input>
                    <el-button type="primary" round @click="onVolun" class="buttonPosition">提交申请</el-button>
                </el-form-item>
                <el-form-item label="校外志愿者活动： ">
                    <!-- <el-input-number v-model="volunCountry" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="省、市级志愿服务活动项数： " prop ='volunProvince'>
                    <el-input-number v-model="volunProvince" :min="0"></el-input-number> -->
                  <el-button type="primary" round @click="addVolun">添加校外志愿活动</el-button>
                </el-form-item>
                <!-- 添加校外志愿活动 -->
                  <div v-for="item in outVolun" :key="item.id">
                    <div class="border">
                      <p class="h2">项目id：{{item.id}}</p>
                      <el-form label-position="right">
                        <el-form-item label="志愿活动名称">
                            <el-input  v-model="item.name" placeholder="请输入名称" class="shortinput"></el-input>
                        </el-form-item>
                        <el-form-item label="工时">
                            <el-input-number  v-model="item.time" :min="0" :step="0.1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="活动等级:">
                          <el-select v-model="item.points" placeholder="请选择">
                            <el-option v-for="item in volunOption" :key="item.value"  :value="item.value" :label="item.label"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form>
                      <myup :file-path="filePath(item.id)" :item-id="item.id" ref="myup"></myup>
                      <el-button type="primary" round @click="removeAVolun(item.id)">删除该事迹</el-button>
                    </div>
                  </div>
                  <!-- 校外志愿活动结束 -->
             </el-form>
        </div>
        <div class="border">
            <p class="h2">（4）遵章守纪加减分</p>
            <div class="border">
              1.违纪记录
              <el-table :data="badTable" style="width: 100%">
                <el-table-column
                  fixed
                  prop="probation"
                  label="留校察看次数">
                </el-table-column>
                <el-table-column
                  prop="demerit"
                  label="记过次数">
                </el-table-column>
                <el-table-column
                  prop="seriousAdmonish"
                  label="严重警告次数">
                </el-table-column>
                <el-table-column
                  prop="admonish"
                  label="警告次数">
                </el-table-column>
                <el-table-column
                  prop="criticismSc"
                  label="通报批评（校级）">
                </el-table-column>
                <el-table-column
                  prop="criticismCo"
                  label="通报批评（院级）">
                </el-table-column>
              </el-table>
              <el-button type="primary" round @click="inputshow.obey = !inputshow.obey">
                        {{inputshow.obey ? '删除描述' : '若信息有误，点击申请' }}
              </el-button>
              <el-form>
                <el-form-item label="错误描述:" v-if="inputshow.obey">
                      <el-input v-model="obey.info" style="width:38.2%"></el-input>
                      <el-button type="primary" round @click="onObey" class="buttonPosition">提交申请</el-button>
              </el-form-item>
              </el-form>
            </div>
            <div class="border">2.表扬记录
              <el-button type="primary" round @click="addPraise">添加通报表扬</el-button>
  <!-- 添加通报表扬 -->
              <div v-for="item in praise" :key="item.id">
                <div class="border">
                  <p class="h2">项目id：{{item.id}}</p>
                  <el-form label-position="left">
                    <el-form-item label="通报表扬描述">
                        <el-input  v-model="item.name" placeholder="请输入描述" class="shortinput"></el-input>
                    </el-form-item>
                    <el-form-item label="表扬等级:">
                      <el-select v-model="item.points" placeholder="请选择">
                        <el-option v-for="item in praiseOption" :key="item.value"  :value="item.value" :label="item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <myup :file-path="filePath(item.id)" :item-id="item.id" ref="myup"></myup>
                  <el-button type="primary" round @click="removeAPraise(item.id)">删除该事迹</el-button>
                </div>
              </div>
  <!-- 通报表扬结束 -->
          </div>
        </div>
        <div class="border">
          <el-button type="primary" round @click="onSubmit">提交</el-button>
          <el-button type="primary" round @click="getData">测试</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import myup from './myup.vue'
export default {
  components: {
    myup
  },
  computed: {
    ...mapGetters({user: 'UserInfo'}),
    badTable () {
      return [{ probation: this.obey.probation,
        demerit: this.obey.demerit,
        seriousAdmonish: this.obey.seriousAdmonish,
        admonish: this.obey.admonish,
        criticismSc: this.obey.criticismSc,
        criticismCo: this.obey.criticismCo}]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    filePath (id) {
      return 'http://localhost:3000/user/morality/uploadEvidence/' + this.user._id + '?id=' + id  // http://localhost:3000/user/innovation/uploadEvidence/
    },
    addDeed () {
      this.goodDeed.push({      // 好人好事
        id: new Date().getTime(),       // id 唯一标识
        name: '',         // 事迹名称string
        point: '',          // 等级string 1.校级及以上 2.院级 OR 分数number
        requireCerti: true,  // 是否需要提交证明 同下
        reqiuredInfo: '待提交'     // 是否已经提交证明  同下
      })
    },
    removeADeed (id) {
      this.goodDeed = this.goodDeed.filter(item => {
        return item.id !== id
      })
    },
    addVolun () {
      this.outVolun.push({      // 校外志愿者活动
        id: new Date().getTime(),       // id 唯一标识
        name: '',         // 竞赛名称string
        time: 0,
        point: '',          // 等级 省市、 国家
        requireCerti: true,
        reqiuredInfo: '待提交'
      })
    },
    removeAVolun (id) {
      this.outVolun = this.outVolun.filter(item => {
        return item.id !== id
      })
    },
    addPraise () {
      this.praise.push({      // 好人好事
        id: new Date().getTime(),       // id 唯一标识
        name: '',         // 事迹名称string
        point: '',          // 等级string 1.校级及以上 2.院级 OR 分数number
        requireCerti: true,  // 是否需要提交证明 同下
        reqiuredInfo: '待提交'     // 是否已经提交证明  同下
      })
    },
    removeAPraise (id) {
      this.praise = this.praise.filter(item => {
        return item.id !== id
      })
    },
    onClassLev () {
      const self = this
      axios.post('user/morality/alterClassLevel/' + self.user._id, {
        classLevel: self.classLevel
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
         this.returnValue.classLevel = response.data.classLevel
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.inputshow.class = true
       }).catch(error => {
         console.log('fail ' + error)
       })
    },
    onDomi () {
      const self = this
      axios.post('user/morality/alterDormitory' + self.user._id, {
        certi: self.domi.certi,
        info: self.domi.info
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
         this.returnValue.totalDormScore = response.data.totalDormScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.inputshow.domi = true
       }).catch(error => {
         console.log('fail ' + error)
       })
    },
    onVolun () {
      const self = this
      axios.post('user/morality/alterVolunteer/' + self.user._id, {
        certi: self.volunteer.certi,
        info: self.volunteer.info
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
         // ...............................
         this.returnValue.totalVolScore = response.data.totalVolScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.inputshow.volun = true
       }).catch(error => {
         console.log('fail ' + error)
       })
    },
    onObey () {
      const self = this
      axios.post('user/morality/alterObedience/' + self.user._id, {
        certi: self.obey.certi,
        info: self.obey.info
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
         this.returnValue.obeyObedience = response.data.obeyObedience
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.inputshow.obey = true
       }).catch(error => {
         console.log('fail ' + error)
       })
    },
    onSubmit () {  // 上传对象
      const self = this
      axios.post('user/morality/' + self.user._id, {
        goodDeed: self.goodDeed,
        outVolun: self.outVolun,
        praise: self.praise
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
    getData () {
      const self = this
      axios.get('user/morality/getData/' + self.user._id)
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
            // 接受数据
            this.classLevel = response.data.classLevel
            this.domi = response.data.domi
            this.volunteer = response.data.volunteer
            this.obey = response.data.obey
            this.$notify({
              title: '成功',
              message: '数据获取成功',
              type: 'success'
            })
          }).catch(error => {
            console.log('fail ' + error)
          })
    }
  },
  data () {
    return {
      returnValue: {                 // 后端返回成绩
        totalDormScore: 0,
        totalVolScore: 0,
        obeyObedience: 0
      },
      inputshow: {                    // 用于每次提交错误反馈信息
        class: false,
        domi: false,
        volun: false,
        obey: false
      },

      goodDeed: [],
      outVolun: [],
      praise: [],

      deedOption: [{value: 2, label: '院级'}, {value: 4, label: '校级及以上'}],
      volunOption: [{value: 0.5, label: '市、省级'}, {value: 1, label: '国家级'}],
      praiseOption: [{value: 0.5, label: '院级'}, {value: 1, label: '校级'}],

// 一下数据全部要初始化 每次打开网页 发送get请求 由后台返回
      classLevel: {
        score: 11,
        certi: true, // 学生确认
        info: ''
      },
      domi: {
        dormitoryWeek: 0,
        dormitoryRadio: 0,
        dormitoryPraiseNum: 0,
        dormitoryDisciplineNum: 0,
        certi: true,
        info: ''
      },
      volunteer: {
        // goodDeed: [],   // 专门数组 我发给你
        volunteerIn: 0, // 校志协工时
        volunteerOut: [], // 校外志愿者工时 有个专门项目数组

        // 下面两个不用发给我 后端自己处理
        volunCountry: 0,
        volunProvince: 0,
        certi: true,
        info: ''
      },
      obey: {
        probation: 0,
        demerit: 0,
        seriousAdmonish: 0,
        admonish: 0,
        criticismSc: 0,
        criticismCo: 0,

        praise: [],  // 有专门项目对象
        certi: true,
        info: ''
      }

    }
  }
}
</script>

<style scoped>
.shortinput {
  width: 38.2%;
}
.longinput {
  width: 61.8%;
}
.h1 {
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}
.h2 {
  margin-bottom: 16px;
  font-size: 16px;
}
.h2 {
  margin-bottom: 14px;
  font-size: 15px;
}
.border {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  padding: 20px;
  margin-bottom: 30px;
}
.border:hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.inline {
  display: inline;
}
.buttonPosition{
  margin-left: 150px;
}
</style>