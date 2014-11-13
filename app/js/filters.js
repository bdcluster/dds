(function(){
  'use strict';
  var app = angular.module('DdsFilters', [])
  .filter('myDate', ['$filter', function($filter){
    return function(d){
      var mydate, argu;
      if(d){
        mydate = new Date(d);
        argu = arguments[1] || 'yyyy-MM-dd hh:mm:ss';
        return $filter('date')(mydate, argu);
      }
    };
  }])
  /*  1=是； 2=否*/
  .filter('isVIP', function(){
    return function(vip){
      if (vip===1) return '是';
      else return '否';
    };
  });
})();