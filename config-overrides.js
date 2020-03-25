const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra');
const theme = require('./antd-theme');
const path = require("path");

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: true,
    }),
    // fixBabelImports('import',{
    //     libraryName: '@babel/plugin-proposal-decorators',
    //     legacy: true,
    // }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: theme
    }),
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
    }),
    
    // (config)=>{ //暴露webpack的配置 config ,evn
    //   // 去掉打包生产map 文件
    //   // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
    //   if(process.env.NODE_ENV==="production") config.devtool=false;
    //   if(process.env.NODE_ENV!=="development") config.plugins = [...config.plugins,...myPlugin]
    //   //1.修改、添加loader 配置 :
    //   // 所有的loaders规则是在config.module.rules(数组)的第二项
    //   // 即：config.module.rules[2].oneof  (如果不是，具体可以打印 一下是第几项目)
    //   // 修改 sass 配置 ，规则 loader 在第五项(具体看配置)
    //   const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
    //   loaders[5].use.push({
    //     // test: '/\.(png|jpe?g|gif|svg|mp4(\?.*)?$/)',
    //     loader: 'url-loader',
    //     options: {
    //         esModule: false
    //     }
    // })
   
       
    //   return config
    // }
   
  );