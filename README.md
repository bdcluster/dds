# 代驾项目前端开发简介

## 项目搭建

    $ git clone git@github.com:jimyuan/dds.git
    $ cd dds
    $ npm install install && bower install

## 项目运行

    $ gulp watch
    
## 项目打包

    $ gulp build
    $ gulp zip
打包文件以dds_[timestamp].zip命名返回给

## 项目前端开发资源介绍
- Angularjs：作为主要js框架
- angular-route, angular-resource等components实现前端路由和RESTful服务
- Bootstrap-sass：作为UI框架，重置页面样式、构建栅格布局、实现组件UI
- Angular-bootstrap：让Bootstrap的一些components以angular的方式实现
- animate.css：实现简单的动画效果

---

## 模块列表
    .
    ├──login
    ├──home
    ├──password-change
    ├──help
    ├──customer
    │   └──customer-manage
    ├──driver
    │   └──driver-manage
    |——order
    │   ├──order-list
    │   ├──monthly-list
    │   ├──quarter-list
    │   └──period-list
    |——rule
    │   ├──template-manage
    │   └──rule-manage
    └──setting
        ├──user-manage
        └──role-manage

## v2.0版本预计改动如下：
#### 目录结构(基本按模块需求划分)
    .
    ├──app
    │   ├──index.html
    │   ├──js
    │   │   ├──app.js
    │   │   ├──directives.js
    │   │   ├──filters.js
    │   │   ├──controllers.js
    │   │   └──services
    │   │       ├──resource.js
    │   │       └──common.js
    │   ├──css
    │   │   ├──docs.css
    │   │   ├──_iconfont.scss
    │   │   ├──_vandor.scss
    │   │   └──docs.scss
    │   ├──img
    │   ├──fonts
    │   └──views
    │       ├──common
    │       │   ├──home.html
    │       │   ├──pwd.html
    │       │   ├──help.html
    │       │   └──delete.modal.html
    │       ├──customer
    │       │   ├──customer.html
    │       │   ├──customer.modal.html
    │       │   └──customer.js
    │       ├──driver
    │       │   ├──driver.html
    │       │   ├──driver.modal.html
    │       │   └──driver.js
    │       ├──order
    │       │   ├──order.html
    │       │   ├──order.modal.html
    │       │   ├──order.js
    │       │   ├──monthly.html
    │       │   ├──quarter.html
    │       │   ├──period.html
    │       │   └──period.js
    │       ├──rule
    │       │   ├──temp.html
    │       │   ├──temp.modal.html
    │       │   ├──temp.js
    │       │   ├──rule.html
    │       │   ├──user.modal.html
    │       │   └──user.js
    │       ├──user
    │       │   ├──user.html
    │       │   ├──user.modal.html
    │       │   └──user.js
    │       └──role
    │           ├──role.html
    │           ├──role.modal.html
    │           └──role.js
    ├──dist
    └──test

