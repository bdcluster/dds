(function(){
  'use strict';
  var app = angular.module('DdsFilters', [])
  /* 司机状态 0:空闲, 1:忙碌, 2:代驾中 */
  .filter('driveStatus', function(){
    return function(code){
      switch(code){
        case 0:
          return '空闲';
        case 1:
          return '忙碌';
        case 2:
          return '代驾中';
        default:
          return '未知';
      }
    }
  })
  /*  1=是； 2=否*/
  .filter('isVIP', function(){
    return function(vip){
      if (vip===1) return '是';
      else return '否';
    }
  });
})();