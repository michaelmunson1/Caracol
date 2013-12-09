//angular app
'use strict'

var app = angular.module('app', ['ngRoute',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/vote.html',
      controller: 'VoteCtrl'
    })
    .when('/vote', {
      templateUrl: '/partials/vote.html',
      controller: 'LoginCtrl'
    })
    .when('/recs', {
      templateUrl: '/partials/recommendation.html',
      controller: 'RecCtrl'
    })
    .otherwise({
      redirectTo: '/partials/login.html'
    });
}).run(function($rootScope, $location, UploadService){
  //check for session
  //if session do this
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  $rootScope.hidden = false;
  UploadService.sendURI(uri)
  .then(function(data){
    console.log('saved clipping to db, id:', data);
  }, function(error){
    console.log('failed to save clipping to db', error);
  });

  $rootScope.hide = function(){
    $rootScope.hidden = !$rootScope.hidden;
  };
  //else
  //change route to login
});
