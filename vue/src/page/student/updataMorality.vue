  <template>
    <div>
      <div class="mtitle">
        <p ><span><i class="el-icon-tickets"></i> 个人基础素质-德育素质</span></p>
      </div>      
      <div class="border">
        <dtable @upgrade="changeD1GradeSutednt" :d1GradeArray="d1GradeArray"></dtable>
        <el-button type="primary" round @click="onSelfAssm">提交</el-button> <!-- 提交自我评价按钮，因为这个表格可能要在其他地方用 所以提交按钮我就放在父组件这了 -->     
        <el-tag type='success' v-show="ishow">已提交</el-tag>
        <span>返回成绩：{{totalSelfAssScore}}</span>
      </div> 
      <div class="border">
        <dtwo></dtwo>      
      </div>
    </div>
    
  </template>
  
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import dtable from './components/d1table.vue'
import dtwo from './components/d2.vue'
export default {
  data () {
    return {
      ishow: false,    // 提交后tag标签显示的（v-show） bool值
      d1GradeArray: [0, 0, 0, 0, 0, 0, 0, 0],
      totalSelfAssScore: 0
    }
  },
  components: {
    dtable, dtwo
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
  },
  methods: {
    changeD1GradeSutednt (array) {
      this.d1GradeArray = array
    },
    onSelfAssm () {
      const self = this
      axios.post('user/morality/uploadSelfAssessment/' + self.user._id, {
        selfAssessment: self.d1GradeArray
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
         this.totalSelfAssScore = response.data.totalSelfAssScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
         this.ishow = true
       }).catch(error => {
         console.log('fail ' + error)
       })
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
}
.border:hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.mtitle{
  margin-bottom: 30px;
  color: #303133;
  font-size: 20px;
}
</style>