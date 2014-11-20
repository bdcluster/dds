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
    '$filter','$timeout','$window','$location','$modal','$rootScope','DDS','AuthService','localStorageService',function(
     $filter,  $timeout,  $window,  $location,  $modal , $rootScope,  DDS,  AuthService,  ls){

    return{
      errMessage: {
        status404: '对不起，您可能没有访问权限！', // response failure && status=404
        status500: '网络不通, 或者内部服务器错误，请联系管理员！', // response failure && status=0
        otherError:'未知错误！', // bad response, other response status
        responseErr:'对不起，出现一个未知错误！', // header.errorCode!==0
        dataError:  '会话过期，请手工退出系统后重新登录！' // no json data
      },

      empty:{
        search:{}, province:{}, city:{}
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

      closeMenu: function(){
        var storage, index;
        storage = this.storage();
        index = storage.get('opendAccordion');
        if(index !== null){
          $rootScope.menus[index].open = false;
        }
      },

      delayJump: function(hash, delay){
        if(delay){
          $timeout(function(){
            $location.path(hash);
          }, 3000);
        }
        else{
          $location.path(hash);
        }
      },

      /*
        操作提示， modal 和 scope参数用在模式窗口的提示中
        页面alert提示可无视后两个参数
      */
      alert: function(opts, modal, scope){
        if(modal){
          angular.extend(scope.alert, opts, {show:true});
          $timeout(function(){ 
            scope.alert={show:false};
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

      validResponse: function(res, ifModal, modalScope){
        if(res.header){
          if(res.header.errorCode === 0){
            if(res.data.code>0){
              this.alert({type: 'danger', msg: res.data.message}, ifModal, modalScope);
              return false;
            }
            else{
              // 成功返回有效数据
              return res.data;
            }
          }
          else{
            this.alert({
              type: 'danger', 
              msg: res.header.message || this.errMessage.responseErr}, ifModal, modalScope);
            return false;
          }
        }
        else if(res !== ''){
          this.alert({type:'danger', msg: this.errMessage.dataError}, ifModal, modalScope);
          return false;
        }
        else{
          return false;
        }
      },
      /*
        Ajax请求失败
      */
      badResponse: function(res){
        if(res){
          if(res.status === 404){
            this.alert({type:'danger', msg: this.errMessage.status404 + '(status: ' + res.status + ')'});
            return false;
          }
          else if(res.status === 0){
            this.alert({type:'danger', msg: this.errMessage.status500 + '(status: ' + res.status + ')'});
            return false;
          }
          else{
            this.alert({type:'danger', msg: this.errMessage.otherError + '(status: ' + res.status +')'});
            return false;
          }
        }
        else{
          this.alert({type:'danger', msg: this.errMessage.otherError});
          return false;
        }
      },

      list:function(scope, options){
        var self = this;
        $rootScope.loading = true;
        DDS.get(options, function(res){
          var data = self.validResponse(res);
          $rootScope.loading = false;
          if(angular.isObject(res)){
            angular.extend(scope, data);
            scope.showPagination = true;
          }
        }, function(res){
          $rootScope.loading = false;
          self.badResponse(res);
        });
      },

      openModal: function(modalSet, module){
        var m = module, path;
        if(m){
          path = '/views/' + module.split('.')[0] + '/';
        }
        else{
          path = '/views/common/';
        } 
        var options = {
          templateUrl: path + m +'.modal.html',
          controller: 'ModalController',
          resolve: {
            modalSet: function(){ return modalSet; }
          }
        };
        if(angular.isUndefined(m)){
          angular.extend(options, {
            templateUrl: path + 'remove.modal.html',
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
        if(angular.isObject(data)){
          modalInstance.close(function(){ // close modal
            angular.extend(ctrlScope, data);
            self.alert({type:'success', msg:data.message || '操作成功！'});
            angular.extend(ctrlScope, angular.copy(self.empty));
          });
        }
      },

      /*
        'a,b,c,d;e,f,g,h' =>
        {
          0: {0:'a', 1:'b', 2:'c', 3:'d'},
          1: {0:'e', 1:'f', 3:'g', 4:'h'}
        }
      */
      ruleStr2Json: function(str){
        var obj1={}, obj2={}, ruleRecord=[], ruleDetail=[];
        ruleRecord = str.split(';');
        for(var p = 0; p < ruleRecord.length; p++){
          obj1[p] = {};
          ruleDetail = ruleRecord[p].split(',');
          for(var q = 0; q < ruleDetail.length; q++){
            obj2[q] = ruleDetail[q] - 0;
            obj1[p][q] = obj2[q];
          }
        }
        return obj1;
      },

      /*
        {
          0: {0:'a', 1:'b', 2:'c', 3:'d'},
          1: {0:'e', 1:'f', 3:'g', 4:'h'}
        } =>
        'a,b,c,d;e,f,g,h'
      */
      json2RuleStr: function(json){
        var ruleRecord=[], ruleDetail=[], obj = json;
        for(var p in obj){
          ruleDetail = [];
          if(obj[p]){
            for(var q in obj[p]){
              ruleDetail.push(obj[p][q]);
            }
            if(ruleDetail.length === 4){
              ruleRecord.push(ruleDetail.join(','));
            }
          }
        }
        return ruleRecord.join(';');
      },

      exportFile: function(options){
        var url = $window.location.origin, 
            prj = '/ddrive-platform-web',
            obj = angular.extend({}, options), 
            str = [],
            self= this; 
        if(obj.endpoint && obj.action){
          delete obj.endpoint; delete obj.action;
          if(!angular.equals(obj, {})){
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
          }
        }
        DDS.get(options, function(res){
          var data = self.validResponse(res);
          if(angular.isObject(data)){
            $window.location = url + prj + data.message + '?' + str.join('&');
          }
        }, function(){
          C.badResponse();
        });
      },

      mLength: function(){
        var monthDays = ["", 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (((this.year % 4 === 0) && (this.year % 100 !== 0)) || (this.year % 400 === 0)){
          monthDays[2] = 29;
        }
        return monthDays;
      },

      twiNum: function(num){
        if(angular.isNumber(num)){
          if(num < 10){
            return "0" + num;
          }
          else{
            return num;
          }
        } 
        else{
          return "00";
        }
      },

      getPeriod: function(){
        var section = $location.path(), pickYear, firstDay, endDay, dp1, dp2;
        var params = arguments[0], period={};
        switch(section){
          case '/month-ord':
            period = {
              s: params.year + '-' + this.twiNum(params.month) + '-01',
              e: params.year + '-' + this.twiNum(params.month) + '-' + this.mLength()[params.month]
            };
          break;

          case '/quarter-ord':
            pickYear = params ? params.year : curYear;
            firstDay = params ? this.twiNum(params.quarter * 3 - 2) + '-01' : this.twiNum(curQuarter * 3 - 2) + '-01';
            endDay   = params ? this.twiNum(params.quarter * 3) + '-' + this.mLength()[params.quarter * 3] : this.twiNum(curQuarter * 3) + '-' + this.mLength()[curQuarter * 3];
            period = {
              s: pickYear + '-' + firstDay,
              e: pickYear + '-' + endDay
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
          startTime: this.formatDate(period.s),
          endTime:   this.formatDate(period.e)
        };
      },

      goOrderList: function(opts){
        $location.path('/orderPeriod').search(opts);
      },

      getKeyJson:function(str){
        var arr = str.split(','), obj={};
        for(var i=0; i<arr.length; i++){
          obj[arr[i]]=true;
        }
        return obj;
      },

      getKeyStr:function(json){
        var arr=[], obj=json;
        for(var p in obj){
          if(obj[p]!==false) arr.push(p);
        }
        return arr.join(',');
      },

      formatDate:function(d){
        var date = d || new Date();
        return $filter('myDate')(date, 'yyyy-MM-dd');
      },

      curProvince: function(provData, curProv, curCity){
        var queryOrder = {}, cityArr;
        for(var i = 0; i < provData.length; i++){
          if(provData[i].name === curProv){
            queryOrder.provOrder = i;
            break;
          }
          else{
            queryOrder.provOrder = '';
          }
        }
        if(queryOrder.provOrder >= 0){
          cityArr = provData[queryOrder.provOrder].subname;
          for(i = 0; i < cityArr.length; i++){
            if(cityArr[i].name === curCity){
              queryOrder.cityOrder = i;
              break;
            }
            else{
              queryOrder.cityOrder = '';
            }
          }
        }
        else{
          queryOrder.cityOrder = '';
        }
        return queryOrder;
      }, 

      searchFlag: function(searchData){
        var storage = this.storage(), lastSearch;
        if(angular.equals(searchData, {}) || !angular.isObject(searchData)){
          return false;
        }
        else{
          lastSearch = storage.get('searchData');
          if(angular.equals(lastSearch, searchData)){
            return false;
          }
          else{
            storage.set('searchData', searchData);
            return true;
          }
        }
      }
    };
  }]);
})();