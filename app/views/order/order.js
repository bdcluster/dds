(function(){
  'use strict';
  angular.module('OrderModule', []).controller('OrderController', [
    '$scope','$routeParams','$location','$timeout','C','DDS', function(
     $scope,  $routeParams,  $location  ,$timeout,  C,  DDS){

    var paramsInit = {
      endpoint:'order', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.paramsInit = angular.copy(paramsInit);

    $scope.areas = C.storage().get('provinces');
    angular.extend(paramsInit, $routeParams);

    angular.extend($scope, {
      orderStatus:[
        {'s':'1','n':'已预约','c':'warning'},
        {'s':'2','n':'已取消','c':'default'},
        {'s':'3','n':'准备中','c':'info'},
        {'s':'4','n':'代驾中','c':'primary'},
        {'s':'5','n':'已完成','c':'success'},
        {'s':'6','n':'已超时','c':'danger'}
      ],
      billStatus:[
        {'n':'代驾中', 's':'0', 'c':'warning'},
        {'n':'未结算', 's':'1', 'c':'default'},
        {'n':'已结算', 's':'2', 'c':'success'}
      ],
      syncStatus:[
        {'n':'未同步', 's':'0', 'c':'default'},
        {'n':'已同步', 's':'1', 'c':'success'}    
      ],
      syncButton: '同步订单',
      sync:{
        primary:true,
        success:false,
        danger:false
      },
      changePage: function(){
        C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
      },
      goBack:function(){
        $location.path($routeParams.ref).search('');
      },
      doSearch: function(){
        if(C.searchFlag(this.search)){
          C.list(this, angular.extend(paramsInit, this.search, {pageNum: 1}));
        }
      },
      refresh: function(){
        if(!angular.equals(this.paramsInit, paramsInit)){
          C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
          angular.extend(this, angular.copy(C.empty));
          angular.copy(this.paramsInit, paramsInit);
        }
      },
      // 订单同步
      syncOrder: function(orderId){
        var self = this, syncParams;
        if(!self.sync.success){
          self.syncButton = '正在同步';
          syncParams = angular.extend({
            endpoint:'order', action:'synchOrder', 
            orderId: orderId, chaos: Math.random()
          });
          DDS.get(syncParams, function(res){
            var data = res.data;
            $timeout(function(){
              if(angular.isObject(data) && data.code === 0){
                self.sync = {
                  primary:false, success:true, danger:false
                };
                self.syncButton = data.message;
              }
              else{
                self.syncButton = '同步失败';
                self.sync = {
                  primary:false, success:false, danger:true
                };
              }
            }, 2000);
          }, function(res){
            C.badResponse(res);
            modalInstance.dismiss();
          });
          
        }
      },
      orderExport: function(){
        C.exportFile(angular.extend(
          {endpoint:'order', action:'exportOrder'}, $scope.search, $routeParams
        ));
      },
      ordDetail: function(ord){
        var modalSet = {
          modalTitle: '订单详情', // modal 窗体标题
          formData:ord,
          extraData:{
            orderStatus:$scope.orderStatus, 
            billStatus:$scope.billStatus, 
            syncStatus:$scope.syncStatus
          }
        };
        C.openModal(modalSet, 'order');
      }
    });
    $scope.changePage();

  }]);
})();