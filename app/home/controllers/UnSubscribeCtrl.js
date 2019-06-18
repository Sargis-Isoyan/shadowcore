"use strict";

angular.module('app.home').controller('HomeUnSubscribeController', function ($scope, $rootScope, $window, SubscribersService, $stateParams) {
    $scope.$rootScope = $rootScope;
    if($stateParams.email){
        $scope.loading = true;
        SubscribersService.deleteByEmail($stateParams.email).then(function () {
            $scope.loading = false;
        });
    }
});
