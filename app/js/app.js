(function(){
  'use strict';
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
  .run(['$rootScope', '$location', 'AuthService', 'C', function($rootScope, $location, AuthService, C) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
      var isLogged = AuthService.isLogged || C.storage().get('isLogged');
      if (nextRoute.access && nextRoute.access.requiredLogin && !isLogged) {
        $location.path('/login');
      }
    });
  }])
  .config(['$routeProvider','$httpProvider', 'localStorageServiceProvider', function($routeProvider, $httpProvider, localStorageServiceProvider){

    // $httpProvider.interceptors.push('TokenInterceptor');

    $routeProvider
      .when('/login', {
        templateUrl: viewPath + 'login.html',
        controller:  'AdminController',
        access: { requiredLogin: false }
      })
      .when('/chgpwd', {
        templateUrl: viewPath + 'chgpwd.html',
        controller:  'ChangePasswordController',
        access: { requiredLogin: true }
      })
      .when('/home', {
        templateUrl: viewPath + 'home.html',
        controller:  'HomeController',
        access: { requiredLogin: true }
      })
      .when('/user', {
        templateUrl: viewPath + 'user.html',
        controller:  'UserController',
        access: { requiredLogin: true }
      })
      .when('/role', {
        templateUrl: viewPath + 'role.html',
        controller:  'RoleController',
        access: { requiredLogin: true }
      })
      .when('/customer', {
        templateUrl: viewPath + 'cust.html',
        controller:  'CustomerController',
        access: { requiredLogin: true }
      })
      .when('/driver', {
        templateUrl: viewPath + 'driv.html',
        controller:  'DriverController',
        access: { requiredLogin: true }
      })
      .when('/order', {
        templateUrl: viewPath + 'order.html',
        controller:  'OrderController',
        access: { requiredLogin: true }
      })
      .when('/month-ord', {
        templateUrl: viewPath + 'month-ord.html',
        controller:  'OrderFilterController',
        access: { requiredLogin: true }
      })
      .when('/quarter-ord', {
        templateUrl: viewPath + 'quarter-ord.html',
        controller:  'OrderFilterController',
        access: { requiredLogin: true }
      })
      .when('/time-ord', {
        templateUrl: viewPath + 'time-ord.html',
        controller:  'OrderFilterController',
        access: { requiredLogin: true }
      })
      .when('/rule', {
        templateUrl: viewPath + 'rule.html',
        controller:  'RuleController',
        access: { requiredLogin: true }
      })
      .when('/template', {
        templateUrl: viewPath + 'template.html',
        controller:  'RuleTemplateController',
        access: { requiredLogin: true }
      })
      .when('/tempDetail/:id', {
        templateUrl: viewPath + 'tempDetail.html',
        controller:  'RuleTemplateDetailController',
        access: { requiredLogin: true }
      })
      .when('/ruleDetail/:id', {
        templateUrl: viewPath + 'ruleDetail.html',
        controller:  'RuleDetailController',
        access: { requiredLogin: true }
      })
      .when('/help', {
        templateUrl: viewPath + 'help.html',
        access: { requiredLogin: true }
      })
      .when('/demo', {
        templateUrl: viewPath + 'demo.html',
        controller:  'DemoController',
        access: { requiredLogin: true }
      })
      .otherwise({redirectTo: '/home'});

    $httpProvider.defaults.transformRequest = function(obj){
      var str = [];
      for(var p in obj){
        if(obj[p] !== null){
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
      return str.join("&");
    };

    // HTTP POST
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    //set localStorage type as sessionStorage
    localStorageServiceProvider.setStorageType('sessionStorage');

    $httpProvider.defaults.withCredentials = true;
  }]);
})();