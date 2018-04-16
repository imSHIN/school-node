<template>
    <div>
      <span>请提交证明材料，未提交默认改项目<span style="color:red">无效</span></span>
      <el-upload
        style="display:inline"
        ref="uploadme"
        action='filePath'
        accept=".png,.jpg"
        :on-success="handleSuccess"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        list-type="picture">
        <el-button size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    filePath: String,
    itemId: Number
  },
  data () {
    return {
      fileList: [],
      certiFileList: []
    }
  },
  methods: {
    handleError (err, file, fileList) {
      console.log('fail ' + err)
    },
    // upload () {
    //   let formData = new FormData()
    //   let fileValue = document.querySelector('.el-upload .el-upload__input')
    //   for (let i = 0; i < fileValue.files.length; i++) {
    //     formData.append(this.upName, fileValue.files[i])
    //   }
    //   console.log('formData.......................')
    //   console.log(formData)
    //   let config = {
    //     headers: {'Content-Type': 'multipart/form-data'}
    //   }
    //   axios.post(this.upPath, formData, config)
    //   .then(response => {
    //     if (response.data.status === 1) {
    //       this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '错误', {
    //         confirmButtontext: '确定'
    //       })
    //     } else if (response.data.status !== 0) {
    //       this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '发生未知错误', '错误', {
    //         confirmButtontext: '确定'
    //       })
    //     }
    //     this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
    //       confirmButtontext: '确定'
    //     })
    //   })
    // },
    handleSuccess (response) {
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
      console.log(response.data.statusInfo.message ? response.data.statusInfo.message : '')
    },
    handleChange (file, fileList) {
      console.log(file, fileList)
      this.certiFileList = fileList
      return true
    },
    handleRemove (file, fileList) {
      // axios.post(this.filePath, {delete: file.name})
      //     .then(response => {
      //       if (response.data.status === 1) {
      //         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '错误', {
      //           confirmButtontext: '确定'
      //         })
      //         return
      //       } else if (response.data.status !== 0) {
      //         this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '发生未知错误', '错误', {
      //           confirmButtontext: '确定'
      //         })
      //         return
      //       }
      //       this.$alert(response.data.statusInfo.message ? response.data.statusInfo.message : '', '成功', {
      //         confirmButtontext: '确定'
      //       })
      //     })
      this.$notify.info({
        title: '消息',
        message: '删除图片'
      })
    },
    beforeUpload (id) {                                                // 未提交材料提醒
      if (this.certiFileList.length === 0) {
        this.$alert('项目' + id + '未成功提交：未添加证明材料.请重新提交', '警告', {
          confirmButtontext: '确定'
        })
        console.log(this.fileList)
        return false
      }
    },
    submitMe () {
      // this.$refs.uploadme.submit()
      // let fileValue = document.querySelectorAll('.el-upload .el-upload__input')
      // console.log('submit', fileValue)
      // console.log(this.$refs.uploadme)

      let formData = new FormData()
      const files = this.certiFileList
      if (files.length === 0) {
        this.$alert('项目' + this.itemId + '\n未成功提交：未添加证明材料.请重新提交', '警告', {
          confirmButtontext: '确定'
        })
        return
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i].raw)
        console.log('+1', files[i].raw)
      }
      console.log('formData.......................')
      console.log(formData)

      // let fileValue = document.querySelector('.el-upload .el-upload__input')
      // for (let i = 0; i < fileValue.files.length; i++) {
      //   formData.append('file', fileValue.files[i])
      //   console.log(fileValue.files[i])
      // }
      // console.log('formData.......................')
      // console.log(formData)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.post(this.filePath, formData, config)
      .then(response => {
        if (response.data.status === 1) {
          this.$alert(response.data.statusInfo.message ? '项目' + this.itemId + response.data.statusInfo.message : '', '错误', {
            confirmButtontext: '确定'
          })
        } else if (response.data.status !== 0) {
          this.$alert(response.data.statusInfo.message ? '项目' + this.itemId + response.data.statusInfo.message : '项目' + this.itemId + '发生未知错误', '错误', {
            confirmButtontext: '确定'
          })
        }
        console.log('项目：' + this.itemId + '上传成功')
      })
    },

    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>