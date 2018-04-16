<template>
    <div>
      <section>
      <section class="top">
        <el-input placeholder="请输入查询内容" v-model="search.content" class="input-with-select" style="width:350px">
          <el-select v-model="search.title" slot="prepend" placeholder="请选择" style="width:100px">
            <el-option label="无" value="none"></el-option>
            <el-option label="账号" value="user"></el-option>
            <el-option label="姓名" value="name"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch(search.title, search.content)"></el-button>
        </el-input>
      </section>
        <div class="border">
            <el-table 
              :data="tableData" 
              style="width: 100%" 
              @row-click='showDetials'
              v-loading="StudentsLoading"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(242,246,252,0.75)"> 

                <el-table-column prop="user" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="morSubmit" label="德育素质">
                  <template slot-scope="scope">
                    <i :class="scope.row.morSubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="phySubmit" label="体育素质">
                  <template slot-scope="scope">
                    <i :class="scope.row.phySubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="gpaSubmit" label="智育素质">
                  <template slot-scope="scope">
                    <i :class="scope.row.gpaSubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="innovationSubmit" label="创新创业">
                  <template slot-scope="scope">
                    <i :class="scope.row.innovationSubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="socialWorkSubmit" label="社会工作">
                  <template slot-scope="scope">
                    <i :class="scope.row.socialWorkSubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="socialPracSubmit" label="社会实践">
                  <template slot-scope="scope">
                    <i :class="scope.row.socialPracSubmit ?'el-icon-check': 'el-icon-close'"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="recreationSubmit" label="文体素质">
                  <template slot-scope="scope">
                    <i :class="scope.row.recreationSubmit ?'el-icon-check': 'el-icon-close'"></i>
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
            <el-dialog title="学生成绩审核" :visible.sync="dialogVisible" width="75%" :close-on-click-modal= "false">
                <p>姓名:  {{oneTest.name}}</p>
                <p>学号： {{test}} </p>
                <div class="border">
                    <p class="h2">一.智育素质、体育素质：</p>
                    <span>绩点：</span>
                    <el-input v-model.number="oneTest.gpa" :disabled="gpaDis" style="width:100px"></el-input>                
                    <span> 体育平均分：</span>
                    <el-input v-model.number="oneTest.physical" :disabled="gpaDis" style="width:100px"></el-input>
                    <el-button type="primary" round @click="gpaDis=false">修改</el-button>
                 </div>
                  <div class="border">
                    <p class="h2">二.德育素质</p>
                   
                    <div class="itemborder">基本评定： <span>学生自评分： {{oneTest.morality.base.self}}</span><span>教师评定分： {{oneTest.morality.base.teacher}}</span> <span>总评成绩：{{oneTest.morality.base.total}}</span></div>
                    
                    <div class="itemborder">
                      <p class="h2">纪实加减</p> 
                      <div class="itemborder">
                          班级等级分：{{oneTest.morality.classScore}} 
                      </div>
                      <div class="itemborder">
                        <p>寝室纪实分: </p>
                        <div class="itemborder">
                          <span>周平均分</span>
                          <el-input v-model.number="oneTest.morality.domitory.week" :disabled="domitoryDis" style="width:100px"></el-input>
                        </div>
                        <div class="itemborder">
                          <span>寝室获奖情况（文明寝室）：{{oneTest.morality.domitory.prize.name}}</span>
                          <el-button :type="oneTest.morality.domitory.prize.certi?'warning':'primary'" round @click="oneTest.morality.domitory.prize.certi=!oneTest.morality.domitory.prize.certi" size="mini">{{juageInfo(oneTest.morality.domitory.prize.certi)}}</el-button>
                        </div>
                        <div class="itemborder">
                          <span>寝室奖惩情况：通报表扬次数：{{oneTest.morality.domitory.PaD.praizeNum}} 通报批评次数{{oneTest.morality.domitory.PaD.disPraizeNum}}</span>
                          <el-button :type="oneTest.morality.domitory.PaD.certi?'warning':'primary'" round @click="oneTest.morality.domitory.PaD.certi=!oneTest.morality.domitory.PaD.certi" size="mini">{{juageInfo(oneTest.morality.domitory.PaD.certi)}}</el-button>
                        </div>
                      </div>
                    </div>

                    <div class="itemborder">
                      <p>（3）履行责任、服务奉献记实分（满分8分）</p>
                      <div class="itemborder"> 
                        <span>志愿者工时：</span>
                        <el-input v-model.number="oneTest.morality.service.volunteerTime" style="width:100px"></el-input>
                      </div>
                      <div class="itemborder" v-for="item in oneTest.morality.service.activities" :key="item.id">
                          <div class="border">
                            <p>经历： {{item.name}}</p>
                            <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                          </div>
                      </div>
                    </div>

                    <div class="itemborder">
                      <p>（4）遵章守纪加减分</p>
                      <div class="itemborder" v-for="item in oneTest.morality.discipline.items" :key="item.id">
                          <div class="border">
                            <p>经历： {{item.name}}</p>
                            <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                          </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="border">
                    <p class="h2">三.创新创业</p>
                    
                    <div class="itemborder">
                      <p>科技竞赛</p>
                      <div class="itemborder" v-for="item in oneTest.innovation.tech" :key="item.id">
                          <div class="border">
                            <p>项目名： {{item.name}}</p>
                            <p>担任职位：{{item.job}}</p>
                            <p>加分：{{item.score}}</p>
                            <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                          </div>
                      </div>
                    </div>

                    <div class="itemborder">
                      <p>认证考试</p>
                      <div class="itemborder" v-for="item in oneTest.innovation.exam" :key="item.id">
                          <div class="border">
                            <p>项目名： {{item.name}}</p>
                            <p>考试情况：{{item.condition}}</p>
                            <p>加分： {{item.score}}</p>
                            <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                          </div>
                      </div>
                  </div>

                  <div class="itemborder">
                      <p>学术专利</p>
                      <div class="itemborder" v-for="item in oneTest.innovation.academi" :key="item.id">
                          <div class="border">
                            <p>论文、专利名： {{item.name}}</p>
                            <p>论文专利等级：{{item.condition}}</p>
                            <p>加分： {{item.score}}</p>
                            <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                          </div>
                      </div>
                  </div>
                </div>

                <div class="border">
                  <p class="h2">四.社会实践能力</p>
                  <div class="itemborder">
                    <p>社会实践</p>
                    <p>队伍等级：{{oneTest.socialPrac.socialPractice.socialPracTeam}}</p>
                    <p>担任职务：{{oneTest.socialPrac.socialPractice.teamJob}}</p>
                    <p>加分： {{oneTest.socialPrac.socialPractice.score}}</p>
                  </div>
                  <div class="itemborder">
                    <p>社会服务</p>
                    <div class="itemborder" v-for="item in oneTest.socialPrac.socialService" :key="item.id">
                        <div class="border">
                          <p>荣誉名：{{item.name}}</p>
                          <p>次数：{{item.times}}</p>
                          <p>加分： {{item.score}}</p>
                          <el-button :type="item.certi?'warning':'primary'" round @click="item.certi=!item.certi" size="mini">{{juageInfo(item.certi)}}</el-button>
                        </div>
                      </div>
                  </div>
                </div>

                <div class="border">
                  <p class="h2">五.社会工作能力</p>
                </div>

                <div class="border">
                  <p class="h2">六.文体拓展</p>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="haddleupdate()">保存修改</el-button>
                </div>
            </el-dialog>
        </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialogVisible: false,
      test: 0,
      tableData: [],
      StudentsLoading: false,

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
      showPerson: {},  // 某个学生具体分数，由post取值，dialog框关闭后， 清空
      oneTest: {      // showPerson 的测试版
        name: '显示，根据userID post后返回的名字',
        gpa: 4.2,
        physical: 85,
        morality: {
          base: {
            self: 40,
            teacher: 0,
            total: 8
          },
          classScore: 11,
          domitory: {
            week: 0,
            prize: {
              name: 'xx',
              certi: true,
              score: 0
            },
            PaD: {
              praizeNum: 0,
              disPraizeNum: 0,
              certi: true,
              score: 0
            }
          },
          service: {      // (3) 履行责任服务奉献
            volunteerTime: 0,
            activities: [{
              id: 233333,
              name: '拾金不昧',
              certi: true
            }],
            score: 0
          },
          discipline: {
            items: [{            // （4)守纪分
              id: 234,
              name: '校级 通报通报表扬',
              describ: '接新生',
              certi: true
            }],
            score: 0
          }
        },
        innovation: {
          tech: [{
            id: 342355,
            name: '运河杯立项',
            job: '成员',
            score: 0,
            certi: true
          }],
          exam: [{
            id: 12351235,
            name: '英语六级',
            condition: 600,
            score: 0,
            certi: true
          }],
          academi: [{
            id: 235235123,
            name: 'asdgalk',
            condition: 'sdgnkl',
            score: 0,
            certi: true
          }]
        },
        socialPrac: {
          socialPractice: {
            socialPracTeam: '省级优秀团队',
            teamJob: '其他成员',
            score: 2,
            certi: true
          },
          socialService: [{
            name: '省级优秀志愿者',
            times: 1,
            scor: 0,
            certi: true
          }]
        },
        socialWork: {
          jobs: [{
            id: 2323,
            teamJob: '',
            teamPrize: '无',
            workTime: 1,
            workPerFirst: 0,
            workPerSecond: 0,
            workBaseScore: 0
          }]
        }
      },
      gpaDis: true,
      physicalDis: true,
      domitoryDis: true,
      domiPrizeDis: true,
      domiNumDis: 0
    }
  },
  created () {
    this.tableData = this.getStudents()
  },
  methods: {
    showDetials (row) {  // 展示dialog框
      this.test = row.user // 取到该行user id 用于post
      this.dialogVisible = true
    },

    haddleupdate () {},
    handleCurrentChange (val) {
        // console.log(val)
        // 点击分页按钮 调用函数获取数据
      this.getStudents(this.condition, this.currentPage * 10 - 10, this.limit, this.sortby)
    },

    handleSearch (title = '', content = '') {
      this.condition = {}
      if (!content) { // 空的搜索条件就默认是搜索全部
        this.initializeSearch() // 初始化搜索条件
        this.getStudents({}, this.currentPage * 10 - 10, this.limit, this.sortby)
        return
      }
      if (title === 'user') {
        this.condition.user = content
      } else if (title === 'name') {
        this.condition.name = content
      }
      this.initializeSearch()
      this.getStudents(this.condition, this.skipto, this.limit, this.sortby)
    },

    getStudents (condition = {}, skipto = 0, limit = 10, sortby = '-_id') {
      this.StudentsLoading = true
      axios.post('/teacher/getStuUploadInfo', {
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
            this.tableData = response.data.statusInfo.stuArr || undefined
            this.totalPage = response.data.statusInfo.countUser || 0
            this.StudentsLoading = false
            // this.$notify({
            //   title: '成功',
            //   message: '更新成功',
            //   type: 'success'
            // })
          })
          .catch(error => {
            // this.loading = false
            console.log('fail' + error)
            this.$notify.error({
              title: '错误',
              message: '网络连接错误,请检查网络状态或联系管理员.'
            })
          })
    },
    juageInfo (bool) {
      if (bool) {
        return '审核不通过'
      } else {
        return '取消错误判定'
      }
    },
    // 初始化分页参数
    initializeSearch () {
      this.totalPage = 0
      this.currentPage = 1
      this.skipto = 0 // 翻页参数
      this.limit = 10 // 翻页参数
      this.sortby = '-_id' // 排序参数
    }
  }
}
</script>

<style scoped>
.h2 {
  margin-bottom: 16px;
  font-size: 16px;
}
.border {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  padding: 15px;
  margin-bottom: 25px;
  width: 90%;
}
.itemborder{
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  padding: 6px;
  margin-bottom: 12px;
  width: 90%;
}
.border, .itemborder:hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.top{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.pagination{
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
}
</style>