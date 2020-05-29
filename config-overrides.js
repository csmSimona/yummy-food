const { override, fixBabelImports, addLessLoader, addWebpackAlias, overrideDevServer } = require('customize-cra');
const theme = require('./antd-theme');
const path = require("path");

module.exports = {
    webpack: override(
        // usual webpack plugin
        fixBabelImports('import', {
            libraryName: 'antd-mobile',
            style: true,
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: theme
        }),
        addWebpackAlias({
            ["@"]: path.resolve(__dirname, "src")
        }),
    ),
    devServer: overrideDevServer((config) => {
        config.disableHostCheck = true
        return config
    }),
};
