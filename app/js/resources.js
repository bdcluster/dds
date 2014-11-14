(function(){
  'use strict';
  angular.module('DdsResources', []).factory('DDS', [
    '$resource','$location','C',function(
     $resource,  $location, C){
      
    var http = $location.protocol(), 
        host = $location.host(), 
        port = $location.port()==='' ? '' : ':' + $location.port(), 
        proj = '/ddrive-platform-web';
    var storage = C.storage(), url, normalPrarms={};
    // 前端开发环境
    if(C.runtimeEvn() === 0) {
      port = ':8084';
      proj = '';
      angular.extend(normalPrarms, {local:1, mock:1, enforce:1});
    }
    else if(C.runtimeEvn() ===1){
      host = '10.10.40.250';
      port = ':8080';
    }
    url = http + '://' + host + port + proj + '/:endpoint/:action/:id';
    /*if(storage.get('token')){
      angular.extend(normalPrarms, {userId:storage.get('userId')})
    }*/

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