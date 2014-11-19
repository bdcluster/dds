(function(){
  'use strict';
  angular.module('DriverModule', []).controller('DriverController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS){

    var paramsInit = {
      endpoint:'driver', action:'select',
      pageNum:$scope.pageNum,
    };
    var areas = C.storage().get('provinces');
    $scope.areas = angular.copy(areas);
    $scope.paramsInit = angular.copy(paramsInit);

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
      C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
      angular.extend(this, angular.copy(C.empty));
      angular.copy(this.paramsInit, paramsInit);
    };

    $scope.workStatus=[
      {'n':'忙碌', 's':'1', 'c':'danger'},
      {'n':'空闲', 's':'2', 'c':'success'},
      {'n':'代驾中','s':'3', 'c':'warning'}
    ];

    $scope.saveDriver = function(driv){
      var params={pageNum:$scope.pageNum}, drivInfo, curProv, provinceOrder, cityOrder;
      if(driv){
        paramsInit = angular.extend({}, $scope.paramsInit);
        drivInfo = angular.extend({}, driv);
        angular.extend(params, {action:'edit', id:drivInfo.id});
        if(drivInfo.provinceName){
          curProv = C.curProvince(areas, drivInfo.provinceName, drivInfo.cityName);
          provinceOrder = curProv.provOrder;
          cityOrder = curProv.cityOrder;
        }
      }
      else{
        angular.extend(params, {action:'add'});
        drivInfo = {workStatus:2, driverStatus:0};
      }
      var modalSet = {
        modalTitle: '司机信息', // modal 窗体标题
        formData: drivInfo || {},
        extraData:{areas: areas, cityOrder:cityOrder, provinceOrder:provinceOrder},
        confirm: function(modalInstance, scope){ // 确认modal callback
          var saveData = DDS.saveDriv(angular.extend(params, scope.formData));
          saveData.$promise.then(function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
      };
      C.openModal(modalSet, 'driver');
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个司机的信息？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delDriv({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
      };
      C.openModal(modalSet);
    }; 

  }]);
})();