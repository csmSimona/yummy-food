# yummyFood

## React技术栈+antd+express+mongodb 实现 仿下厨房的美食食谱类webapp（毕设进行中）


## react项目目录结构优化

|——src

|————|utils //公共文件目录，如http.js、cookie.js等

|————|components //基础组件、业务组件、业务代码抽象出的一些基础类，例如每个页面可以在此目录下建立一个文件存放相关组件。

|————|styles //公共样式文件

|————|statics //公共的静态资源文件，如公共的图片资源文件等

|————|views //页面入口文件，可与comonents中的页面组件对应

1、安装navicat
2、安装mongodb 

mongod --dbpath C:\Program Files\MongoDB\Server\4.2\data\db --logpath C:\Program Files\MongoDB\Server\4.2\log\mongo.log --logappend --serviceName MongoDB --install

mongod --config C:\Program Files\MongoDB\Server\4.2\mongo.config --install --serviceName "MongoDB"

3、创建react和express项目 
https://blog.csdn.net/weixin_33937778/article/details/88691804
https://segmentfault.com/a/1190000020086440

4、连接数据库

5、封装axios

6、antd mobile   vscode cssrem插件 px转rem

7、项目目录搭建，Styled-Components 与 Reset.css 的结合使用

8、使用 iconfont 嵌入头部图标

9、React中使用路由

10、 使用 React-Redux 进行应用数据的管理
    使用 combineReducers 完成对数据的拆分管理
    actionCreators 与 constants 的拆分
    使用 Immutable.js 来管理store中的数据
    使用 redux-immutable 统一数据格式


微信组装url
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect

https://0a78b083.ngrok.io

encodeURIComponent('http://88841d2f.ngrok.io')

https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=http%3A%2F%2F88841d2f.ngrok.io&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect


https://open.weixin.qq.com/connect/oauth2/authorize?
        appid=APPID&
        redirect_uri=ENCODE(URL)&
        response_type=code&
        scope=snsapi_base&
        state=state#wechat_redirect

https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx920205c512c66458&
redirect_uri=http://csm.frp.ngarihealth.com/ehealth-weixin/wx/mp/wx920205c512c66458/index.html&response_type=code&
scope=snsapi_base&
state=STATE&
connect_redirect=1&uin=OTc5MTgwMDUz&key=f3d551d2f0f428bea01e90ceeda723104df0ab96a3f7f1ca2107d7f1a2bf81e5a2376835e46677eef7dee381400442f3&pass_ticket=elXdTex5y7942nLcwg8rqBNEcD8ToAaOs0B4ipZz2zCqrrtRQgng+0FbW4F2kkVzIgfGJVg+ZeFe3/cCIRdrIQ==

ngrok内网穿透