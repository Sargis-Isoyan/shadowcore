'use strict';

angular.module('app.admin').controller('SaleReportTable1Controller', function ($scope, $timeout, SaleReportTable1Service, $filter) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;

    $scope.getData = function () {
        $scope.loading = true;

        SaleReportTable1Service.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.save = function () {
        $scope.loading = true;
        var data = $scope.currRow;
        SaleReportTable1Service.save(data).then(function (res) {
            $('#myModal').modal('hide');
            if($scope.currRow.id == 0){
                var result = angular.fromJson(res);
                $scope.currRow.id = result.data.id;
                $scope.currRow.posted = result.data.posted;
                $scope.tableData.unshift($scope.currRow);
            } else {
                var updateRows = $filter('filter')($scope.tableData, {id: $scope.currRow.id}, true);
                updateRows[0].name = $scope.currRow.name;
                updateRows[0].reg_date = $scope.currRow.reg_date;
                updateRows[0].paltform = $scope.currRow.paltform;
                updateRows[0].unit = $scope.currRow.unit;
                updateRows[0].amount = $scope.currRow.amount;
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
            reg_date: moment().format("YYYY-MM-DD"),
            paltform: 'steam',
            unit: '',
            amount: ''
        };
    };

    $scope.editRow = function (row) {
        $scope.currRow = JSON.parse(angular.toJson(row));
        $('#myModal').modal('show');
    };

    $scope.deleteRow = function (rowId, rowInd) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            SaleReportTable1Service.delete(rowId).then(function () {
                //$scope.getData();
                $scope.tableData.splice(rowInd, 1);
                $scope.loading = false;
            });
        }
    };
});