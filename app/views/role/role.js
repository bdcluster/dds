(function(){
  'use strict';
  angular.module('RoleModule', []).controller('RoleController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS){
    
    var paramsInit = {
      endpoint:'role', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.paramsInit = angular.copy(paramsInit);

    $scope.changePage = function(){
      C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };

    $scope.doSearch = function(o){
      if(angular.isObject(o)){
        C.list(this, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

    $scope.refresh = function(){
      C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
      angular.extend(this, angular.copy(C.empty));
      angular.copy(this.paramsInit, paramsInit);
    };

    $scope.changePage(); // default: load pageNum:1
    $scope.saveRole = function(role){
      var menus = DDS.get({endpoint:'menu', action:'select', type:'1'});
      menus.$promise.then(function(res){
        var data = C.validResponse(res), roleInfo;
        if(angular.isObject(data)){
          var params={pageNum:$scope.pageNum};

          if(role){
            paramsInit = angular.extend({}, $scope.paramsInit);
            var menuIdArray = function(){
              var obj={};
              for(var i=0; i<role.menuIdArray.length; i++){
                obj[role.menuIdArray[i]] = true;
              }
              return obj;
            };
            roleInfo = angular.extend({}, role, {menuIdArray:menuIdArray()});
            angular.extend(params, {action:'edit', id:roleInfo.id});
          }
          else{
            angular.extend(params, {action:'add'});
            roleInfo = {};
          }
          var modalSet = {
            modalTitle: '角色定义', // modal 窗体标题
            formData: roleInfo || {},
            extraData:data,
            confirm: function(modalInstance, scope){ // 确认modal callback
              delete scope.formData.permitList;
              var m = scope.formData.menuIdArray, n=[];
              var menuIdArray = function(){
                for(var x in m){
                  if(m[x]) n.push(x);
                }
                return n;
              };
              scope.formData.menuIdArray = menuIdArray();
              var saveData = DDS.saveRole(angular.extend(params, scope.formData));
              saveData.$promise.then(function(res){
                C.responseHandler(scope, $scope, modalInstance, res);
              }, function(){
                C.badResponse();
              });
            }
            // ,cancel: C.cancelModal
          };
          C.openModal(modalSet, 'role');
        }
      }, function(){
        C.badResponse();
      });
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个角色？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRole({pageNum:$scope.pageNum, id: id}, function(res){
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