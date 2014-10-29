(function(){
  'use strict';
  var app = angular.module('DdsFilters', [])
  .filter('myDate', ['$filter', function($filter){
    return function(d){
      var mydate = new Date(d);
      var argu = arguments[1] || 'yyyy-MM-dd hh:mm:ss';
      return $filter('date')(mydate, argu);
    };
  }])
  /* 司机状态 0:空闲, 1:忙碌, 2:代驾中 */
  .filter('driveStatus', function(){
    return function(code){
      switch(code){
        case 2:
          return '空闲';
        case 1:
          return '忙碌';
        case 3:
          return '代驾中';
        default:
          return '未知';
      }
    };
  })
  .filter('billStatus', function(){
    return function(code){
      switch(code){
        case 0 :
          return '<i class="glyphicon glyphicon-ok-sign"></i>';
        case 1 :
          return '<i class="glyphicon glyphicon glyphicon-remove-sign"></i>';
        default:
          return '<i class="glyphicon glyphicon glyphicon-question-sign"></i>';
      }
    };
  })
  /* 代驾时长 */
  .filter('serveTime', function(){
    return function(hour){
      if(angular.isNumber(hour)){
        return hour + '小时';
      }
      else{
        return '';
      }
    };
  })
  /*  1=是； 2=否*/
  .filter('isVIP', function(){
    return function(vip){
      if (vip===1) return '是';
      else return '否';
    };
  });
})();