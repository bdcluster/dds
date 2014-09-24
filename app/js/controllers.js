(function(){
  'use strict';
  // var templatePath = window.DEBUG ? 'views/' : 'dist/views/';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', []);

  /* 全局controller，不包括登录页面 */
  app.controller('GlobelController', ['DDS', '$location', '$cookieStore', function(DDS, $location, $cookieStore){
    var self = this;
    return angular.extend(self, {
      menuTemplate: templatePath + 'menu.html',
      menus: [
        {name:'系统设置', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
        {name:'客户管理', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
        {name:'订单管理', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
        {name:'统计报表', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]}
      ],
     /* menus: function(){
        return [
          {name:'系统设置', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
          {name:'客户管理', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
          {name:'订单管理', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]},
          {name:'统计报表', open:false, sub:[{name2:'xxxxx', d:'home'}, {name2:'1111111', d:'page2'}]}
        ]
      },*/
      isActivedMenu: function(viewLocation){
        return viewLocation === $location.path();
      },
      curAccordion: $cookieStore.get('opendAccordion'),
      markOpen: function(no){
        $cookieStore.put('opendAccordion', no);
      },
      keepOpenAccordion: function(){
        var index = $cookieStore.get('opendAccordion');
        if(index !== undefined){
          this.menus[index].open = true;
        }
      }
    });
  }]);

  /* 登录页面 */
  app.controller('LoginController', ['Common', '$window', function(Common, $window){
    var self = this;

    return angular.extend(self, {
      template: templatePath + 'form.login.html',
      checkLogin: function(){
        console.log($window.location='d.html');
      }
    });
  }]);

  /* demo */
  app.controller('HomeController', [function(){
    var self = this;

    return angular.extend(self, {
      maxSize : 10,
      totleRecords : 200,
      currentPage : 2,
      recordsPerPage: 20,
      changePage: function(){
        console.log(this.currentPage);
      }
    });
  }]);
})();