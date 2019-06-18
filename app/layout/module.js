"use strict";


angular.module('app.layout', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/layout.tpl.html'
                }
            }
        });

    if(/^admin/.test(location.host)){
        $urlRouterProvider.otherwise('/login');
    }else{
        $urlRouterProvider.otherwise('/home');
    }

    if(!/^localhost/.test(location.host)){
        $locationProvider.html5Mode(true);
    }
})

