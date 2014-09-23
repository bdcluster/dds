(function(){
  'use strict';
  var app = angular.module('DdsControllers', []);

  /* 全局controller，不包括登录页面 */
  app.controller('GlobelController', [function(){
    console.log('OK');
  }]);

  /* 登录页面 */
  app.controller('LoginController', ['Common', '$window', function(Common, $window){
    var self = this;
    var templatePath = $window.DEBUG ? 'views/' : 'dist/views/';

    return angular.extend(self, {
      template: templatePath + 'form.login.html',
      checkLogin: function(){
        console.log($window.location='d.html');
      }
    });
  }]);

  /* 网页菜单设置 */
  app.controller('MenuListController', [function(){
    var self = this;

    return angular.extend(self, {
      menus: [
        {name:'系统设置', sub:[{name2:'xxxxx', d:'page1'}, {name2:'1111111', d:'page2'}]},
        {name:'客户管理', sub:[{name2:'xxxxx', d:'page1'}, {name2:'1111111', d:'page2'}]},
        {name:'订单管理', sub:[{name2:'xxxxx', d:'page1'}, {name2:'1111111', d:'page2'}]},
        {name:'统计报表', sub:[{name2:'xxxxx', d:'page1'}, {name2:'1111111', d:'page2'}]}
      ],
      open: true
    });
  }]);
})();