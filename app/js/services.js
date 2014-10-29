(function(){
  'use strict';
  var app = angular.module('DdsServices', [])

  .factory('AuthService', [function(){
    var auth = {
        isLogged: false
    };
    return auth;
  }])
  /*.factory('TokenInterceptor', ['$q', '$window', function ($q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if($window.sessionStorage['ls.token']){
          config.headers.Authorization = $window.sessionStorage['ls.token'];
        }
        return config;
      },

      response: function (response) {
        return response || $q.when(response);
      }
    };
  }])*/
  .factory('DDS', ['$resource', '$location', 'C', function($resource, $location, C){
    var http = $location.protocol(), 
        host = $location.host(), 
        port = $location.port()==='' ? '' : ':' + $location.port(), 
        proj = '/ddrive-platform-web';
    var storage = C.storage(), url, normalPrarms={};
    // 前端开发环境
    if(C.runtimeEvn() === 0) {
      port = ':8084';
      proj = '';
      angular.extend(normalPrarms, {local:1, mock:1, enforce:1});
    }
    url = http + '://' + host + port + proj + '/:endpoint/:action/:id';
    /*if(storage.get('token')){
      angular.extend(normalPrarms, {userId:storage.get('userId')})
    }*/

    return $resource(url, normalPrarms, {
      login:{
        method:'GET',
        params:{endpoint:'login-index'}
      },
      signOut:{
        method:'GET',
        params:{endpoint:'logout'}
      },
      savePwd:{
        method:'POST',
        params:{endpoint:'password', action:'change'}
      },
      delUser:{
        method:'POST',
        params:{endpoint:'user', action:'delete', id:'@id'}
      },
      saveUser:{
        method:'POST',
        params:{endpoint:'user', action:'@action', id:'@id'}
      },
      delRole:{
        method:'POST',
        params:{endpoint:'role', action:'delete', id:'@id'}
      },
      saveRole:{
        method:'POST',
        params:{endpoint:'role', action:'@action', id:'@id'}
      },
      saveCust:{
        method:'POST',
        params:{endpoint:'customer', action:'@action', id:'@id'}
      },
      saveDriv:{
        method:'POST',
        params:{endpoint:'driver', action:'@action', id:'@id'}
      },
      delDriv:{
        method:'POST',
        params:{endpoint:'driver', action:'delete', id:'@id'}
      },
      saveRule:{
        method:'POST',
        params:{endpoint:'rule', action:'@action', id:'@id'}
      },
      delRule:{
        method:'POST',
        params:{endpoint:'rule', action:'delete', id:'@id'}
      }
    });
  }])
  .factory('C', ['$window', '$filter', '$timeout','$location', '$modal','localStorageService', function($window, $filter, $timeout, $location, $modal, ls){
    return {
      runtimeEvn: function(){
        //0前端环境， 10其他
        var ua = navigator.userAgent.toLowerCase();
        var host = $window.location.host,
            port = $location.port(),
            local= /^(localhost|127\.0)/i,
            dev = /^10\.10\.40\.250/i;
        if(port === 9000) {
          return 0;
        }
        else {
          return 10;
        }
      },

      exportFile: function(scope, resource, options){
        var url = $window.API.split('/:endpoint')[0], 
            obj = angular.extend({}, options), 
            str = [],
            self= this; 
        if(obj.endpoint && obj.action){
          delete obj.endpoint;
          delete obj.action;
          if(!angular.equals(obj, {})){
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
          }
        }
        var apiHost = $window.API.split('/:endpoint')[0]; 
        resource.get(options, function(res){
          var data = self.validResponse(res);
          if(typeof data!=='string'){
            $window.location = url + data.message + '?' + str.join('&');
          }
          else{
            self.alert(scope, {type:'danger', msg:data});
          }
        }, function(res){
          self.alert(scope, {type:'danger', msg:'网络错误！'});
        });
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

      mLength: function(){
        var monthDays = ["", 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (((this.year % 4 === 0) && (this.year % 100 !== 0)) || (this.year % 400 === 0)){
          monthDays[2] = 29;
        }
        return monthDays;
      },

      getPeriod: function(){
        var section = $location.path(), pickYear, firstDay, endDay, dp1, dp2;
        var params = arguments[0], period={};
        switch(section){
          case '/month-ord':
            period = {
              s: params.year + '-' + params.month + '-01',
              e: params.year + '-' + params.month + '-' + this.mLength()[params.month]
            };
          break;

          case '/quarter-ord':
            pickYear = params ? params.year : curYear;
            firstDay = params ? (params.quarter * 3 - 2) + '-01' : (curQuarter * 3 - 2) + '-01';
            endDay   = params ? params.quarter * 3 + '-' + this.mLength()[params.quarter * 3] : curQuarter * 3 + '-' + this.mLength()[curQuarter * 3];
            period = {
              s: new Date(pickYear + '-' + firstDay),
              e: new Date(pickYear + '-' + endDay)
            };
          break;

          case '/time-ord':
            dp1 = params.dp1;
            dp2 = params.dp2;
            if(params && dp1 && dp2){
              if(params.dp1>params.dp2){
                dp1 = [dp1, dp2];
                dp2 = dp1[0];
                dp1 = dp1[1];
              }
              period = {
                s: dp1, e: dp2
              };
            }
          break;
        }
        return {
          startTime: $filter('myDate')(period.s, 'yyyy-MM-dd'),
          endTime:   $filter('date')(period.e, 'yyyy-MM-dd')
        };
      },

      alert: function(scope, opts, alone){
        if(alone){
          angular.extend(scope.alert, opts);
        }
        else{
          scope.alerts.push(opts);
          $timeout(function(){ 
            scope.alerts.pop();
          }, 3000);
        }
      },
      validResponse: function(res){
        if(res.header){
          if(res.header.errorCode === 0){
            if(res.data.code>0){
              return res.data.message;
            }
            else{
              return res.data;
            }
          }
          else{
            return 'errorCode = ' + res.header.errorCode;
          }
        }
        else{
          return '系统错误，无返回数据！';
        }
      },

      openModal: function(modalSet, module){
        var m = module || 'general.remove';
        var options = {
          templateUrl: 'views/modal.'+ m +'.html',
          controller: 'ModalController',
          resolve: {
            modalSet: function(){ return modalSet; }
          }
        };
        if(m  === 'general.remove'){
          angular.extend(options, {size:'sm'});
        }
        var modalInstance = $modal.open(options);

        modalInstance.result.then(
          function (result) {
            result();
          }, 
          function (reason) {
            // console.log(reason);
          }
        );
        modalInstance.opened.then(
          function(info){}
        );
      },

      cancelModal: function(modalInstance){ // 取消modal 默认没有callback
        modalInstance.dismiss('dismiss');
      },

      storage: function(){
        var store, now = new Date();
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

      back2Login:function(){
        $location.path('/login');
      },

      back2Home: function(delay){
        if(delay){
          $timeout(function(){
            $location.path('/home');
          }, 3000);
        }
        else{
          $location.path('/home');
        }
      },

      list:function(scope, resource, options){
        var self = this;
        resource.get(options, function(res){
          var data = self.validResponse(res);
          if(typeof data!=='string'){
            angular.extend(scope, data);
            scope.showPagination = true;
          }
          else{
            self.alert(scope, {type:'danger', msg:data});
          }
        }, function(res){
          self.alert(scope, {type:'danger', msg:'网络错误！'});
        });
      },

      responseHandler: function(modalScope, ctrlScope, modalInstance, res){
        var self = this, data = self.validResponse(res);
        if(typeof data!=='string'){
          modalInstance.close(function(){ // close modal
            angular.extend(ctrlScope, data);
            //如果role数据变更，更新role的缓存
            if(data.roles){
              self.storage().set('role', data);
            }
            self.alert(ctrlScope, {type:'success', msg:data.message || '操作成功！'});
          });
        }
        else{
          self.alert(modalScope, {msg:data, show:true}, true);
        }
      },

      cacheData: function(resource, params){
        var self = this, key = params.endpoint;
        var storage = self.storage();
        var storeData = function(){
          resource.get(params, function(res){
            var data = self.validResponse(res);
            if(typeof data!=='string'){
              storage.set(key, data);
            }
            else{
              return false;
            }
          });
        };
        if(!storage.get(key)){
          $timeout(storeData, 200);
        }
      },

      goOrderList: function(cName){
        $location.path('/order').search('cName', cName);
      }
    };
  }]);
})();