(function(){
  'use strict';
  angular.module('CustomerModule', []).controller('CustomerController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS){
    
    var paramsInit = {
      endpoint:'customer', action:'select',
      pageNum:$scope.pageNum
    };
    var areas = C.storage().get('provinces');

    $scope.paramsInit = angular.copy(paramsInit);
    $scope.areas = angular.copy(areas);

    $scope.changePage = function(){
      C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.doSearch = function(o){
      if(angular.isObject(o)){
        if(!o.provinceId && o.cityId){
          delete o.cityId;
        }
        C.list(this, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

    $scope.refresh = function(){
      C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
      angular.extend(this, angular.copy(C.empty));
      angular.copy(this.paramsInit, paramsInit);
    };

    $scope.saveCust = function(cust){
      var params={pageNum:$scope.pageNum},
          provinceOrder, cityOrder, custInfo;
      if(cust){
        paramsInit = angular.extend({}, $scope.paramsInit);
        custInfo = angular.extend({},cust);
        angular.extend(params, {action:'edit', id:custInfo.id});
        if(custInfo.provinceName){
          for(var i = 0; i<areas.length; i++){
            if(areas[i].name === custInfo.provinceName){
              provinceOrder = i;
              break;
            }
          }
          if(provinceOrder >= 0){
            for(i=0; i<areas[provinceOrder].subname.length; i++){
              if(areas[provinceOrder].subname[i].name === custInfo.cityName){
                cityOrder=i;
                break;
              }
            }
          }
        }
      }
      else{
        angular.extend(params, {action:'add'});
        custInfo = {};
      }
      var modalSet = {
        modalTitle: '客户信息', // modal 窗体标题
        formData: custInfo || {},
        extraData:{areas: areas, cityOrder: cityOrder, provinceOrder: provinceOrder},
        confirm: function(modalInstance, scope){ // 确认modal callback
          var saveData = DDS.saveCust(angular.extend(params, scope.formData));
          saveData.$promise.then(function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet, 'customer');
    };

  }]);
})();