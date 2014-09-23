(function(){
  'use strict';
  var app = angular.module('DdsServices', []);

  app.factory('Common', ['$window', function($window){
    var ua = navigator.userAgent.toLowerCase();
    return {
      runtimeEvn: function(){
        //0开发 1测试 2生产 3其他
        var host = $window.location.host,
            path = $window.location.pathname,
            local= /^(localhost|10\.10|127\.0|192\.168)/i;
        if(window.DEBUG){
          return 0;
        }
        if(local.test(host) && /^\/d.html/.test(path)) {
          return 0;
        }
        else if(local.test(host) && (/^\//.test(path) || /^\/index.html/.test(path))){
          return 1;
        }
        else if(/github.io$/.test(host)){
          return 2;
        }
        else {
          return 3;
        }
      }
    };
  }]);
})();