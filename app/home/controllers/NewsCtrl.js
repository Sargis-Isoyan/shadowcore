"use strict";

angular.module('app.home').controller('HomeNewsController', function ($scope, $rootScope, $window, NewsService, SubscribersService) {
    $scope.$rootScope = $rootScope;
    $scope.months = [{
        str: 'All',
        sdate: '',
        edate: ''
    }];
    $scope.selectedMonth = {};
    $scope.getMonthStrings = function () {
        var now = new Date();
        var y = now.getFullYear();
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (var m = now.getMonth() + 1; m >= 1; m--) {
            var startDate = moment([y, m - 1]);
            var endDate = moment(startDate).endOf('month');

            $scope.months[$scope.months.length] = {
                str: monthNames[m - 1],
                sdate: startDate.format("YYYY-MM-DD"),
                edate: endDate.format("YYYY-MM-DD")
            };
        }
        var preYear = y - 1;
        $scope.months[$scope.months.length] = {
            str: preYear,
            sdate: preYear + "-01-01",
            edate: preYear + "-12-31"
        };
    };
    $scope.getMonthStrings();

    $scope.loading = false;
    $scope.limit = 0;
    $scope.step = 10;
    $scope.getData = function (item) {
        item = item || $scope.months[0];
        $scope.selectedMonth = item;
        $scope.news = [];
        $scope.loading = true;
        NewsService.get(item.sdate, item.edate).then(function (response) {
            $scope.loading = false;
            $scope.news = response.data;
            $scope.limit = $scope.step*1;
            var i = 0;
            angular.forEach($scope.news, function (val, key) {
                console.log(val);
                if(val.imageurl){
                    val.image = val.imageurl;
                }else{
                    val.image = "../styles/img/temp/news/item" + (i % 2 + 1) + ".jpg";
                    i++;
                }
                if(val.isVideo){
                    val.url = val.videoUrl;
                }else{
                    val.url = val.image;
                }
            });
        });
    };
    $scope.getData($scope.months[0]);

    $scope.scrollDown = function () {
        $window.scrollTo(0, angular.element('.months-wrapper').offset().top - 100);
    };
})

.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //call the function that was passed
                scope.$apply(attrs.imageonload);
            });
        }
    };
})