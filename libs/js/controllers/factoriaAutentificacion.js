(function () {
  'use strict';
  angular.module('app')
    .factory("factoriaAutentificacion", ["$http", "$q", factoriaAutentificacion]);

  function factoriaAutentificacion($http, $q) {
    var factoria = {
      login: function (user) {
        var deferred;
        deferred = $q.defer();
        $http({
            method: 'POST',
            skipAuthorization: true, //no queremos enviar el token en esta petición
            url: './consultas/login/login.php',
            data: {
              email: user.email,
              password: user.password
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'GLOBALPERM': user.GLOBALPERM
            }
          })
          .then(function (res) {
            deferred.resolve(res);
          })
          .then(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
    };
    return factoria;
  }
}());
