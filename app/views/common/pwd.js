(function(){
  'use strict';
  angular.module('PasswordModule', []).controller('ChangePasswordController', [
    '$scope','$filter','C','DDS', function(
     $scope,  $filter,  C,  DDS){
    
    var storage = C.storage().get('loginInfo');
    $scope.pwd = {};
    $scope.pwdSubmit = function(){
      var postData = { 
        userId: storage.userId,
        sessionId : storage.sessionId,
        id: storage.id,
        oldPassword: $filter('md5')($scope.pwd.oldPwd),
        newPassword: $filter('md5')($scope.pwd.newPwd)
      };
      $scope.master = angular.copy($scope.pwd);
      DDS.savePwd(postData, function(res){
        var data = C.validResponse(res);
        if(angular.isObject(data)){
          C.alert({type:"success", msg:"密码修改成功，稍后请重新登录!"});
          C.delayJump('/login', true);
        }
      }, function(){
        C.badResponse();
      });
    };

    $scope.isUnchanged = function(pwd){
      return (angular.equals(pwd, $scope.master) || pwd.newPwd !== pwd.rpNewPwd);
    };
  }]);
})();