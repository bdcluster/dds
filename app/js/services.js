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
    '$filter','$timeout','$location','$modal','$rootScope','DDS','localStorageService',function(
     $filter,  $timeout,  $location,  $modal , $rootScope,  DDS,  ls){

    return{
      errMessage: {
        networkErr: '对不起，网络错误，或者您没有访问权限！', // response failure
        responseErr:'对不起，出现一个未知错误!', // header.errorCode!==0
        dataError:  '会话过期，请手工退出系统后重新登录！' // no json data
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

      /*
        操作提示， modal 和 scope参数用在模式窗口的提示中
      */
      alert: function(opts, modal, scope){
        if(modal){
          angular.extend(scope.alert, opts, {show:true});
          $timeout(function(){ 
            scope.alert={show:false}
          }, 3000);
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

      validResponse: function(res, ifModal, modalScope){
        var alertOptions;
        if(res.header){
          if(res.header.errorCode === 0){
            if(res.data.code>0){
              this.alert({type: 'danger', msg: res.data.message}, ifModal, modalScope);
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
            }, ifModal, modalScope);
          }
        }
        else{
          this.alert({type:'danger', msg: this.errMessage.dataError}, ifModal, modalScope);
        }
      },

      list:function(scope, options){
        var self = this;
        DDS.get(options, function(res){
          var data = self.validResponse(res);
          if(angular.isObject(res)){
            angular.extend(scope, data);
            scope.showPagination = true;
          }
        }, function(){
          self.badResponse();
        });
      },

      openModal: function(modalSet, module){
        var m = module ;
        var options = {
          templateUrl: '/views/'+ m + '/' +m +'.modal.html',
          controller: 'ModalController',
          resolve: {
            modalSet: function(){ return modalSet; }
          }
        };
        if(angular.isUndefined(m)){
          angular.extend(options, {
            templateUrl: '/views/common/remove.modal.html',
            size:'sm'
          });
        }
        var modalInstance = $modal.open(options);

        modalInstance.result.then(function (result) {
          result();
        }, function (reason) {
            // console.log(reason);
        });

        modalInstance.opened.then(function(info){
          // console.log(info)
        });
      },

      cancelModal: function(modalInstance){ // 取消modal 默认没有callback
        modalInstance.dismiss('dismiss');
      },

      responseHandler: function(modalScope, ctrlScope, modalInstance, res){
        var self = this, data = self.validResponse(res, true, modalScope);
        // if()
        if(angular.isObject(data)){
          modalInstance.close(function(){ // close modal
            angular.extend(ctrlScope, data);
            //如果role数据变更，更新role的缓存
            /*if(data.roles){
              self.storage().set('role', data);
            }*/
            self.alert({type:'success', msg:data.message || '操作成功！'});
            angular.extend(ctrlScope, {
              search:{}, province:{}, city:{}
            });
          });
        }
      }

    };
  }]);
})();