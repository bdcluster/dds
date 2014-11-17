(function(){
  'use strict';
  angular.module('HomeModule', []).controller('HomeController', [
    '$rootScope','$scope','$location','AuthService','C','DDS', function(
     $rootScope,  $scope,  $location,  AuthService,  C,  DDS){
    
    var storage = C.storage();
    if(storage.get('isLogged')){
      $rootScope.menus = storage.get('menus');
      $rootScope.userId = storage.get('userId');
      $rootScope.isLogged=true;
    }

    $scope.provincesData = function(){
      var params = {endpoint:'provinces', action:'select'};
      var key = params.endpoint;
      DDS.get(params, function(res){
        var data = C.validResponse(res);
        if(angular.isObject(data) && !angular.isObject(storage.get(key))){
          storage.set(key, data);
        }
      }, function(){C.badResponse();});
    };
    $scope.provincesData();
  }]);
})();