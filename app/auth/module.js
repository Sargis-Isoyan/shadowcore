"use strict";

angular.module('app.auth', [
    'ui.router'
]).config(function ($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                root: {
                    templateUrl: 'app/auth/views/login.html',
                    controller: 'LoginCtrl'
                }
            },
            data: {
                title: 'Login',
                htmlId: 'extr-page'
            },
            resolve: {
                srcipts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }
        })
})