(function(){
  'use strict';
  angular.module('DdsFilters', [])
  .filter('myDate', ['$filter', function($filter){
    return function(d){
      var mydate, argu;
      if(d){
        mydate = new Date(d);
        argu = arguments[1] || 'yyyy-MM-dd HH:mm:ss';
        return $filter('date')(mydate, argu);
      }
    };
  }])
  .filter('cutDesc', function(){
    return function(desc){
      if (desc && desc.length>10) return desc.substring(0, 15) + '...';
      else return desc;
    };
  });
})();