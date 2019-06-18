"use strict";

angular.module('app.home').controller('HomeJoinTeamController', function ($scope, $rootScope, $window, JointeamimageService, ContactUsService) {
    $scope.$rootScope = $rootScope;
    $scope.screenWidth = $window.innerWidth;
    $scope.items = [];

    $scope.getData = function (item) {
        $scope.loading = true;
        JointeamimageService.get().then(function (response) {
            $scope.loading = false;
            $scope.items = response.data;
            var i = 0;
            angular.forEach($scope.items, function (val, key) {
                if(val.imageurl){
                    val.image = val.imageurl;
                }else{
                    val.image = "../styles/img/temp/join/item1.jpg";
                    i++;
                }
                if(val.isVideo){
                    val.url = val.videoUrl;
                }else{
                    val.url = val.image;
                }
            });
        });
    };
    $scope.getData();


    $scope.scrollDown = function () {
        $window.scrollTo(0, angular.element('.questions-div').offset().top - 100);
    };

    $scope.isContact = true;
    $scope.sendData = {
        email: '',
        firstname: '',
        lastname: '',
        message: '',
        subject: 'Join Team'
    };
    $scope.onSend = function () {
        if($scope.sendData.email == '' || $scope.sendData.firstname == '' || $scope.sendData.lastname == '' || $scope.sendData.message == '')
            return;
        ContactUsService.post($scope.sendData).then(function (re) {
            $scope.isContact = false;
            console.log('ContactUs Post : ' + re);
        });
    };


});
