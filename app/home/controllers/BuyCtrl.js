"use strict";

angular.module('app.home').controller('HomeBuyFormController', function ($scope, $rootScope, $window, $stateParams, SettingService, UdidsService, ServerURL) {
    $scope.$rootScope = $rootScope;
    if($stateParams.type){
        $scope.key = $stateParams.type;
        if($scope.key == '1key'){
            $scope.keyCnt = 1;
        }else if($scope.key == '3keys'){
            $scope.keyCnt = 3;
        }else{
            $scope.keyCnt = 5;
        }
    }
    $scope.setting = {};
    SettingService.getSetting().then(function (res) {
        var data = res.data;
        $scope.setting = data;
    })


    $scope.sendData = {
        type:'steam'
    }

    $scope.onBuy = function () {
        $scope.waiting = true;
        UdidsService.getValidKeyCount().then(function (res) {
            var data = res.data;
            if(data[$scope.sendData.type] >= $scope.keyCnt){
                $window.open(ServerURL + "paypal/order?keycnt="+$scope.keyCnt+'&type='+$scope.sendData.type+'&first_name='+$scope.sendData.firstname+'&last_name='+$scope.sendData.lastname+'&email='+$scope.sendData.email, "_self");
                return true;
            }else{
                $scope.waiting = false;
                $.bigBox({
                    title: 'Failed',
                    content: 'Sorry not enough keys for now',
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: '',
                    timeout: 6000
                });
            }
        })
    }

});
