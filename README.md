# yummyFood

## React技术栈+antd+express+mongodb 实现 仿下厨房的美食食谱类webapp（毕设进行中）


## react项目目录结构优化

|——src
|————|common //公共组件目录，如http.js、cookie.js等
|————|components //基础组件、业务组件、业务代码抽象出的一些基础类，例如每个页面可以在此目录下建立一个文件存放相关组件。
|————|layouts //布局相关组件及其样式文件，如header.js、footer.js、menu.js等
|————|styles //公共样式文件
|————|static //公共的静态资源文件，如公共的图片资源文件等
|————|views //页面入口文件，可与comonents中的页面组件对应

1、安装navicat
2、安装mongodb 

mongod --dbpath C:\Program Files\MongoDB\Server\4.2\data\db --logpath C:\Program Files\MongoDB\Server\4.2\log\mongo.log --logappend --serviceName MongoDB --install

mongod --config C:\Program Files\MongoDB\Server\4.2\mongo.config --install --serviceName "MongoDB"

3、创建react和express项目 
https://blog.csdn.net/weixin_33937778/article/details/88691804
https://segmentfault.com/a/1190000020086440

4、连接数据库

5、项目目录搭建，Styled-Components 与 Reset.css 的结合使用

6、使用 iconfont 嵌入头部图标

7、 使用 React-Redux 进行应用数据的管理
    使用 combineReducers 完成对数据的拆分管理
    actionCreators 与 constants 的拆分
    使用 Immutable.js 来管理store中的数据
    使用 redux-immutable 统一数据格式

8、React中使用路由