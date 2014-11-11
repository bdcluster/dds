(function(){
  'use strict';
  angular.module('DdsServices', [])
  .factory('AuthService', [function(){
    var auth = {
        isLogged: false
    };
    return auth;
  }])
})();