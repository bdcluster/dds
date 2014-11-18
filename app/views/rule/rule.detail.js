(function(){
  'use strict';
  angular.module('RuleDetailModule', []).controller('RuleDetailController', [
    '$routeParams','$scope','$location','C','DDS', function(
     $routeParams,  $scope,  $location,  C,  DDS){

    var hash = $location.path(), paramsInit = {action:'detail', id: $routeParams.id};
    if(hash.indexOf('template')!==-1){
      angular.extend(paramsInit, {endpoint: 'template'});
    }
    if(hash.indexOf('rule')!==-1){
      angular.extend(paramsInit, {endpoint: 'rule'})
    }
    C.list($scope, paramsInit);
    $scope.goBack = function(){
      history.back();
    };
  
  }]);
})();