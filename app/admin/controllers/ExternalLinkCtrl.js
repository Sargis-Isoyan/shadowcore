'use strict';

angular.module('app.admin').controller('ExternalLinksController', function ($scope, $timeout, SettingService, UdidTypes) {
    $scope.facebookUrl = '';
    $scope.twitterUrl = '';
    $scope.youtubeUrl = '';
    $scope.redditUrl = '';
    $scope.discordUrl = '';
    $scope.pinterestUrl = '';
    $scope.UdidTypes = UdidTypes;
    /*
    $scope.buyOnStreamUrl = '';
    $scope.buyOnPlayStationUrl = '';
    $scope.buyOnOculusHomeUrl = '';
    */

    $scope.loadData = function () {
        $scope.loading = true;
        SettingService.getSetting().then(function (res) {
            var data = res.data;
            $scope.facebookUrl = data.facebookUrl;
            $scope.twitterUrl = data.twitterUrl;
            $scope.youtubeUrl = data.youtubeUrl;
            $scope.redditUrl = data.redditUrl;
            $scope.discordUrl = data.discordUrl;
            $scope.pinterestUrl = data.pinterestUrl;
            $scope.buyUrls = {};
            for(var i=0; i<UdidTypes.length;i++){
                var key = "buyOn"+UdidTypes[i].key+"Url";
                $scope.buyUrls[UdidTypes[i].key] = data[key];
            }            
            $scope.loading = false;
        })
    }
    $scope.loadData();


    $scope.save = function () {
        $scope.loading = true;
        var data = {
            facebookUrl: $scope.facebookUrl,
            twitterUrl: $scope.twitterUrl,
            youtubeUrl: $scope.youtubeUrl,
            redditUrl: $scope.redditUrl,
            discordUrl: $scope.discordUrl,
            pinterestUrl: $scope.pinterestUrl,
            buyOnStreamUrl: $scope.buyOnStreamUrl,
            buyOnPlayStationUrl: $scope.buyOnPlayStationUrl,
            buyOnOculusHomeUrl: $scope.buyOnOculusHomeUrl
        };
        for(var i=0; i<UdidTypes.length;i++){
            var key = "buyOn"+UdidTypes[i].key+"Url";
            data[key] = $scope.buyUrls[UdidTypes[i].key];
        }    
        SettingService.setSetting(data).then(function (re) {
            $scope.loading = false;
        }, function(){
            $scope.loading = false;
        });

    };
});