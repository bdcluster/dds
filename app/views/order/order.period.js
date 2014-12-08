(function(){
  'use strict';
  angular.module('OrderPeriodModule', []).controller('OrderPeriodController', [
    '$scope','$routeParams','C','DDS', function(
     $scope,  $routeParams,  C,  DDS){
    
    var storage = C.storage();
    var curYear = new Date().getFullYear(), curMonth = new Date().getMonth() +1;
    var curSearch =  {
      year: curYear,
      month: curMonth,
      quarter: Math.ceil((new Date().getMonth()+1)/3),
      dp1: curYear + '-' + C.twiNum(curMonth) + '-01',
      dp2: curYear + '-' + C.twiNum(curMonth) + '-' + C.mLength()[curMonth]
    };
    $scope.years = C.range(2010, curYear);

    // 如果本地数据保留了搜索数据，则$scope.search直接取该值，取完后删除，否则便初始化一个
    if(storage.get('searchStatus')!==null){
      $scope.search = angular.extend({}, storage.getOnce('searchStatus'));
    }
    else{
      $scope.search = angular.extend({}, curSearch);
    }
    var originSearch = angular.copy($scope.search);
    $scope.areas = storage.get('provinces');

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
      storage.remove('searchData');
      $scope.search = angular.extend({}, curSearch);
      // angular.extend($scope.search, curSearch);

      if(!angular.equals(this.paramsInit, paramsInit)){
        C.list(this, angular.extend(this.paramsInit, C.getPeriod(this.search), {pageNum: 1}));
        angular.extend(this, angular.copy(C.empty));
        $scope.search = angular.copy(curSearch);
        angular.copy(this.paramsInit, paramsInit);
      }
    };

    $scope.orderByCust = function(cId){
      storage.set('searchStatus', $scope.search);
      C.goOrderList(angular.extend({custId: cId}, C.getPeriod($scope.search)));
    };

  }]);
})();