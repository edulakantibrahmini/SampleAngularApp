'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view2',
  'myApp.version',
  'myApp.factory',
  'myApp.constant'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/processJSON', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
  $routeProvider.otherwise({redirectTo: '/processJSON'});
}]);
