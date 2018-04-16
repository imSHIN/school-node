<template>
    <div class="border">
        <el-form>
            <el-form-item label="英语四六级">
                <el-select v-model="CET" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span>分数：</span>
                <el-input-number v-model="cetScore" :min="0" :max="710"></el-input-number>
            </el-form-item>
            <el-form-item></el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      options: [
        {
          value: '英语4级',
          label: '英语4级'
        },
        {
          value: '英语6级',
          label: '英语6级'
        }
      ],
      CET: '英语4级',
      cetScore: 0,
      computerExamArr: [],
      englishExamArr: []
    }
  }
}
</script>

<style scoped>

</style>