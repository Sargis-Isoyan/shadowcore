"use strict";

angular.module('app').controller('mainCtrl', function ($scope, $rootScope, SettingService, UdidTypes) {
    $rootScope.setting = {};
    SettingService.getSetting().then(function (res) {
        var data = res.data;
        $rootScope.setting = data;
        $rootScope.setting.buyUrls = {}
        for(var i=0; i<UdidTypes.length;i++){
            var key = "buyOn"+UdidTypes[i].key+"Url";
            $rootScope.setting.buyUrls[UdidTypes[i].key] = data[key];
        }
        $rootScope.setting.options = {}
        for(var i=0; i<UdidTypes.length;i++){
            var key = "option_"+UdidTypes[i].key;
            $rootScope.setting.options[UdidTypes[i].key] = (data[key]==1);
        }
        console.log($rootScope.setting);
    })

    $rootScope.showAlert = function () {
        alert("sorry commin soon");
    }

    $rootScope.openLink = function (url) {
        if(url){
            window.open(url, "_blank");
        }else{
            $("#myLaterModal").modal()
        }
    }
});
