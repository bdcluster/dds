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
  }]);
})();