'use strict';

angular.module('app.admin').controller('SettingsController', function ($scope, $timeout, SettingService, UdidTypes) {
    $scope.buyButtonCnt = 1;
    $scope.buttonTextFor1Keys = '';
    $scope.PriceFor1Keys = '';
    $scope.buttonTextFor3Keys = '';
    $scope.PriceFor3Keys = '';
    $scope.buttonTextFor5Keys = '';
    $scope.PriceFor5Keys = '';    
    $scope.buyWidgetTitle = '';

    /*
    $scope.option_stream = '';
    $scope.option_psvr = '';
    $scope.option_oculus_home = '';
    */

    $scope.UdidTypes = UdidTypes;

    $scope.loadData = function () {
        $scope.loading = true;
        SettingService.getSetting().then(function (res) {
            var data = res.data;
            $scope.buyButtonCnt = data.buyButtonCnt;
            $scope.buttonTextFor1Keys = data.buttonTextFor1Keys;
            $scope.PriceFor1Keys = data.PriceFor1Keys;
            $scope.buttonTextFor3Keys = data.buttonTextFor3Keys;
            $scope.PriceFor3Keys = data.PriceFor3Keys;
            $scope.buttonTextFor5Keys = data.buttonTextFor5Keys;
            $scope.PriceFor5Keys = data.PriceFor5Keys;            
            $scope.buyWidgetTitle = data.buyWidgetTitle;

            $scope.options = {};
            for(var i=0; i<UdidTypes.length;i++){
                var key = "option_"+UdidTypes[i].key;
                $scope.options[UdidTypes[i].key] = data[key]==1;
            }

            $scope.loading = false;
        })
    }
    $scope.loadData();


    $scope.save = function () {
        $scope.loading = true;
        var data = {
            buyButtonCnt: $scope.buyButtonCnt,
            buttonTextFor1Keys: $scope.buttonTextFor1Keys,
            PriceFor1Keys: $scope.PriceFor1Keys,
            buttonTextFor3Keys: $scope.buttonTextFor3Keys,
            PriceFor3Keys: $scope.PriceFor3Keys,
            buttonTextFor5Keys: $scope.buttonTextFor5Keys,
            PriceFor5Keys: $scope.PriceFor5Keys,            
            buyWidgetTitle: $scope.buyWidgetTitle,
        };
         for(var i=0; i<UdidTypes.length;i++){
            var key = "option_"+UdidTypes[i].key;
            data[key] = $scope.options[UdidTypes[i].key];
        }   

        SettingService.setSetting(data).then(function (re) {
            $scope.loading = false;
        }, function(){
            $scope.loading = false;
        });
    };
});