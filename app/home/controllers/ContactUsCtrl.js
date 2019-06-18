"use strict";

angular.module('app.home').controller('HomeContactUsController', function ($scope, $rootScope, $window, ContactUsService) {
    $scope.$rootScope = $rootScope;

    $scope.sendData = {
        email: '',
        firstname: '',
        lastname: '',
        message: '',
        subject: 'General'
    };

    $scope.isContact = true;
    $scope.scrollDown = function () {
        $window.scrollTo(0, angular.element('.contact-ways').offset().top - 100);
    };
    $scope.onSend = function () {
        if($scope.sendData.email == '' || $scope.sendData.firstname == '' || $scope.sendData.lastname == '' || $scope.sendData.message == '')
            return;

        ContactUsService.post($scope.sendData).then(function (re) {
            $scope.isContact = false;
            console.log('ContactUs Post : ' + re);
        });

    };
})
