'use strict';

angular.module('app.admin').controller('BuyersController', function ($scope, $filter, $timeout, BuyersService, MailboxService, exportService) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;
    $scope.allCheck = false;
    $scope.email = {
        subject: '',
        message: ''
    };

    $scope.getData = function () {
        $scope.loading = true;

        BuyersService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
        });
    };
    $scope.getData();

    $scope.deleteRow = function (rowId, rowInd) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            BuyersService.delete(rowId).then(function () {
                $scope.tableData.splice(rowInd, 1);
                $scope.loading = false;
            });
        }
    };
    
    $scope.download = function () {
        var ary = [];
        ary.push(['Email', 'PayPal Email', 'Name', 'Country', 'City','Unit', 'Price($)', 'Platform','Keys','Purchased Date']);
        for (var i=0; i<$scope.tableData.length;i++) {
            var row = $scope.tableData[i];
            ary.push([row.email, row.paypal_email, row.first_name + ' ' + row.last_name, row.country_code, row.city, row.keycnt, row.price, row.type, row.udids,row.purchased]);
        }
        exportService.downloadAsCsv(ary, 'buyers.csv');
    }

    $scope.checkAll = function () {
        angular.forEach($scope.tableData, function (val) {
            val.checked = $scope.allCheck;
        })
    };

    $scope.getCheckedEmails = function () {
        var emails = [];
        angular.forEach($filter('filter')($scope.tableData, {checked: true}), function (val) {
            emails[emails.length] = val.email;
        });
        return emails;
    };

    $scope.initMail = function () {
        var emails = $scope.getCheckedEmails();
        if(emails.length == 0){
            alert("please select user(s) to sent email");
            setTimeout(function () {
                $('#myModal').modal('hide');
            },500)
            return true;
        }
        $scope.email.subject = '';
        $scope.email.message = '';
    };

    $scope.sendMail = function () {
        $scope.loading = true;
        var data = {
            to_emails: $scope.getCheckedEmails(),
            from_email: MailboxService.supportEmail,
            subject: $scope.email.subject,
            message: $scope.email.message,
            mail_flag: 'buyers'
        };
        MailboxService.post(data).then(function () {
            $('#myModal').modal('hide');
            $scope.loading = false;
            //$scope.getData();
        }, function(){
            $scope.loading = false;
        });
    };
});