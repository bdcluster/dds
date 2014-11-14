(function(){
  'use strict';
  angular.module('DdsServices', [])
  .factory('AuthService', [function(){
    var auth = {
      isLogged: false
    };
    return auth;
  }])
  .factory('C', [
    '$window','$filter','$timeout','$location','$modal','$rootScope','localStorageService',function(
     $window,  $filter,  $timeout,  $location,  $modal , $rootScope,  ls){

    return{
      errMessage: {
        networkErr: '对不起，您没有访问权限！', // response failure
        responseErr:'对不起，出现一个未知错误!', // header.errorCode!==0
        dataError: '会话过期，请手工退出系统后重新登录！' // no json data
      },

      runtimeEvn: function(){
        /*
          0: 本地环境, 连mock数据
          1: 本地环境, 连远程API
        */
        var ua = navigator.userAgent.toLowerCase();
        var host = $window.location.host,
            port = $location.port(),
            local= /^(localhost|127\.0)/i,
            remote = /^static.ddriver.com/i,
            dev = /^10\.10\.40\.250/i;
        if(port === 9000 && local.test(host)) {
          return 0;
        }
        else if(port === 9000 && remote.test(host)){
          return 1;
        }
        else {
          return 10;
        }
      },

      succ: function(chart){
        if (angular.isNumber(chart)) { return chart - 0 + 1; }
        else {
          chart = chart + "";
          return chart.slice(0, chart.length - 1) +
          String.fromCharCode(chart.charCodeAt(chart.length - 1) + 1);
        }
      },

      range: function(start, end){
        var edge = arguments[2] || false;
        var v = start;
        var a = [];
        var flag = function (value) {
          if (value < start) { return false; }
          if (edge) { return value < end; }
          return value <= end;
        };
        while (flag(v)) {
          a.push(v); v = this.succ(v);
        }
        return a;
      },

      alert: function(opts, alone, scope){
        if(alone){
          angular.extend(scope.alert, opts);
        }
        else{
          $rootScope.alerts.push(opts);
          $timeout(function(){ 
            $rootScope.alerts.pop();
          }, 3000);
        }
      },

      storage: function(){
        var store;
        ls.isSupported ? store = ls : store = ls.cookie;
      
        return {
          set: function(key, val){
            return store.set(key, val);
          },
          get: function(key){
            return store.get(key);
          },
          remove: function(key){
            return store.remove(key);
          },
          clear: function(){
            return store.clearAll();
          }
        };
      },

      badResponse: function(){
        this.alert({type:'danger', msg: this.errMessage.networkErr});
      },

      validResponse: function(res){
        if(res.header){
          if(res.header.errorCode === 0){
            if(res.data.code>0){
              this.alert({type: 'danger', msg: res.data.message});
            }
            else{
              // 成功返回有效数据
              return res.data;
            }
          }
          else{
            this.alert({
              type: 'danger', 
              msg: this.errMessage.responseErr
            });
          }
        }
        else{
          this.alert({type:'danger', msg: this.errMessage.dataError});
        }
      }
    }
  }]);
})();