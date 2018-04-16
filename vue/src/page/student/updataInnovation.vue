<template>
    <div>
        <p class="title"><span><i class="el-icon-tickets"></i> 个人发展素质-创新创业能力</span></p> 
        <div class="border">
            <p class="h2">一.科技竞赛</p>
            <el-collapse>
             <el-collapse-item title="相关竞赛介绍" name="1">
                <div>科技竞赛指各类综合性科技竞赛，包括全国（浙江省）大学生挑战杯科技竞赛、挑战杯创业计划大赛、全国大学生程序设计大赛、全国大学生电子竞赛、全国大学生数学建模竞赛、全国大学生结构设计竞赛、全国大学生电子商务挑战赛、全国大学生智能汽车竞赛、ACM程序设计竞赛、多媒体设计大赛全国大学生航空航天模型锦标赛、全国大学生机器人竞赛、校运河杯课外科技竞赛、全国英语演讲大赛<span class="red">等</span></div>               
             </el-collapse-item>
             <!-- <p>填此项的同学 务必认真阅读以下评分规则</p> -->
             <el-collapse-item title="填写细则，请填写此项的同学务必仔细阅读填写细则(点击查看)" name="2">
                 <div>1.获奖分国家级及以上、省市级、校级、院级四类，以<span class="red">一、二、三、四表示竞赛主办者所设的奖项层次</span>。国家级及以上、省市级、校级、院级奖项第四层次以下不予加分。</div>
                 <div>2.浙江省高数竞赛、全国英语竞赛、物理竞赛等按<span class="red">校级级别</span>填写</div>
                 <div>3.若比赛未设等级<span class="red">只取名次</span>，若取前八名，则第一、二名参照一等奖标准加分；第三、四名参照二等奖标准加分；以后名次参照三等奖标准加分。</div>
                 <div>4.科技竞赛省市级立项时加1分，结题时再加2分。校级立项加0.5分，院级立项加0.25分。</div>
                 <div>5.团体获奖项目队长加满分，成员按50%计分</div>
                 <div class="red">6.同一作品（项目）在不同的赛事获奖，只填最高奖项</div>
             </el-collapse-item>
            </el-collapse>
            <div>
                <el-button type="primary" round @click="addAProject">添加一个立项、获奖项目、学科竞赛等</el-button>
                <p class="message">填写格式参考</p>
                  <div v-for="project in projectList" :key="project.id">
                    <div class="border">
                        <p class="projectId">项目id：{{project.id}}</p>
                        <el-form>
                            <el-form-item label="竞赛名称">
                                 <el-input  v-model="project.name" placeholder="请输入竞赛名称"></el-input>
                            </el-form-item>
                            <el-form-item label="担任职位(成员、负责人）。单人项目请填‘单人竞赛’">
                                 <el-input  v-model="project.job" placeholder="请输入担任的职位"></el-input>
                            </el-form-item>
                            <!-- <div>
                              <span style="color:red">上传证明图片:(未上传证明 则该项目无效)</span>
                              <el-upload
                                style="display:inline"
                                ref="uploadme"
                                :on-change='fileChange'
                                :action='filePath()'
                                :file-list="fileList"
                                :auto-upload="false"
                                list-type="picture"
                                name="innovationFile">
                                <el-button size="small" type="primary" round>选择图片</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                              </el-upload>
                          </div> -->
                          <myup :file-path="filePath(project.id)" :item-id="project.id" ref="myup"></myup>
                        </el-form>
                        <el-button type="primary" round @click="removeProject(project.id)">删除该项目</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="border">
            <p class="h2">二.认证类考试.</p>
            <el-form>
                <el-form-item label="英语四级成绩：">
                    <el-input-number v-model="cetExam[0].points" :min="0" :max="710"></el-input-number>
                    <span>未参加请填0分</span>
                </el-form-item>
                <el-form-item label="英语六级成绩：">
                    <el-input-number v-model="cetExam[1].points" :min="0" :max="710"></el-input-number>
                    <span>未参加请填0分</span>
                </el-form-item>
            </el-form>
            <el-button type="primary" round @click="addOtherEng">添加其它英语专业认证考试</el-button>
            <el-button type="primary" round @click="addComputer">添加计算机专业类考试</el-button>
            <el-button type="primary" round @click="addOtherCetiExam">添加其它认证考试</el-button>
            <!-- 其他英语考试 -->
            <div v-for="exam in otherEnglish" :key="exam.id">
                <div class="border">
                    <p class="projectId">项目id：{{exam.id}}</p>
                    <el-form>
                        <el-form-item>
                            <el-form-item label="英语专业考试名称">
                                 <el-input  v-model="exam.name" placeholder="请输入考试名称"></el-input>
                            </el-form-item>
                            <el-form-item label="考试情况">
                                 <el-radio v-model="exam.points" label="5">通过</el-radio>
                                 <el-radio v-model="exam.points" label="2">参与</el-radio>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(exam.id)" :item-id="exam.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeOtherEng(exam.id)">删除该项目</el-button>
                   
                </div>
            </div>
            <!-- 计算机类认证考试 -->
            <div v-for="exam in computerExam" :key="exam.id">
                <div class="border">
                    <p class="projectId">项目id：{{exam.id}}</p>
                    <el-form label-position="right">
                        <el-form-item>
                            <el-form-item label="计算机类考试名称考试名称">
                                 <el-input  v-model="exam.name" placeholder="请输入考试名称"></el-input>
                            </el-form-item>
                            <el-form-item label="认证考试类别与情况">
                              <el-select v-model="exam.points" placeholder="请选择">
                                <el-option v-for="item in computerOption" :key="item.value"  :value="item.value" :label="item.label"></el-option>
                              </el-select>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(exam.id)" :item-id="exam.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeComputer(exam.id)">删除该项目</el-button>
                </div>
            </div>
            <!-- 其他认证考试 -->
            <div v-for="exam in otherExam" :key="exam.id">
                <div class="border">
                    <p class="projectId">项目id：{{exam.id}}</p>
                    <el-form>
                        <el-form-item>
                            <el-form-item label="其它认证考试--考试名称">
                                 <el-input  v-model="exam.name" placeholder="请输入考试名称"></el-input>
                            </el-form-item>
                            <el-form-item label="考试情况">
                                 <el-radio v-model="exam.points" label="1">通过</el-radio>
                                 <el-radio v-model="exam.points" label="0.5">参与</el-radio>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(exam.id)" :item-id="exam.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removeOtherCerti(exam.id)">删除该项目</el-button>
                </div>
            </div>
        </div>
        <div class="border">
            <p class="h2">三.学术论文发表与专利</p>
            <el-button type="primary" round @click="addAPaper">添加一个学术论文或专利</el-button>
            <p class="message">填写格式参考</p>
            <div v-for="paper in paperList" :key="paper.id">
                <div class="border">
                    <p class="projectId">项目id：{{paper.id}}</p>
                    <el-form>
                        <el-form-item>
                            <el-form-item label="论文、专利名称">
                                 <el-input  v-model="paper.name" placeholder="请输入名称"></el-input>
                            </el-form-item>
                            <el-form-item label="等级">
                              <el-select v-model="paper.lever" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value"  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                    <myup :file-path="filePath(paper.id)" :item-id="paper.id" ref="myup"></myup>
                    <el-button type="primary" round @click="removePaper(paper.id)">删除该项目</el-button>
                </div>
            </div>
        </div>
        <div class="border">
            <el-button type="primary" round @click="onSubmit">提交</el-button>
            <el-button type="primary" round @click="test">测试用按钮</el-button>
        </div>
        <!-- <div class="border">
            <xxhupload :up-path="filePath()" up-name="innovationFile"></xxhupload>
        </div> -->
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import xxhupload from './components/xxhUpload.vue'
import myup from './components/myup.vue'
export default {
  data () {
    return {
      fileList: [],
      projectList: [],
      computerExam: [],
      otherExam: [],
      paperList: [],
      otherEnglish: [],
      cetExam: [      // 英语4,6级
        {
          id: 43455434,
          name: '英语四级',
          points: 0
        },
        {
          id: 43455436,
          name: '英语六级',
          points: 0
        }
      ],

      options: [          // 论文专利等级下拉框 内容(给老师看得 人工算分 估计几乎没人有这东西)
        {
          value: 'A类期刊索引收录'
        },
        {
          value: 'A类期刊索引未收录'
        },
        {
          value: 'B类期刊'
        },
        {
          value: '普通期刊'
        },
        {
          value: '发明专利(受理)'
        },
        {
          value: '发明专利'
        },
        {
          value: '实用新型、外观专利、软件著作（受理）'
        },
        {
          value: '实用新型、外观专利、软件著作'
        }
      ],
      computerOption: [{
        value: 0.5,
        label: '仅参与考试'
      }, {
        value: 2,
        label: '全国计算机等级考试 三级(通过)'
      }, {
        value: 3,
        label: '其它计算机类考试(通过)'
      }],
      creat () {
        this.getCet()
      }
    }
  },
  components: {
    xxhupload, myup
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
  },
  methods: {
    addAProject () {
      this.projectList.push({      // 科技竞赛
        id: new Date().getTime(),       // id 唯一标识
        name: '',         // 竞赛名称string
        job: '',          // 担任角色string
        requireCerti: true,  // 是否需要提交证明 同下
        reqiuredInfo: '待提交'     // 是否已经提交证明  同下
      })
    },

    addOtherEng () {
      this.otherEnglish.push({
        id: new Date().getTime(),
        name: '',
        points: 0,
        requireCerti: true,
        reqiuredInfo: '待提交'
      })
    },
    addComputer () {
      this.computerExam.push({
        id: new Date().getTime(),
        name: '',
        points: 0.5,
        requireCerti: true,
        reqiuredInfo: '待提交'
      })
    },
    addOtherCetiExam () {
      this.otherExam.push({
        id: new Date().getTime(),
        name: '',
        points: 0,
        requireCerti: true,
        reqiuredInfo: '待提交'
      })
    },
    addAPaper () {
      this.paperList.push({       // 论文 专利 （一般都是空的吧233）
        id: new Date().getTime(),
        name: '',
        lever: '',              // 等级 下拉框（详见options）
        requireCerti: true,
        reqiuredInfo: '待提交'
      })
    },
    removeProject (id) {
      this.projectList = this.projectList.filter(item => {
        return item.id !== id
      })
    },
    removeOtherEng (id) {
      this.otherEnglish = this.otherEnglish.filter(item => {
        return item.id !== id
      })
    },
    removeComputer (id) {
      this.computerExam = this.computerExam.filter(item => {
        return item.id !== id
      })
    },
    removeOtherCerti (id) {
      this.otherExam = this.otherExam.filter(item => {
        return item.id !== id
      })
    },
    removePaper (id) {
      this.paperList = this.paperList.filter(item => {
        return item.id !== id
      })
    },
    fileChange (file, fileList) {
      console.log(file.name, fileList)
      this.fileList = fileList
    },
    filePath (id) {
      return 'http://localhost:3000/user/innovation/uploadEvidence/' + this.user._id + '?id=' + id  // http://localhost:3000/user/innovation/uploadEvidence/
    },
    onSubmit () {
      const self = this
      axios.post('user/uploadInnovation/' + self.user._id, {
        techCompetition: self.projectList,       // 科技竞赛对象数组

        computerExamArr: self.computerExam,
        engExamArr: [].concat(self.cetExam, self.otherEnglish),       // 英语考试对象数组
        otherArr: self.otherExam,       // 其它认证考试对象数组

        academicPaper: self.paperList            // 论文、专利对象数组
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
      // let fileValue = document.querySelectorAll('.el-upload')
      this.$refs.myup[0].submitMe()
      console.log(this.$refs.myup)
      // fileValue[0].submit()
    },
    getCet () {
      // this.$http.get('/user')
      //     .then(response => {
      //       // this.loading = false
      //       if (response.data.status === 1 || response.data.status === 2) {
      //         this.$alert(response.data.statusInfo.message || '错误', {
      //           confirmButtonText: '确定'
      //         })
      //         return
      //       } else if (response.data.status !== 0) {
      //         this.$alert(response.data.statusInfo.message || '发生未知错误', '错误', {
      //           confirmButtonText: '确定'
      //         })
      //         return
      //       }
      //       this.cetExam[0].points = response.data.data.cetF
      //       this.cetExam[1].points = response.data.data.cetS
      //     })
      //     .catch(error => {
      //       this.loading = false
      //       console.log('fail' + error)
      //       this.$notify.error({
      //         title: '错误',
      //         message: '网络连接错误,请检查网络状态或联系管理员.'
      //       })
      //     })
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
  width: 90%;
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
.message {
 margin: 10px;
 font-size: 15px;
}
.red {
  color: red;
}
</style>