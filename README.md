# yummyFood

## React技术栈+antd+express+mongodb 实现 仿下厨房的美食食谱类webapp（毕设进行中）

1、安装navicat
2、安装mongodb 

mongod --dbpath C:\Program Files\MongoDB\Server\4.2\data\db --logpath C:\Program Files\MongoDB\Server\4.2\log\mongo.log --logappend --serviceName MongoDB --install

mongod --config C:\Program Files\MongoDB\Server\4.2\mongo.config --install --serviceName "MongoDB"

3、创建react和express项目 https://blog.csdn.net/weixin_33937778/article/details/88691804

## react项目目录结构优化

|——src
|————|common //公共组件目录，如http.js、cookie.js等
|————|components //基础组件、业务组件、业务代码抽象出的一些基础类，例如每个页面可以在此目录下建立一个文件存放相关组件。
|————|layouts //布局相关组件及其样式文件，如header.js、footer.js、menu.js等
|————|styles //公共样式文件
|————|static //公共的静态资源文件，如公共的图片资源文件等
|————|views //页面入口文件，可与comonents中的页面组件对应