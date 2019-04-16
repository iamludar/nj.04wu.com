<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">     
      <el-input placeholder="输入要查询的ID" v-model="id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" prop="identity"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="listByID">搜索</el-button>
      <el-button type="primary" @click="selfCreat">添加本账户下级</el-button>
    </div>
    <tree-table :data="data" :columns="columns" border>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="huadleCreat(scope.row)">添加下级</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog :visible.sync="dialogPvVisible" title="添加用户">
      <el-form ref="form" :model="form" :rules="userRules" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.field_xingming"/>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.field_shenfenzhenghao"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.field_shoujihao"/>
        </el-form-item>
        <el-form-item label="登陆账号">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pass"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from '@/components/TreeTable'
import { getList, creat } from '@/api/table'
import Qs from 'qs'
import { getUid } from '@/utils/auth' // 验权
import { validatIdentity } from '@/utils/validate'
export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      id: '',
      dialogPvVisible: false,
      userRules: {
        identity: [{ required: true, trigger: 'blur' }]
      },
      form: {
        name: '',
        pass: '',
        field_xingming: '',
        field_shoujihao: '',
        field_shenfenzhenghao: '',
        field_shangji: ''
      },
      columns: [
        {
          text: '姓名',
          value: 'field_xingming',
          width: 600
        },
        {
          text: '身份证号',
          value: 'field_shenfenzhenghao'
        },
        {
          text: '手机号',
          value: 'field_shoujihao'
        },
        {
          text: '系统id',
          value: 'uid'
        }
      ],
      data: []
    }
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      this.listLoading = true
      getList(getUid()).then(response => {
        this.data = response
      })
    },
    listByID() {
      this.listLoading = true
      if(this.id==='' || this.id === 1 || this.id === '1'){
        this.$message({
          message: '搜索ID不能为空，不能为系统ID',
          type: 'warning'
        })
      }else{
        getList(this.id).then(response => {
          this.data = response
        })
      }
    },
    huadleCreat(row) {
      if (row.hasOwnProperty('children') && row.children.length === 2) {
        this.$message({
          message: '该用户下已有两个子账户，不能继续添加',
          type: 'warning'
        })
      } else {
        this.dialogPvVisible = true
        this.form.field_shangji = row.uid
      }
    },
    onSubmit() {
      creat(Qs.stringify(this.form)).then(response => {
        console.log(response)

        this.dialogPvVisible = false
        this.$message({
          message: '用户添加成功',
          type: 'success'
        })
        this.list()
        this.form = {}
      })
    },
    selfCreat() {
      if (this.data.length === 2) {
        this.$message({
          message: '该用户下已有两个子账户，不能继续添加',
          type: 'warning'
        })
      } else {
        this.dialogPvVisible = true
        this.form.field_shangji = getUid()
      }
    }
  }
}
</script>
