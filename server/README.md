## express项目目录结构优化

|——server // express项目根目录
|————|bin 
|——————|www  //服务器相关配置文件
|————|controllers //控制器层，处理前端请求
|————|models //数据库操作相关文件
|————|node_modules //npm包安装目录
|————|public //react打包目录，存放所有的html，js/css/图片等资源文件
|————|routes // 路由文件目录
|——————|api.js //api请求路由文件
|——————|pages.js // 页面请求路由文件
|————|utils // 公共文件目录
|——————|config.js //各种常量或公共方法
|——————|db.js // 数据库访问方法封装
|——————|http.js //http请求方法封装
|————|views // express框架自带，由于打包后的文件全放在public目录下，因此这个文件可不用了
|————|app.js //入口文件
|————|package.json 
|————|package-lock.json