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

    $scope.doSearch = function(){
      if(C.searchFlag(this.search)){
        C.list(this, angular.extend(paramsInit, this.search, {pageNum: 1}));
      }
    };

    $scope.refresh = function(){
      if(!angular.equals(this.paramsInit, paramsInit)){
        C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
        angular.extend(this, angular.copy(C.empty));
        angular.copy(this.paramsInit, paramsInit);
      }
    };

    $scope.saveCust = function(cust){
      var params={pageNum:$scope.pageNum},
          curProv, provinceOrder, cityOrder, custInfo;
      if(cust){
        paramsInit = angular.extend({}, $scope.paramsInit);
        custInfo = angular.extend({},cust);
        angular.extend(params, {action:'edit', id:custInfo.id});
        if(custInfo.provinceName){
          curProv = C.curProvince(areas, custInfo.provinceName, custInfo.cityName);
          provinceOrder = curProv.provOrder;
          cityOrder = curProv.cityOrder;
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
          }, function(res){
            C.badResponse(res);
            modalInstance.dismiss();
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet, 'customer');
    };

  }]);
})();