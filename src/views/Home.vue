<template>
  <div class="home">
    <div class="title" id="title">
      <h3>钧保 API 保单信息查询下载</h3>
    </div>
    <div class="search_wrap" id="search_wrap">
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
            filterable
            clearable
            v-model="searchForm.companyName"
            placeholder="请选择保司名称"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.companyCode"
              :label="item.companyName"
              :value="item.companyCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 渠道名称筛选 -->
        <el-form-item label="渠道名称">
          <el-select
            filterable
            clearable
            v-model="searchForm.merchantName"
            placeholder="请选择渠道名称"
            @change="changeDatabase"
          >
            <el-option
              v-for="item in merchantOptions"
              :key="item.merchantCode"
              :label="item.merchantName"
              :value="item.merchantCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 产品名称筛选 -->
        <el-form-item label="产品名称">
          <el-select
            filterable
            clearable
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
          ></el-input>
        </el-form-item>
        <!-- 订单号筛选 -->
        <el-form-item label="订单号">
          <el-input
            placeholder="请输入订单号"
            v-model="searchForm.orderNo"
            class="input_with_select"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间" id="timePick">
          <el-date-picker
            v-model="searchForm.createdTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getStartTime"
          ></el-date-picker>
        </el-form-item>

        <el-button class="fr mr2" plain @click="getExcel" :disabled="!tableData"
          >导出表格</el-button
        >
        <el-button class="fr mr" type="primary" plain @click="resetSel"
          >重置</el-button
        >
        <el-button
          class="fr"
          type="primary"
          @click="submitSel"
          native-type="submit"
          >查询</el-button
        >
      </el-form>
    </div>
    <div class="show_wrap">
      <div v-show="showNodata">暂无数据</div>
      <el-table border :data="tableData" style="width: 100%" v-if="tableData">
        <el-table-column
          prop="policyNo"
          label="保单号"
          min-width="170"
        ></el-table-column>
        <el-table-column
          prop="merchantOrderNo"
          label="渠道订单号"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="premium"
          label="保费"
          width="80"
        ></el-table-column>
        <el-table-column label="保单状态" width="80">
          <template slot-scope="scope">
            {{
              scope.row.status == 5
                ? "已核保"
                : scope.row.status == 10
                ? "已承保"
                : scope.row.status == 20
                ? "已生效"
                : scope.row.status == 25
                ? "退保中"
                : scope.row.status == 30
                ? "已退保"
                : scope.row.status == 40
                ? "已到期"
                : scope.row.status == 45
                ? "理赔中"
                : scope.row.status == 50
                ? "已理赔"
                : scope.row.status == 60
                ? "承保失败"
                : "核保失败"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="insureName"
          label="被保人"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="insureMobile"
          label="被保人电话"
          width="110"
        ></el-table-column>
        <el-table-column label="保单创建时间" width="155">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="保单生效时间" width="155">
          <template slot-scope="scope">
            {{ $moment(scope.row.effectiveDate).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="保单失效时间" width="155">
          <template slot-scope="scope">
            {{ $moment(scope.row.expireDate).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="tableData">
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 10, // 总数
        page_size: 10, // 1页显示多少条
        page_sizes: [10, 20, 50, 100], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      showNodata: false,
      tableData: null,
      searchForm: {
        databaseValue: "travel",
        proName: "",
        policyNo: "",
        companyName: "",
        merchantName: "",
        orderNo: "",
        createdTime: "",
        start: "",
        end: ""
      },
      searchFormCopy: {
        databaseValue: "travel",
        proName: "",
        policyNo: "",
        companyName: "",
        merchantName: "",
        orderNo: "",
        createdTime: "",
        start: "",
        end: ""
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
  created() {
    this.getOptions();
  },

  methods: {
    getExcel() {
      if (this.tableData && this.tableData.length > 0) {
        window.open(
          `${this.$axios.defaults.baseURL}policyList/downLoad?dataSource=${this.searchFormCopy.databaseValue}&pageSize=${this.paginations.page_size}&pageNum=${this.paginations.page_index}&merchantOrderNo=${this.searchFormCopy.orderNo}&policyNo=${this.searchFormCopy.policyNo}&createTimeEnd=${this.searchFormCopy.end}&productCode=${this.searchFormCopy.proName}&companyCode=${this.searchFormCopy.companyName}&merchantNo=${this.searchFormCopy.merchantName}&crateTimeStart=${this.searchFormCopy.start}`
        );
      }
    },
    setPaginations() {
      this.paginations.page_index = 1;
      this.paginations.page_size = 10;
    },
    resetSel() {
      this.searchFormCopy = this.searchForm = {
        databaseValue: "travel",
        proName: "",
        policyNo: "",
        companyName: "",
        merchantName: "",
        orderNo: "",
        createdTime: "",
        start: "",
        end: ""
      };
      this.setPaginations();
      this.getTableData();
    },
    submitSel() {
      this.searchFormCopy = JSON.parse(JSON.stringify(this.searchForm));
      this.setPaginations();
      this.getTableData();
    },
    handleCurrentChange(page) {
      this.paginations.page_index = page;
      this.getTableData();
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.getTableData();
    },
    changeDatabase(val) {},
    postSearchCon() {},
    getOptions() {
      this.$axios
        .get(`/product/list?dataSource=${this.searchForm.databaseValue}`)
        .then(res => {
          if (res.status == 200 && res.data.code == "0000") {
            this.proOptions = res.data.data.productList;
            this.companyOptions = res.data.data.companyList;
            this.merchantOptions = res.data.data.merchantList;
            this.getTableData();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    getTableData() {
      this.$axios
        .get(
          `/policy/list?dataSource=${this.searchFormCopy.databaseValue}&pageSize=${this.paginations.page_size}&pageNum=${this.paginations.page_index}&merchantOrderNo=${this.searchFormCopy.orderNo}&policyNo=${this.searchFormCopy.policyNo}&createTimeEnd=${this.searchFormCopy.end}&productCode=${this.searchFormCopy.proName}&companyCode=${this.searchFormCopy.companyName}&merchantNo=${this.searchFormCopy.merchantName}&crateTimeStart=${this.searchFormCopy.start}`
        )
        .then(res => {
          if (res.status == 200 && res.data.code == "0000") {
            this.tableData = res.data.data.policyList;
            this.paginations.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    getStartTime(val) {
      if (val) {
        this.searchForm.start = this.$moment(val[0]).format("YYYY-MM-DD");
        this.searchForm.end = this.$moment(val[1]).format("YYYY-MM-DD");
      } else {
        this.searchForm.start = "";
        this.searchForm.end = "";
      }
    }
  }
};
</script>
<style lang="less">
.home {
  text-align: left;
  width: 1250px;
  margin: 0 auto;
  .title {
    width: 1250px;
    background-color: #66b1ff;
    padding: 16px 20px;
    box-sizing: border-box;
    color: #fff;
  }
  .search_wrap {
    width: 1250px;
    box-shadow: 0 1px 2px #ddd;
    padding-top: 20px;
    padding-left: 18px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    .el-form-item__content {
      width: 164px;
    }
  }
  .show_wrap {
    margin-top: 15px;
    padding: 18px;
    padding-bottom: 0;
    top: 208px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
  }
  #timePick {
    .el-input__inner {
      width: 256px;
    }
  }
  .fr {
    float: right;
  }
  .mr {
    margin-right: 10px;
  }
  .mr2 {
    margin-right: 20px;
  }
  .el-table {
    td,
    th {
      text-align: center;
    }
  }
  .pagination {
    height: 56px;
    float: right;
    margin-top: 15px;
    .el-pagination button,
    .el-pagination span:not([class*="suffix"]) {
      line-height: 32px;
    }

    .el-pagination button {
      border: 1px solid #ddd;
      margin-right: 5px;
      border-radius: 5px;
      height: 32px;
      line-height: 32px;
      font-weight: 400;
      padding: 0;
      &:hover {
        color: #fff;
        background-color: #409eff;
      }
    }
    li.active + li {
      border-left: 1px solid #ddd;
    }
    li {
      border: 1px solid #ddd;
      margin-right: 5px;
      border-radius: 5px;
      height: 32px;
      line-height: 32px;
      font-weight: 400;
      &.active,
      &:hover {
        color: #fff;
        background-color: #409eff;
      }
    }
    .el-pagination__jump {
      margin-left: 12px;
    }
  }
}
</style>
