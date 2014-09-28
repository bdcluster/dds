(function(){
  'use strict';
  window.DEBUG = true;
  // var viewPath = window.DEBUG ? 'views/' : 'dist/views/';
  var viewPath = 'views/';
  var app = angular.module('DdsApp', [
    'ngMd5',
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ui.bootstrap',
    'DdsControllers',
    'DdsServices',
    'DdsDirectives',
    'DdsTemplate'
  ])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/home', {
        templateUrl: viewPath + 'home.html',
        controller:  'HomeController'
      })
      .when('/page2', {
        templateUrl: viewPath + 'form.login.html'
      })
      .otherwise({redirectTo: '/home'});
  }]);
})();