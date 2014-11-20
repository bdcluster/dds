(function(){
  'use strict';
  angular.module('LoginModule', []).controller('LoginController', [
    '$rootScope','$scope','$filter','$timeout','$location','AuthService','C','DDS', function(
     $rootScope,  $scope,  $filter,  $timeout,  $location,  AuthService,  C,  DDS){
    
    $rootScope.title = '登录 - 代驾平台';
    var storage = C.storage();

    AuthService.isLogged = false;
    $rootScope.isLogged = false;
    $rootScope.menus = [];
    storage.clear();

    $scope.checkLogin = function(){
      /*
        login success:
          1. sessionStorage: token & userId & loginInfo
          2. authService.isLogin value is true
          3. sessionStorage: menu,province
      */
      $scope.user.password = $filter('md5')($scope.user.password);
      $scope.master = angular.copy($scope.user);
      // 登录验证
      // var paramsInit = angular.extend({endpoint: 'login-index'}, $scope.user);
      DDS.login($scope.user, function(res){
        var data = C.validResponse(res);
        if(angular.isObject(data)){
          AuthService.isLogged = true;
          storage.set('isLogged', true);
          storage.set('userId', data.user.userId);
          storage.set('loginInfo', data.user);

          var menus = DDS.get({endpoint:'menu', action:'select', type:2, userId:data.user.userId});
          menus.$promise.then(function(result){
            var menus = C.validResponse(result);

            if(angular.isObject(menus)){
              storage.set('menus', result.data); //缓存菜单
              $scope.hideLogin=true; //为login容器添加fade-out样式
              $timeout(function(){
                $rootScope.isLogged = true;
                $location.path('/home');
              }, 500);
            }
          }, function(){C.badResponse();});
        }
      }, function(){C.badResponse();});
    };

    $scope.isUnchanged = function(user){
      return angular.equals(user, $scope.master);
    };
  }]);
})();