(function(){
  'use strict';
  window.DEBUG = true;
  // var viewPath = window.DEBUG ? 'views/' : 'dist/views/';
  var viewPath = 'views/';
  var app = angular.module('DdsApp', [
    'ngMd5',
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'DdsControllers',
    'DdsDirectives',
    'DdsTemplate',
    'DdsServices',
    'DdsFilters',
    'LocalStorageModule'
  ])
  .config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider){
    $routeProvider
      .when('/chgpwd', {
        templateUrl: viewPath + 'chgpwd.html',
        controller:  'ChangePasswordController'
      })
      .when('/home', {
        templateUrl: viewPath + 'home.html',
        controller:  'HomeController'
      })
      .when('/user', {
        templateUrl: viewPath + 'user.html',
        controller:  'UserController'
      })
      .when('/role', {
        templateUrl: viewPath + 'role.html',
        controller:  'RoleController'
      })
      .when('/customer', {
        templateUrl: viewPath + 'cust.html',
        controller:  'CustomerController'
      })
      .when('/driver', {
        templateUrl: viewPath + 'driv.html',
        controller:  'DriverController'
      })
      .when('/order', {
        templateUrl: viewPath + 'order.html',
        controller:  'OrderController'
      })
      .when('/page2', {
        templateUrl: viewPath + 'form.login.html'
      })
      .otherwise({redirectTo: '/home'});

    $httpProvider.defaults.transformRequest = function(obj){
      var str = [];
      for(var p in obj){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
      return str.join("&");
    }

    // HTTP POST
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }]);
})();