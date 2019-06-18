(function () {
    'use strict';

    angular.module('app.admin')
        .factory('CharacterService', ['$http', '$q', 'ServerURL', function ($http, $q, ServerURL) {
            return {
                get: function (sdate, edate) {
                    var url = ServerURL + 'characters';
                    if(sdate && edate){
                      url += '?sdate=' + sdate + '&edate=' +edate;
                    }
                    var deferred = $q.defer();
                    $http.get(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                save: function (data) {
                    var url = ServerURL + 'characters';
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
                    var url = ServerURL + 'characters?id=' + rowId;
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