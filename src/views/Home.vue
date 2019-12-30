<template>
  <div class="home">
    <div class="search_wrap">
      <el-form
        class="search_right"
        @submit.native.prevent
        label-width="72px"
        :model="searchForm"
        inline
      >
        <!-- 数据库筛选 -->
        <el-form-item label="数据来源">
          <el-select
            v-model="searchForm.databaseValue"
            placeholder="请选择查询的数据库"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in databaseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 保司名称筛选 -->
        <el-form-item label="保司名称">
          <el-select
            v-model="searchForm.companyName"
            placeholder="请选择保司名称"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in proOptions"
              :key="item.companyCode"
              :label="item.companyName"
              :value="item.companyCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 渠道名称筛选 -->
        <el-form-item label="渠道名称">
          <el-select
            v-model="searchForm.merchantName"
            placeholder="请选择渠道名称"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in proOptions"
              :key="item.companyCode"
              :label="item.companyName"
              :value="item.companyCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 产品名称筛选 -->
        <el-form-item label="产品名称">
          <el-select
            v-model="searchForm.proName"
            placeholder="请选择产品名称"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in proOptions"
              :key="item.junbaoCode"
              :label="item.productName"
              :value="item.junbaoCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 保单号筛选 -->
        <el-form-item label="保单号">
          <el-input
            placeholder="请输入保单号"
            v-model="searchForm.policyNo"
            class="input_with_select"
          >
          </el-input>
        </el-form-item>
        <!-- 订单号筛选 -->
        <el-form-item label="订单号">
          <el-input
            placeholder="请输入订单号"
            v-model="searchForm.orderNo"
            class="input_with_select"
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="postSearchCon" native-type="submit"
          >查询</el-button
        >
        <el-button
          type="primary"
          plain
          @click="postSearchCon"
          native-type="submit"
          >重置</el-button
        >
        <el-button
          plain
          @click="postSearchCon"
          native-type="submit"
          :disabled="tableData"
          >导出表格</el-button
        >
      </el-form>
    </div>
    <div class="show_wrap">123</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: null,
      searchForm: {
        databaseValue: "travel",
        proName: "",
        policyNo: "",
        companyName: "",
        merchantName: "",
        orderNo: ""
      },
      proOptions: [{ productName: "", junbaoCode: "" }],
      companyOptions: [{ companyCode: "", companyName: "" }],
      merchantOptions: [{ merchantName: "", merchant: "" }],
      databaseOptions: [
        { value: "accom", label: "住宿api系统" },
        { value: "travel", label: "旅行api系统" }
      ]
    };
  },
  methods: {
    changeDatabase(val) {},
    postSearchCon() {},
    getOptions() {
      this.$axios.get(`/product/list?dataSource=${databaseValue}`).then(res => {
        if (res.status == 200 && res.data.code == 200) {
          this.proOptions = res.data.data.ProductList;
          this.companyOptions = res.data.data.ProductList;
          this.merchantOptions = res.data.data.merchantList;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getTableData() {}
  }
};
</script>
<style lang="less">
.home {
  text-align: left;
  .search_wrap {
    background-color: #fff;
    width: 100%;
    box-shadow: 0 1px 2px #ddd;
    position: fixed;
    z-index: 33;
    top: 0;
    left: 0;
    padding-top: 20px;
    padding-left: 40px;
    overflow: hidden;
    box-sizing: border-box;
    .el-form-item__content {
      width: 214px;
    }
  }
  .show_wrap {
    position: relative;
    z-index: -1;
    padding-left: 40px;
    top: 160px;
  }
}
</style>
