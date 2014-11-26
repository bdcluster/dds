(function(){
  'use strict';
  angular.module('DdsResources', []).factory('DDS', [
    '$rootScope','$resource','$window','$location',function(
     $rootScope,  $resource,  $window,  $location){

    var http = $location.protocol(), 
        host = $location.host(), 
        port = $location.port()==='' ? '' : ':' + $location.port(), 
        proj = '/ddrive-platform-web';
    var url, normalPrarms={};

    var runtimeEvn = function(){
      /*
        0: 本地环境, 连mock数据
        1: 本地环境, 连远程API
      */
      var ua = navigator.userAgent.toLowerCase();
      var host = $window.location.host,
          port = $location.port(),
          local= /^(localhost|127\.0)/i,
          remote = /^static.ddriver.com/i,
          dev = /^10\.10\.40\.250/i;
      if(port === 9000 && local.test(host)) {
        return 0;
      }
      else if(port === 9000 && remote.test(host)){
        return 1;
      }
      else {
        return 10;
      }
    };
    
    // 前端开发环境
    if(runtimeEvn() === 0) {
      port = ':8084';
      proj = '';
      angular.extend(normalPrarms, {local:1, mock:1, enforce:1, chaos:Math.random()});
    }
    else if(runtimeEvn() ===1){
      host = '10.10.40.250';
      port = ':8080';
    }
    // $rootScope.codeUrl = http + '://' + host + port + proj + '/getCheckCode';
    url = http + '://' + host + port + proj + '/:endpoint/:action/:id';

    return $resource(url, normalPrarms, {
      login:{
        method:'GET',
        params:{endpoint:'login-index'}
      },
      signOut:{
        method:'GET',
        params:{endpoint:'logout'}
      },
      savePwd:{
        method:'POST',
        params:{endpoint:'password', action:'change'}
      },
      delUser:{
        method:'POST',
        params:{endpoint:'user', action:'delete', id:'@id'}
      },
      saveUser:{
        method:'POST',
        params:{endpoint:'user', action:'@action', id:'@id'}
      },
      delRole:{
        method:'POST',
        params:{endpoint:'role', action:'delete', id:'@id'}
      },
      saveRole:{
        method:'POST',
        params:{endpoint:'role', action:'@action', id:'@id'}
      },
      saveCust:{
        method:'POST',
        params:{endpoint:'customer', action:'@action', id:'@id'}
      },
      saveDriv:{
        method:'POST',
        params:{endpoint:'driver', action:'@action', id:'@id'}
      },
      delDriv:{
        method:'POST',
        params:{endpoint:'driver', action:'delete', id:'@id'}
      },
      saveRule:{
        method:'POST',
        params:{endpoint:'rule', action:'@action', id:'@id'}
      },
      delRule:{
        method:'POST',
        params:{endpoint:'rule', action:'delete', id:'@id'}
      },
      saveRuleTemp:{
        method:'POST',
        params:{endpoint:'template', action:'@action', id:'@id'}
      },
      delRuleTemp:{
        method:'POST',
        params:{endpoint:'template', action:'delete', id:'@id'}
      }
    });
  }]);
})();