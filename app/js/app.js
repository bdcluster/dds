(function(){
  'use strict';
  window.DEBUG = true;
  var viewPath = window.DEBUG ? 'views/' : 'dist/views/';
  var app = angular.module('DdsApp', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'DdsControllers',
    'DdsServices',
    'DdsDirectives'
  ]);

  app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    var sideMenu = {
      templateUrl: viewPath + 'menu.html',
      controller:  'MenuListController',
      controllerAs:'ml'
    };

    $urlRouterProvider.otherwise("/home");
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          'viewMenu':sideMenu,
          'viewMain':{
            templateUrl: viewPath + 'home.html'
          }
        }
      })
      .state('page2', {
        url: '/page2',
        views:{
          'viewMenu':sideMenu,
          'viewMain':{
            templateUrl: viewPath + 'form.login.html'
          }
        }
      })
  }]);
})();