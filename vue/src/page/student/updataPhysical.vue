<template>
    <div class="physicalGrade"> 
     <p class="title"><span><i class="el-icon-tickets"></i> 个人基础素质-身体素质</span></p>   
      <div class="border">           
         <el-form ref="form" :model="form" label-width="160px">
            <el-form-item label="上半学年体育成绩">
                <el-input-number v-model="form.num1" @change="handleChange" :min="0" :max="100" :disabled="form.submit"></el-input-number>
            </el-form-item>
            <el-form-item label="下半学年体育成绩">
                <el-input-number v-model="form.num2" @change="handleChange" :min="0" :max="100" :disabled="form.submit"></el-input-number>
            </el-form-item>
            <el-form-item label="学年平均体育成绩">
                <p>{{form.averagePhyScore}}</p>
            </el-form-item>
            <el-form-item >
                 <el-button type="primary" round @click="onSubmit" :disabled="form.submit">提交</el-button>
                 <el-button type="primary" round @click="onAmend">修改</el-button>
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
      form: {
        num1: 0,
        num2: 0,
        averagePhyScore: 0,
        submit: false
      }
    }
  },
  computed: {
    ...mapGetters({user: 'UserInfo'})
    // physicalGrade: function () {
    //   return (this.form.num1 + this.form.num2) / 2
    // }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    },
    onSubmit () {
      this.form.submit = true
      const self = this
      axios.post('/user/uploadPhysical/' + self.user._id, {
        fsPhysicalScore: self.form.num1,
        ssPhysicalScore: self.form.num2
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
         this.form.averagePhyScore = response.data.averagePhyScore
         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
           confirmButtontext: '确定'
         })
       })
       .catch(error => {
         console.log('fail ' + error)
       })
    },
    onAmend () {
      this.form.submit = false
    }
  }
}
</script>

<style scoped>
.border{
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  padding: 20px;
  margin-bottom: 30px;
}
.border:hover{
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
}
.title{
  color: #303133;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>