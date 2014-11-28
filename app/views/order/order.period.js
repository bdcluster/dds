(function(){
  'use strict';
  angular.module('OrderPeriodModule', []).controller('OrderPeriodController', [
    '$scope','$routeParams','C','DDS', function(
     $scope,  $routeParams,  C,  DDS){
    
    var curYear = new Date().getFullYear(), curMonth = new Date().getMonth() +1;
    $scope.years = C.range(2010, curYear);
    $scope.search = {
      year: curYear,
      month: curMonth,
      quarter: Math.ceil((new Date().getMonth()+1)/3),
      dp1: curYear + '-' + C.twiNum(curMonth) + '-01',
      dp2: curYear + '-' + C.twiNum(curMonth) + '-' + C.mLength()[curMonth]
    };
    var originSearch = angular.copy($scope.search);
    $scope.areas = C.storage().get('provinces');

    var paramsInit = angular.extend({endpoint:'order', action:'statis'}, C.getPeriod($scope.search));
    $scope.paramsInit = angular.copy(paramsInit);
    
    $scope.staticsExport = function(){
      C.exportFile(angular.extend(
        {endpoint:'order', action:'exportStatis'}, 
        C.getPeriod($scope.search),
        $scope.search
      ));
    };

    $scope.changePage = function(){
      C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(){
      if(C.searchFlag(this.search)){
        var s = angular.extend(paramsInit, this.search, C.getPeriod(this.search), {pageNum:1});
        delete s.dp1; s.dp2;
        $scope.search.startTime=s.startTime;
        $scope.search.endTime=s.endTime;
        C.list(this, s);
      }
    };

    $scope.refresh = function(){
      if(!angular.equals(this.paramsInit, paramsInit)){
        C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
        angular.extend(this, angular.copy(C.empty));
        $scope.search = angular.copy(originSearch);
        angular.copy(this.paramsInit, paramsInit);
      }
    };

    $scope.orderByCust = function(cId){
      C.goOrderList(angular.extend({custId: cId}, C.getPeriod($scope.search)));
    };

  }]);
})();