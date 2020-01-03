<template>
  <div class="home">
    <div class="title" id="title">
      <h3>
        钧保 API 保单信息查询下载
        <a @click="getLogin" v-if="sessionId==''">点击登入</a>
        <span v-else>已登入</span>
      </h3>
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
            :disabled="sessionId==''"
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
          <el-select filterable clearable v-model="searchForm.companyName" placeholder="请选择保司名称">
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
          <el-select filterable clearable v-model="searchForm.merchantName" placeholder="请选择渠道名称">
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
          <el-select filterable clearable v-model="searchForm.proName" placeholder="请选择产品名称">
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
          <el-input placeholder="请输入保单号" v-model="searchForm.policyNo" class="input_with_select"></el-input>
        </el-form-item>
        <!-- 订单号筛选 -->
        <el-form-item label="订单号">
          <el-input placeholder="请输入订单号" v-model="searchForm.orderNo" class="input_with_select"></el-input>
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

        <el-button class="fr mr2" plain @click="getExcel" :disabled="!tableData">导出表格</el-button>
        <el-button class="fr mr" type="primary" plain @click="resetSel" :disabled="sessionId==''">重置</el-button>
        <el-button
          class="fr"
          type="primary"
          @click="submitSel"
          native-type="submit"
          :disabled="sessionId==''"
        >查询</el-button>
      </el-form>
    </div>
    <div class="show_wrap">
      <div class="no_data" v-show="!tableData">暂无数据</div>
      <el-table border :data="tableData" style="width: 100%" v-if="tableData">
        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="产品名称">
                <span>{{ props.row.productName }}</span>
              </el-form-item>
              <el-form-item label="保险公司名称" v-if="props.row.companyName">
                <span>{{ props.row.companyName }}</span>
              </el-form-item>
              <el-form-item label="渠道名称" v-if="props.row.merchantName">
                <span>{{ props.row.merchantName }}</span>
              </el-form-item>
              <el-form-item label="保单地址" v-if="props.row.epolicyUrl">
                <a :href="props.row.epolicyUrl" target="_epolicy" class="epolicy_url">点击跳转</a>
              </el-form-item>
              <el-form-item class="insure_result" label="投保结果" v-if="props.row.insureResult">
                <span>{{ props.row.insureResult }}</span>
              </el-form-item>
              <el-form-item label="失败信息" v-if="props.row.errorMsg">
                <span>{{ props.row.errorMsg }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="policyNo" label="保单号" min-width="170"></el-table-column>
        <el-table-column prop="merchantOrderNo" label="渠道订单号" min-width="160"></el-table-column>
        <el-table-column prop="premium" label="保费" width="80"></el-table-column>
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
        <el-table-column prop="insureName" label="被保人" width="100"></el-table-column>
        <el-table-column prop="insureMobile" label="被保人电话" width="110"></el-table-column>
        <el-table-column label="保单创建时间" width="155">
          <template
            slot-scope="scope"
          >{{ $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column label="保单生效时间" width="155">
          <template
            slot-scope="scope"
          >{{ $moment(scope.row.effectiveDate).format("YYYY-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column label="保单失效时间" width="155">
          <template
            slot-scope="scope"
          >{{ $moment(scope.row.expireDate).format("YYYY-MM-DD HH:mm:ss") }}</template>
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
    <el-dialog title="登入" :visible.sync="dialogFormVisible" center width="30%" @close="closeDialog">
      <el-form
        :model="formLogin"
        label-width="80px"
        :rules="rules"
        @submit.native.prevent
        ref="formLogin"
      >
        <el-form-item label="邮箱">
          xiaolin@junbaob2b.com
          <a class="email_code" @click="getCode" v-if="canGetCode">点击获取验证码</a>
          <span class="email_code_span" v-else>正在获取中...</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="formLogin.code" placeholder="请输入验证码" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmLogin" native-type="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canGetCode: true,
      sessionId: "",
      rules: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]{4}$/,
            message: "验证码格式不正确",
            trigger: "blur"
          }
        ]
      },
      formLogin: { code: "" },
      dialogFormVisible: false,
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 10, // 总数
        page_size: 10, // 1页显示多少条
        page_sizes: [10, 20, 50, 100], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
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
    if (sessionStorage.sessionId) {
      this.sessionId = sessionStorage.sessionId;
      this.getOptions();
    }
  },

  methods: {
    getCode() {
      this.canGetCode = false;
      this.$axios.post("/login/sendEmail").then(res => {
        if (res.status == 200 && res.data.code == 200) {
          this.$message.success("发送成功");
          this.canGetCode = true;
        } else {
          this.$message.error(res.data.msg);
          this.canGetCode = true;
        }
      });
    },
    closeDialog() {
      this.$refs["formLogin"].resetFields();
    },
    confirmLogin() {
      this.$refs["formLogin"].validate(valid => {
        if (valid) {
          this.$axios
            .get(`/login?verifyCode=${this.formLogin.code}`)
            .then(res => {
              if (res.status == 200 && res.data.code == 200) {
                this.sessionId = res.data.data;
                sessionStorage.setItem("sessionId", res.data.data);
                this.title = "已登入";
                this.dialogFormVisible = false;
                this.getOptions();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
    getLogin() {
      this.dialogFormVisible = true;
    },
    getExcel() {
      if (this.tableData && this.tableData.length > 0) {
        window.open(
          `${this.$axios.defaults.baseURL}policyList/downLoad?dataSource=${this.searchFormCopy.databaseValue}&pageSize=${this.paginations.page_size}&pageNum=${this.paginations.page_index}&merchantOrderNo=${this.searchFormCopy.orderNo}&policyNo=${this.searchFormCopy.policyNo}&createTimeEnd=${this.searchFormCopy.end}&productCode=${this.searchFormCopy.proName}&companyCode=${this.searchFormCopy.companyName}&merchantNo=${this.searchFormCopy.merchantName}&createTimeStart=${this.searchFormCopy.start}&sessionId=${this.sessionId}`
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
    changeDatabase(val) {
      this.searchFormCopy = this.searchForm = {
        databaseValue: val,
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
      this.getOptions();
    },
    postSearchCon() {},
    getOptions() {
      this.$axios
        .get(
          `/product/list?sessionId=${this.sessionId}&dataSource=${this.searchForm.databaseValue}`
        )
        .then(res => {
          if (res.status == 200 && res.data.code == "200") {
            this.proOptions = res.data.data.productList;
            this.companyOptions = res.data.data.companyList;
            this.merchantOptions = res.data.data.merchantList;
            this.getTableData();
          } else {
            if (res.data.code == "10000") {
              this.sessionId = "";
              this.tableData = null;
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
            } else {
              this.$message.error(res.data.msg);
            }
          }
        });
    },
    getTableData() {
      this.$axios
        .get(
          `/policy/list?dataSource=${this.searchFormCopy.databaseValue}&pageSize=${this.paginations.page_size}&pageNum=${this.paginations.page_index}&merchantOrderNo=${this.searchFormCopy.orderNo}&policyNo=${this.searchFormCopy.policyNo}&createTimeEnd=${this.searchFormCopy.end}&productCode=${this.searchFormCopy.proName}&companyCode=${this.searchFormCopy.companyName}&merchantNo=${this.searchFormCopy.merchantName}&createTimeStart=${this.searchFormCopy.start}&sessionId=${this.sessionId}`
        )
        .then(res => {
          if (res.status == 200 && res.data.code == "200") {
            this.tableData = res.data.data.policyList;
            this.paginations.total = res.data.data.total;
          } else {
            if (res.data.code == "10000") {
              this.sessionId = "";
              this.tableData = null;
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
            } else {
              this.$message.error(res.data.msg);
            }
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
    a {
      cursor: pointer;
      font-size: 14px;
      float: right;
    }
    span {
      font-size: 14px;
      float: right;
    }
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
  .no_data {
    padding-bottom: 15px;
    font-size: 14px;
    color: #606266;
  }
  table {
    .el-table__expanded-cell {
      padding: 10px 30px 20px;
    }
  }
  .demo-table-expand {
    text-align: left;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    height: 28px;
  }
  .demo-table-expand .insure_result {
    height: initial;
    .el-form-item__content {
      max-width: 1050px;
      word-break: break-all;
      line-height: 20px;
      margin-top: 8px;
    }
  }
  .email_code {
    color: #409eff;
    cursor: pointer;
    margin-left: 40px;
  }
  .email_code_span {
    margin-left: 40px;
    color: #909399;
  }
  .epolicy_url {
    color: #409eff;
    cursor: pointer;
    text-decoration: none;
  }
  .el-dialog--center .el-dialog__body {
    padding-bottom: 10px;
  }
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
  }
}
</style>
