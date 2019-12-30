const path = require("path");
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  outputDir: "yydownload", // 构建输出目录
  assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: true, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  configureWebpack: config => {
    // webpack配置，值位对象时会合并配置，为方法时会改写配置
    if (debug) {
      // 开发环境配置
      config.devtool = "cheap-module-eval-source-map";
    }
  }
};
