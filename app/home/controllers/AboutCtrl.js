"use strict";

angular.module('app.home').controller('HomeAboutController', function ($scope, $rootScope, $state, $window, AboutmeService) {
    $scope.$rootScope = $rootScope;
    $scope.scrollDown = function () {
        $window.scrollTo(0, angular.element('.content-section').offset().top - 100);
    };


    $scope.loading = true;
    $scope.data = [];
    $scope.selectedItem = {};
    AboutmeService.get().then(function (response) {
        $scope.loading = false;
        $scope.data = response.data;
        if($scope.data.length){
            $scope.selectedItem = $scope.data[0];
        }

    });

    $scope.selectRow = function (item) {
        $scope.selectedItem = item;
    }
});
