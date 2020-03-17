const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const theme = require('./antd-theme');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: theme
    })
);