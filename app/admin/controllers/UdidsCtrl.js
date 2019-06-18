'use strict';

angular.module('app.admin').controller('UdidsController', function ($scope, $timeout, UdidsService, $filter, UdidTypes) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;

    $scope.UdidTypes = UdidTypes;

    $scope.getData = function () {
        $scope.loading = true;

        UdidsService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.save = function () {
        $scope.loading = true;
        var data = $scope.currRow;
        UdidsService.save(data).then(function (res) {
            $('#myModal').modal('hide');
            $scope.getData();
        });
    };

    $scope.addRow = function () {
        $scope.currRow = {
            id: 0,
            type: 'steam',
            udid: ''
        };
    };

    $scope.editRow = function (row) {
        $scope.currRow = JSON.parse(angular.toJson(row));
        $('#myModal').modal('show');
    };

    $scope.deleteRow = function (rowId, rowInd) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            UdidsService.delete(rowId).then(function () {
                $scope.getData();
            });
        }
    };

    $scope.getTypeTitle = function (value) {
        for(var i=0; i<UdidTypes.length;i++){
            if(UdidTypes[i].key == value){
                return UdidTypes[i].value;
            }
        }
        return "";        
    }
});