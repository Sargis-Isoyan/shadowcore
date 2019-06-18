"use strict";

angular.module('app.auth').controller('LoginCtrl', function ($scope, $state, UsersService) {
    $scope.password = '';
    $scope.login = function () {
        if($('#login-form').valid()){
            UsersService.login($scope.name, $scope.password).then(function (res) {
                if(sessionStorage.isSupperAdmin == 1){
                    $state.go('app.admin');
                }else{
                    $state.go('app.admin.grossrevenue');
                }
            });
        }
    }
})
