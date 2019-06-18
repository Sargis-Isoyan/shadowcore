(function () {
    'use strict';

    angular.module('app.admin')
        .factory('SettingService', ['$http', '$q', 'ServerURL', function ($http, $q, ServerURL) {
            return {
                setSetting: function (data) {
                    var url = ServerURL + 'setting';
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
                getSetting: function () {
                    var url = ServerURL + 'setting';
                    var deferred = $q.defer();
                    $http.get(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }
            };
        }]);
})();