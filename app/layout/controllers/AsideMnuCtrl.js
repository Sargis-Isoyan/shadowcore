'use strict';

angular.module('app.layout').controller('asidemenuCtrl', function ($scope) {
    $scope.isSupperAdmin = sessionStorage.isSupperAdmin == 1;
});