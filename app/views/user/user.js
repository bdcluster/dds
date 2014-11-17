(function(){
  'use strict';
  angular.module('UserModule', []).controller('UserController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS){
    
    var paramsInit = {
      endpoint:'user', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.paramsInit = angular.copy(paramsInit);

    $scope.changePage = function(){
      C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };

    $scope.doSearch = function(o){
      if(angular.isObject(o)){
        C.list($scope, angular.extend(paramsInit, o, {pageNum:1}));
      }
    };
    $scope.changePage();

    //Modal options & actions
    $scope.saveUser = function(user){
      var roles = DDS.get({endpoint:'role', action:'select'}), userInfo;
      roles.$promise.then(function(res){
        var data = C.validResponse(res);
        if(angular.isObject(data)){
          var params={pageNum:$scope.pageNum};
          if(user){
            paramsInit = angular.extend({}, $scope.paramsInit);
            userInfo = angular.extend({}, user);
            angular.extend(params, {action:'edit', id:userInfo.id});
          }
          else{
            angular.extend(params, {action:'add'});
            userInfo = {};
          }
          var modalSet = {
            modalTitle: '用户信息', // modal 窗体标题
            extraData: {roles:data.roles, editMode:params.action==='edit'},
            formData: userInfo || {},
            confirm: function(modalInstance, scope){ // 确认modal callback
              delete scope.formData.role;
              DDS.saveUser(angular.extend(params, scope.formData), function(res){
                C.responseHandler(scope, $scope, modalInstance, res);
              }, function(){
                C.badResponse();
              });
            }
            // ,cancel: C.cancelModal
          };
          C.openModal(modalSet, 'user');
        }
      }, function(){
        C.badResponse();
      });
    };
    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这条用户记录？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delUser({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    };
  }]);
})();