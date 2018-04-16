<template>
    <div class="GPA">
     <p class="title"><span><i class="el-icon-tickets"></i> 个人基础素质-智育素质</span></p> 
     <div class="border">        
        <el-form>
            <el-form-item label="平均绩点" v-on:submit.prevent>
                <el-input-number v-model="num" @change="handleChange" :min="0" :max="5" :step="0.1" :disabled="submit" @keyup.enter="onSubmit"></el-input-number>
                <input id="hiddeninput" type="text"> <!-- 防止回车刷新页面，@key.enter.prevent不管用好奇怪 -->
                <el-button type="primary" round @click="onSubmit" :disabled="submit">提交</el-button>
                <el-button type="primary" round @click="onAmend">修改</el-button>
            </el-form-item>
            <el-form-item label="总分">
              <p>{{GPAScore}}</p>
            </el-form-item>
        </el-form>
     </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      num: 0,
      GPAScore: 0,
      submit: false
    }
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
    // grade () {
    //   if (this.num < 1) {
    //     return 0
    //   }
    //   return this.num * 10 + 50
    // }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    },
    onSubmit () {
      this.submit = true
      const self = this
      axios.post('/user/uploadGPA/' + self.user._id, {
        GPA: self.num
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
         this.GPAScore = response.data.GPAScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
       })
       .catch(error => {
         console.log('fail ' + error)
       })
      console.log('已提交' + this.grade)
    },
    onAmend () {
      this.submit = false
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
.title {
  color: #303133;
  font-size: 20px;
  margin-bottom: 20px;
}
#hiddeninput{
    display: none;
}
</style>