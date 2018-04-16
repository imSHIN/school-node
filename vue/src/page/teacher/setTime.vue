<template>
    <div class="border">
        <div class="border"><h1>{{theYear}}</h1></div>
        <div class="border">
            <span class="demonstration">第一次申报时间:</span>
            <el-date-picker
            v-model="firstTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="border"> 
            <span class="demonstration">第二次申报时间:</span>
            <el-date-picker
            v-model="secondTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="border">
            <el-button type="primary" round @click="onSubmit">发布时间</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      theYear: new Date().getFullYear(),
      firstTime: '',
      secondTime: ''
    }
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
  },
  methods: {
    onSubmit () {
      const self = this
      axios.post('teacher/setTime/' + self.user._id, {
        firstTime: self.firstTime,
        secondTime: self.secondTime
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
</style>