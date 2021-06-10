# yummy-food

# React技术栈+antd-mobile+express+mongodb  实现 美食食谱类webapp（毕设）

## 研究背景及意义

随着互联网的蓬勃发展，人们与食物的距离已经在外卖、生鲜电商所提供的产品下不断缩短。然而，外卖、餐厅一次次爆发的安全问题，让越来越多人选择自己做饭。

但是现在很多年轻人想尝试着自己开始做饭，却不知从何下手。又有一些美食爱好者，能烹饪出许多美味精致的菜品，但是却没有专门的社区供他们分享交流。

因此，人们需要一个菜谱丰富、步骤清晰、能够与他人分享交流的菜谱类应用，提高自己的烹饪技能。



## 研究内容

毕设的研究内容是以菜谱为核心的发现，分享，交流美食的下厨房WebApp。

用户不仅可以获取菜谱内容，而且可以交流烹饪技巧、查阅健康饮食知识，提高用户的饮食健康与生活质量。

让想做菜，但不会做菜的厨房小白，拥有清晰易懂的菜谱工具指导自己；让会做菜，但无平台分享的美食爱好者，拥有一个能够记录、分享美食的菜谱社交平台。



## 使用技术

下厨房WebApp采用前后端分离的体系结构。

前端使用ES6语法实现页面逻辑，通过styled-components用js的方式来编写页面样式， React实现前端视图的渲染，React Router控制页面路由，Redux管理各个组件间的状态，使用antd-mobile来定制UI组件。

后端使用Express.JS框架提供后台接口服务，采用非关系型数据库MongoDB存储数据，在Node中采用Mongoose来与MongoDB沟通，实现对数据分布式文件存储。

两端通过Axios等通信方法调用结构并使用JSON 格式进行数据交换。



## 核心逻辑 

下厨房WebApp的核心逻辑是分享做菜心得的人在这个平台上生产内容干货，然后想要学习做菜的人根据菜谱自己尝试做菜，然后给分享做菜的人反馈，形成一个闭环。

下厨房实质就是一个UGC社区（User Generated Content，即用户原创内容）：用户既是网络内容的浏览者，也是网络内容的创造者。



## 功能模块

1）登录注册模块：微信授权注册登录、手机验证码注册登录、账号密码登录

2）菜谱模块： 创建菜谱、编辑菜谱、删除菜谱、搜索菜谱、菜谱分类、收藏菜谱、评论菜谱、菜谱推荐 

3）动态模块： 创建动态、编辑动态、删除动态、点赞动态、评论动态、动态推荐 

4）资讯模块： 每日推荐、食材百科、食疗食补资讯 

5）消息模块： 新增粉丝通知、点赞通知、收藏通知、评论通知 

6）用户模块： 编辑个人资料、关注用户、查看个人中心 



## 使用手册

1、安装node

2、安装mongodb

3、解压项目yummy-food

4、cmd进入server文件夹，输入npm install 安装依赖包，输入npm start启动后台服务器

5、cmd进入yummy-food文件夹，输入npm install 安装依赖包，输入npm start启动前端项目



## 项目实现

![index](C:\Users\stone123\Desktop\study\yummy-food\index.png)

### 初始化

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
