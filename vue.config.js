const path = require("path");
module.exports = {
  //基本路径
  // publicPath: process.env.NODE_ENV === 'production',
  publicPath: "./",
  outputDir: "apipreview",
  // 放置静态资源的地方 (js/css/img/font/...)
  assetsDir: "assets",
  //以多页模式构建应用程序。
  pages: undefined,
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  parallel: require("os").cpus().length > 1,
  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
  // lintOnSave: false,

  // 是否为生产环境构建生成 source map？这样打包的dist文件体积会很小（正式版）
  //为true带测试环境，提交会大很多
  productionSourceMap: false
};
