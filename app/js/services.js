(function(){
  'use strict';
  var app = angular.module('DdsServices', [])
  .factory('DDS', ['$resource', 'C', function($resource, C){
    var hosts, url, normalPrarms={}, sel = 3;
    var loginInfo = C.storage().get('loginInfo');
    switch(sel){
      case 1:
        url = 'http://10.10.40.125:8080/ddrive-platform-web/:endpoint/:action/:id';
        break;
      case 2:
        // url = 'http://10.10.40.88:8080/:endpoint/:action/:id';
        url: 'http://10.10.40.88:8080/login-index';
        break;
      default:
        url = 'http://127.0.0.1:8084/:endpoint/:action/:id';
        angular.extend(normalPrarms, {local:1, mock:1, enforce:1});
    }
    if (loginInfo){
      angular.extend(normalPrarms, {userId:loginInfo.userId});
    }

    return $resource(url, normalPrarms, {
      login:{
        method:'GET',
        params:{endpoint:'user', action:'login'}
      },
      signOut:{
        method:'GET',
        params:{endpoint:'user', action:'signOut'}
      },
      savePwd:{
        method:'POST',
        params:{endpoint:'user', action:'editPassword'}
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
      /*runtimeEvn: function(){
        //0开发 1测试 2生产 3其他
        var ua = navigator.userAgent.toLowerCase();
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
      },*/

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
          monthDays[1] = 29;
        }
        return monthDays;
      },

      getPeriod: function(){
        var section = $location.path(), pickYear, firstDay, endDay;
        var curYear = new Date().getFullYear(), curMonth = new Date().getMonth()+1;
        var curQuarter = Math.ceil(curMonth / 3);
        var params = arguments[0], period={};
        switch(section){
          case '/month-ord':
            if(params && params.year && params.month){
              pickYear = params.year;
              firstDay = params.month + '-01';
              endDay   = params.month + '-' + this.mLength()[params.month];
            }
            else{
              pickYear = curYear;
              firstDay = curMonth + '-01';
              endDay   = curMonth + '-'+ this.mLength()[curMonth];
            }
            period = {
              startTime: $filter('date')(new Date(pickYear + '-' + firstDay), 'yyyy-MM-dd'),
              endTime:   $filter('date')(new Date(pickYear + '-' + endDay), 'yyyy-MM-dd')
            };
          break;

          case '/quarter-ord':
            if(params && params.year){
              pickYear = params ? params.year : curYear;
              firstDay = params ? (params.quarter * 3 - 2) + '-1' : (curQuarter * 3 - 2) + '-1';
              endDay   = params ? params.quarter * 3 + '-' + this.mLength()[params.quarter * 3] : curQuarter * 3 + '-' + this.mLength()[curQuarter * 3];
              period = {
                startTime: $filter('date')(new Date(pickYear + '-' + firstDay), 'yyyy-MM-dd'),
                endTime:   $filter('date')(new Date(pickYear + '-' + endDay), 'yyyy-MM-dd')
              };
            }
          break;

          case '/time-ord':
            if(params && params.dp1 && params.dp2){
              if(params.dp1>params.dp2){
                period = {
                  startTime: $filter('date')(params.dp2, 'yyyy-MM-dd'),
                  endTime: $filter('date')(params.dp1, 'yyyy-MM-dd')
                }
              }
              else{
                period = {
                  startTime: $filter('date')(params.dp1, 'yyyy-MM-dd'),
                  endTime: $filter('date')(params.dp2, 'yyyy-MM-dd')
                }
              }
            }
          break;
        }
        // console.log(period)
        return period;
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
            return ls.set(key, val);
          },
          get: function(key){
            return ls.get(key);
          },
          remove: function(key){
            return ls.remove(key);
          },
          clear: function(){
            return ls.clearAll();
          }
        };
      },

      back2Login:function(){
        $window.location='login.html';
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
              // console.log('data cache success!');
            }
            else{
              // console.log('data cache error!');
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