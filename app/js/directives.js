(function(){
  'use strict';
  var app = angular.module('DdsDirectives', [])
  /* 自定义规则指令 */
  .directive('setrule', function(){
    return{
      restrict: 'EA',
      templateUrl: 'views/template.rules.html',
      transclude:true,
      scope: {
        demo: '='
      },
      controller: function(){
        /* controller code here */
      },
      link: function(scope, ele, attr){
        /* link directive code here */
      }
    }
  })
})();