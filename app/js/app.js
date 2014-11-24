(function(){
  'use strict';
  var viewPath = "/views";
  angular.module('DdsApp', [
    'ngMd5',
    'ngRoute',
    'ngLocale',
    'ngResource',
    'ui.bootstrap',
    'LocalStorageModule',
    'DdsControllers',
    'DdsDirectives',
    'DdsResources',
    'DdsServices',
    'DdsTemplate',
    'DdsFilters'
  ])
  .run(['$rootScope', '$location', 'AuthService', 'C', function($rootScope, $location, AuthService, C) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
      var isLogged = AuthService.isLogged || C.storage().get('isLogged');
      if (nextRoute.access && nextRoute.access.requiredLogin && !isLogged) {
        $location.path('/login');
      }
    });
  }])
  .config(['$provide', '$routeProvider','$httpProvider', 'localStorageServiceProvider', function($provide, $routeProvider, $httpProvider, localStorageServiceProvider){

    // $httpProvider.interceptors.push('TokenInterceptor');

    $routeProvider
      .when('/login', {
        templateUrl: viewPath + '/common/login.html',
        controller:  'LoginController',
        access: { requiredLogin: false }
      })
      .when('/home', {
        templateUrl: viewPath + '/common/home.html',
        controller:  'HomeController',
        access: { requiredLogin: true }
      })
      .when('/chgpwd', {
        templateUrl: viewPath + '/common/pwd.html',
        controller:  'ChangePasswordController',
        access: { requiredLogin: true }
      })
      .when('/user', {
        templateUrl: viewPath + '/user/user.html',
        controller:  'UserController',
        access: { requiredLogin: true }
      })
      .when('/role', {
        templateUrl: viewPath + '/role/role.html',
        controller:  'RoleController',
        access: { requiredLogin: true }
      })
      .when('/customer', {
        templateUrl: viewPath + '/customer/customer.html',
        controller:  'CustomerController',
        access: { requiredLogin: true }
      })
      .when('/driver', {
        templateUrl: viewPath + '/driver/driver.html',
        controller:  'DriverController',
        access: { requiredLogin: true }
      })
      .when('/order', {
        templateUrl: viewPath + '/order/order.html',
        controller:  'OrderController',
        access: { requiredLogin: true }
      })
      .when('/orderPeriod', {
        templateUrl: viewPath + '/order/order.period.list.html',
        controller:  'OrderController',
        access: { requiredLogin: true }
      })
      .when('/month-ord', {
        templateUrl: viewPath + '/order/order.month.html',
        controller:  'OrderPeriodController',
        access: { requiredLogin: true }
      })
      .when('/quarter-ord', {
        templateUrl: viewPath + '/order/order.quarter.html',
        controller:  'OrderPeriodController',
        access: { requiredLogin: true }
      })
      .when('/time-ord', {
        templateUrl: viewPath + '/order/order.period.html',
        controller:  'OrderPeriodController',
        access: { requiredLogin: true }
      })
      .when('/rule', {
        templateUrl: viewPath + '/rule/rule.html',
        controller:  'RuleController',
        access: { requiredLogin: true }
      })
      .when('/template', {
        templateUrl: viewPath + '/rule/tmpl.html',
        controller:  'RuleTemplateController',
        access: { requiredLogin: true }
      })
      .when('/template/:id', {
        templateUrl: viewPath + '/rule/tmpl.detail.html',
        controller:  'RuleDetailController',
        access: { requiredLogin: true }
      })
      .when('/rule/:id', {
        templateUrl: viewPath + '/rule/rule.detail.html',
        controller:  'RuleDetailController',
        access: { requiredLogin: true }
      })
      .when('/help', {
        templateUrl: viewPath + '/common/help.html',
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

    //interpolate ngForm and ngModel names
    $provide.decorator('ngModelDirective', ['$delegate', function($delegate) {
      var ngModel = $delegate[0], controller = ngModel.controller;
      ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
        var $interpolate = $injector.get('$interpolate');
        attrs.$set('name', $interpolate(attrs.name || '')(scope));
        $injector.invoke(controller, this, {
          '$scope': scope,
          '$element': element,
          '$attrs': attrs
        });
      }];
      return $delegate;
    }]);
    $provide.decorator('formDirective', ['$delegate', function($delegate) {
      var form = $delegate[0], controller = form.controller;
      form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
        var $interpolate = $injector.get('$interpolate');
        attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
        $injector.invoke(controller, this, {
          '$scope': scope,
          '$element': element,
          '$attrs': attrs
        });
      }];
      return $delegate;
    }]);
  }]);
})();