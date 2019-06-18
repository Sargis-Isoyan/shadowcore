'use strict';

angular.module('app.admin').controller('MailboxController', function ($scope, $filter, $timeout, MailboxService) {
    $scope.tableData = $scope.safeData = [];
    $scope.selectedRow = {};
    $scope.loading = true;

    $scope.getData = function () {
        $scope.loading = true;

        MailboxService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            angular.forEach($scope.tableData, function (row) {
                if(row.to_emails){
                    row.users = row.to_emails.split(",");
                }else{
                    row.users = [];
                }

            })
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.detailsView = function (row) {
        $scope.selectedRow = row;
        $('#myModal').removeData('modal').modal( { show: true } );
    };
    // $('#voiceModal').modal('hide');

    $scope.deleteRow = function (rowId) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            MailboxService.delete(rowId).then(function () {
                $scope.getData();
            });
        }
    };
});