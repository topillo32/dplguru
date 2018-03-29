angular.module('app')
  .run(["$rootScope", 'jwtHelper', 'store', '$location', function ($rootScope, jwtHelper, store, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
      $rootScope.modoSistemLogin = angular.module('app')
        .modoSistemLogin;
      angular.module('app')
        .modoSistemLogin = true;
      var permiso = false;
      var pathname = window.location.href;
      if (angular.module('app')
        .modoSistemLogin) {
        //para verificar si el uso de login esta activo
        var token = store.get("token") || null;
        if (!token && angular.module('app')
          .modoSistemLogin === true && next.authorization === true) {
          $location.path("/");
        }
        if (token) {
          var bool = jwtHelper.isTokenExpired(token);
        }
        else {
          var bool = true;
        }
        if (bool === true) {
          if (pathname.indexOf("/changepasswd") != -1) {
            var bool = false;
          }
          else {
            $location.path("/");
          }
        }
        else {
          if (token) {
            /* Permisos Roles */
            var data = jwtHelper.decodeToken(token);
            permiso = true;
            if (permiso) {
              $rootScope.loginPermisos = data.aud.permiso;
              $rootScope.loginCompany = data.aud.id;
              $rootScope.userName = data.aud.nombreUsuario;
              $rootScope.idUser = data.aud.idUser;
              $rootScope.email = data.aud.mail;
            }
            else {
              alert("Sorry, you don't have permissions for this section");
              $location.path("/");
            }
          }
        }
      }
    });
  }]);
