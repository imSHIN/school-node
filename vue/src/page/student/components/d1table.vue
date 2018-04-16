<template>
<!-- 尝试过用 组件 或 表单，子组件父组件单选框值难以绑定，el表单同样的问题 之后再简化代码 暂时先这样吧  -->
      <div>
       <div class="tableTitle">
         <P class="h1">一.学生德育素质基本评定分（D1）（满分64分）学生自评（20%）</p>
         <p>(A:8分，B：7分，C:6分，D：5分)</p>
         <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="各项指标描述（点击查看）">
            <div class="tableContent">政治思想：热爱祖国，拥护中国共产党的领导，自觉践行社会主义核心价值观；遵守大学生行为准则和社会公德，积极参与学校、学院组织的各类思想政治教育主题活动。</div>
            <div class="tableContent">团结协作：具有主人翁精神和强烈的集体责任感、荣誉感和纪律性，以学校、学院和班集体的利益为重，积极参与各项集体活动，为集体的发展做出贡献。 有良好的团结协作精神，同学关系融洽。</div>             
            <div class="tableContent">遵章守纪：自觉遵守法律法规和学校的各项规章制度（爱护公物、上课出勤、寝室规章、实验室安全、日常行为等校纪校规遵守情况）。</div> 
            <div class="tableContent">服务奉献：有社会责任感，愿意为社会公共事业贡献力量，积极组织并参加志愿服务、社会公益、社会工作、社会实践，无偿献血等；乐于助人，服务同学、帮助他人。</div>            
            <div class="tableContent">履行责任：有履行各种义务的自律意识和人格素质；自觉、认真地履行各项义务和职责（寝室公约、个人卫生，党员责任、学生干部责任等）。</div>             
            <div class="tableContent">诚实守信：以诚待人、言必信、行必果，做到学术诚信、考试诚信，交费诚信，借贷诚信，交往诚信等。</div>         
            <div class="tableContent">文明礼仪：尊敬师长，尊重同学，举止大方，待人热情，说话文明。</div>
          </el-collapse-item>         
        </el-collapse>
       </div>
       <el-form label-width="80px">
        <el-form-item label="政治思想:">
            <el-radio-group v-model="radios[0]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="团结协作:">
            <el-radio-group v-model="radios[1]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="遵章守纪:">
            <el-radio-group v-model="radios[2]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="服务奉献:">
            <el-radio-group v-model="radios[3]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="阳光心态:">
            <el-radio-group v-model="radios[4]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="履行责任:">     
            <el-radio-group v-model="radios[5]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="诚实守信:">
            <el-radio-group v-model="radios[6]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="文明礼仪:">
            <el-radio-group v-model="radios[7]">
              <el-radio :label="8">A</el-radio>
              <el-radio :label="7">B</el-radio>
              <el-radio :label="6">C</el-radio>
              <el-radio :label="5">D</el-radio>
            </el-radio-group>
        </el-form-item>
       </el-form>
       <div>
         <p>预计成绩：{{d1Grade}}</p>
       </div>
      </div>
</template>

<script>
export default {
  data () {
    return {
      radios: [5, 5, 5, 5, 5, 5, 5, 5],
      index: 0
    }
  },
  computed: {
    d1Grade () {
      var sum = 0
      for (let i = 0; i < 8; i++) {
        sum += this.radios[i]
      }
      this.$emit('upgrade', this.radios)
      return sum
    }
  },
  components: {
  }
}
</script>

<style scoped>
.tableContent{
  width: 90%
}
.tableTitle{
  margin-bottom: 20px;
}
.tableTitle .h1{
  font-size: 18px;
  text-align: center;
}

</style>