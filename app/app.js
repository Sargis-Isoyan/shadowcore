'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
    'ngSanitize',
    'ngAnimate',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'momentPicker',
    // Smartadmin Angular Common Module
    'SmartAdmin',
    // App
    'app.auth',
    'app.layout',
    'app.forms',
    'app.home',
    'app.admin',
    'slick',
    'smart-table',
    'duScroll'
])
    .config(function ($provide, $httpProvider, RestangularProvider) {

        // Intercept for taking token.
        $provide.factory('tokenInjector', function ($q) {
            var sessionInjector = {
                request: function (config) {
                    if (sessionStorage.token) {
                        config.headers['x-auth-token'] = sessionStorage.token;
                    }
                    return config;
                }
            };
            return sessionInjector;
        });


        // Intercept http calls.
        $provide.factory('ErrorHttpInterceptor', function ($q) {
            var errorCounter = 0;

            function notifyError(rejection) {
                $.bigBox({
                    title: rejection.status + ' ' + rejection.statusText,
                    content: rejection.data,
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }

            return {
                // On request failure
                requestError: function (rejection) {
                    // show notification
                    notifyError(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response failure
                responseError: function (rejection) {
                    // show notification
                    if (rejection.status == 403) {
                        notifyError(rejection);
                        setTimeout(function () {
                            window.location.href = window.location.protocol + '//' + window.location.host + "/#login", true;
                        }, 3 * 1000)
                    }

                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('ErrorHttpInterceptor');
        $httpProvider.interceptors.push('tokenInjector');

        RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));

    })
    .constant('APP_CONFIG', window.appConfig)

    .constant('ServerURL', 'https://serebrumlab.com/shadowcore/api/')
    //.constant('ServerURL', 'http://127.0.0.1:8081/api/')

    .constant('UdidTypes', [
        {key: 'steam', value: 'Steam'},
        {key: 'psvr', value: 'PSVR'},
        {key: 'oculus_home', value: 'OculusHome'},
        {key: 'itch.io', value: 'Itch.io'},
        {key: 'fanatical', value: 'Fanatical'},
        {key: 'greenmangaming', value: 'GreenManGaming'},
        {key: 'humblebundle', value: 'HumbleBundle'},
        {key: 'hrkgame', value: 'HRKGame'}
    ])


    .run(function ($rootScope, $state, $stateParams, $window) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.pageActiveDot = 0;
        // editableOptions.theme = 'bs3';

        angular.element($window).bind("mousewheel DOMMouseScroll MozMousePixelScroll scroll", function () {    // for the background of header bar.
            $rootScope.scrollTop = $window.pageYOffset;

            var body = document.body,
                html = document.documentElement;

            var height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);

            $rootScope.pageHeight = height;

            $rootScope.pageActiveDot = Math.round($rootScope.scrollTop / height * 4);
            $rootScope.$apply();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, $state) {
            if (toState.name.substr(0, 6) != 'about.') {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            if (toState.name.substr(0, 9) == 'app.admin') {
                if (sessionStorage.isLogin != 'true') {
                    $rootScope.$state.go('login');
                }
            }
        });

    })
;