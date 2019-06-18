(function () {
    'use strict';

    angular.module('app.admin')
        .factory('SaleReportTable2Service', ['$http', '$q', 'ServerURL', function ($http, $q, ServerURL) {
            return {
                get: function () {
                    var url = ServerURL + 'report2';

                    var deferred = $q.defer();
                    $http.get(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                getReport: function () {
                    var url = ServerURL + 'report2/report';
                    var deferred = $q.defer();
                    $http.get(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                save: function (data) {
                    var url = ServerURL + 'report2';
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                        url: url,
                        headers: {'Content-Type': 'multipart/form-data'},
                        data: data
                    }).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                delete: function (rowId) {
                    var deferred = $q.defer();
                    var url = ServerURL + 'report2?id=' + rowId;
                    $http.delete(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
            };
        }]);
})();