(function(){
  'use strict';
  var app = angular.module('DdsFilters', [])
  /*  1=是； 2=否*/
  .filter('isVIP', function(){
    return function(vip){
      if (vip===1) return '是';
      else return '否';
    }
  });
})();