<template>
    <div>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action='upPath'
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error='handleError'
        :file-list="fileList"
        list-type="picture"
        :auto-upload="false"
        :name='upName'>
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click.prevent="upload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    upPath: String,
    upName: String
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    handleError (err, file, fileList) {
      console.log('fail ' + err)
    },
    upload () {
      let formData = new FormData()
      let fileValue = document.querySelector('.el-upload .el-upload__input')
      for (let i = 0; i < fileValue.files.length; i++) {
        formData.append(this.upName, fileValue.files[i])
      }
      console.log('formData.......................')
      console.log(formData)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post(this.upPath, formData, config)
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

</style>