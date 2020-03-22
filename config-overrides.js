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
    })
);