(function(){
  'use strict';
  angular.module('DdsFilters', [])
  .filter('myDate', ['$filter', function($filter){
    return function(d){
      var mydate, argu;
      if(d){
        mydate = new Date(d);
        argu = arguments[1] || 'yyyy-MM-dd hh:mm:ss';
        return $filter('date')(mydate, argu);
      }
    };
  }]);
})();