"use strict";

angular.module('app.home').controller('newLetterController', function ($scope, $rootScope, $window, SubscribersService) {
    $scope.$rootScope = $rootScope;
    $scope.subscriber = {
        email: ''
    }
    $scope.isadded =false;
    $scope.saving = false;
    $scope.onSubscriber = function () {
        $scope.saving = true;
        if (!$scope.dataform.email.$error.email && !$scope.dataform.email.$error.required) {
            SubscribersService.post($scope.subscriber).then(function (re) {
                $scope.saving = false;
                if (re.data) {
                    $scope.isadded =true;
                    $.bigBox({
                        title: 'Success',
                        content: 'Your email is successfully registered in our site',
                        color: "#6d97b8",
                        icon: "fa fa-key shake animated",
                        number: '',
                        timeout: 6000
                    });
                } else {
                    $.bigBox({
                        title: 'Failed',
                        content: 'Your email is already registered in our site',
                        color: "#C46A69",
                        icon: "fa fa-warning shake animated",
                        number: '',
                        timeout: 6000
                    });
                }
            });
        }
    }
})