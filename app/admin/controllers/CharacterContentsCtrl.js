'use strict';

angular.module('app.admin').controller('CharacterContentsController', function ($scope, $timeout, CharacterService, $filter) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;

    $scope.getData = function () {
        $scope.loading = true;

        CharacterService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.save = function () {
        $scope.loading = true;
        var data = $scope.currRow;
        CharacterService.save(data).then(function (res) {
            $('#myModal').modal('hide');
            if($scope.currRow.id == 0){
                var result = angular.fromJson(res);
                $scope.currRow.id = result.data.id;
                $scope.currRow.posted = result.data.posted;
                $scope.tableData.unshift($scope.currRow);
            } else {
                var updateRows = $filter('filter')($scope.tableData, {id: $scope.currRow.id}, true);
                updateRows[0].category = $scope.currRow.category;
                updateRows[0].specs = $scope.currRow.specs;
                updateRows[0].description = $scope.currRow.description;
                updateRows[0].imageurl = $scope.currRow.imageurl;
            }
            $scope.loading = false;
            //$scope.getData();
        });
    };

    $scope.addRow = function () {
        $scope.currRow = {
            id: 0,
            category: '',
            specs: '',
            description: '',
            imageurl: ''
        };
    };

    $scope.editRow = function (row) {
        $scope.currRow = JSON.parse(angular.toJson(row));
        $('#myModal').modal('show');
    };

    $scope.deleteRow = function (rowId, rowInd) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            CharacterService.delete(rowId).then(function () {
                //$scope.getData();
                $scope.tableData.splice(rowInd, 1);
                $scope.loading = false;
            });
        }
    };
});