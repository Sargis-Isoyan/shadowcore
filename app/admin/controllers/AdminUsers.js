'use strict';

angular.module('app.admin').controller('AdminUsersController', function ($scope, $timeout, UsersService, $filter) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;

    $scope.getData = function () {
        $scope.loading = true;

        UsersService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.save = function () {
        if(!$scope.currRow.name){
            alert("You must input user name");
            return true;
        }
        if(!$scope.currRow.password || $scope.currRow.password  != $scope.currRow.confirm_password){
            alert("password does not match");
            return true;
        }
        $scope.loading = true;
        var data = $scope.currRow;
        UsersService.save(data).then(function (res) {
            $('#myModal').modal('hide');
            if($scope.currRow.id == 0){
                var result = angular.fromJson(res);
                $scope.currRow.id = result.data.id;
                $scope.currRow.posted = result.data.posted;
                $scope.tableData.unshift($scope.currRow);
            } else {
                var updateRows = $filter('filter')($scope.tableData, {id: $scope.currRow.id}, true);
                updateRows[0].name = $scope.currRow.name;
                updateRows[0].email = $scope.currRow.email;
                updateRows[0].first_name = $scope.currRow.first_name;
                updateRows[0].last_name = $scope.currRow.last_name;
            }
            $scope.loading = false;
            //$scope.getData();
        }, function () {
            $scope.loading = false;
        });
    };

    $scope.addRow = function () {
        $scope.currRow = {
            id: 0,
            name: '',
            email: '',
            first_name: '',
            last_name: '',
            password: ''
        };
    };

    $scope.editRow = function (row) {
        if(row.is_supperadmin == "1"){
            alert("You cannot edit supper admin");
            return true;
        }
        $scope.currRow = JSON.parse(angular.toJson(row));
        $scope.currRow.password = "#password#";
        $scope.currRow.confirm_password = "#password#";
        $('#myModal').modal('show');
    };

    $scope.deleteRow = function (row, rowInd) {
        if(row.is_supperadmin == "1"){
            alert("You cannot delete supper admin");
            return true;
        }
        var rowId = row.id;
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            UsersService.delete(rowId).then(function () {
                //$scope.getData();
                $scope.tableData.splice(rowInd, 1);
                $scope.loading = false;
            });
        }
    };
});