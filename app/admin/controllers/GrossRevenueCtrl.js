'use strict';

angular.module('app.admin').controller('GrossRevenueController', function ($scope, $timeout, SaleReportTable1Service) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;

    $scope.sum = {
        total_unit:0,
        total_amount:0,
        steam_unit:0,
        steam_amount:0,
        facebook_unit:0,
        facebook_amount:0,
        sony_unit:0,
        sony_amount:0,
        other_unit:0,
        other_amount:0
    }

    $scope.getData = function () {
        $scope.loading = true;

        SaleReportTable1Service.getReport().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            response.data.forEach(function (row) {
                $scope.sum.total_unit += row.total_unit*1;
                $scope.sum.total_amount += row.total_amount*1;
                $scope.sum.steam_unit += row.steam_unit*1;
                $scope.sum.steam_amount += row.steam_amount*1;
                $scope.sum.facebook_unit += row.facebook_unit*1;
                $scope.sum.facebook_amount += row.facebook_amount*1;
                $scope.sum.sony_unit += row.sony_unit*1;
                $scope.sum.sony_amount += row.sony_amount*1;
                $scope.sum.other_unit += row.other_unit*1;
                $scope.sum.other_amount += row.other_amount*1;
            })
            $scope.loading = false;
        });
    };
    $scope.getData();
});