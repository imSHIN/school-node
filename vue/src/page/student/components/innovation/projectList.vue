<template>
    <div class="border">
        <p class="h2">添加经历</p>     
        <el-button type="primary" plain @click="addAProject">添加一个立项、获奖项目、学科竞赛等</el-button>
        <div v-for="item in lists" :key="item.index">
          <div class="border">
          <el-form>
            <el-form-item label="输入获奖名称">
              <el-input  v-model="item.name" placeholder="请输入获奖名称"></el-input>
            </el-form-item>
            <el-form-item label="上传证明">
              <el-upload
               class="upload-demo"
               action="https://jsonplaceholder.typicode.com/posts/"
               multiple>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>     
          </el-form-item>
          </el-form>
          
          <el-button type="primary" round @click="removeItem(item.index)">删除该项目</el-button>
         </div>
        </div>
        <el-button type="primary" round @click="onLists">提交</el-button>
    </div>
</template>

<script>
var listNum = 0
export default {
  data () {
    return {
      lists: []
    }
  },
  components: {
  },
  methods: {
    onLists () {
      console.log(this.lists)
    },
    addAProject () {
      this.lists.push({
        index: listNum++,
        name: '',
        file: []
      })
    },
    removeItem (idTORemove) {
      this.lists = this.lists.filter(item => {
        return item.index !== idTORemove
      })
    }
    // changeItem (item) {
    //   for (var i in this.lists) {
    //     if (i.index === item.index) {
    //       i.name = item.name
    //       i.file = item.file
    //     }
    //   }
    //   console.log(this.lists[0])
    // }
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
.h2 {
  margin-bottom: 16px;
  font-size: 16px;
}
</style>