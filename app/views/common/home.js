(function(){
  'use strict';
  angular.module('HomeModule', []).controller('HomeController', [
    '$rootScope','$scope','$location','AuthService','C','DDS', function(
     $rootScope,  $scope,  $location,  AuthService,  C,  DDS){
    
    $rootScope.title = '首页 - 代驾平台';
    var storage = C.storage();
    var index = storage.get('opendAccordion');
    var params = {endpoint:'provinces', action:'select'};
    var key = params.endpoint;

    C.closeMenu();

    $scope.provincesData = function(){
      DDS.get(params, function(res){
        var data = C.validResponse(res);
        if(angular.isObject(data)){
          storage.set(key, data);
        }
      }, function(res){
        C.badResponse(res);
      });
    };
    if(!storage.get(key)){
      $scope.provincesData();
    }

  }]);
})();