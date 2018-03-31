(function () {
  'use strict';
  angular.module('app')
    .controller('loginCtrl', ['$rootScope', '$scope', '$http', '$mdDialog', '$timeout', 'jwtHelper', 'store', '$location', 'factoriaAutentificacion', '$mdToast', '$routeParams', 'serverUrl', '$route', '$window', loginCtrl]);

  function loginCtrl($rootScope, $scope, $http, $mdDialog, $timeout, jwtHelper, store, $location, factoriaAutentificacion, $mdToast, $routeParams, serverUrl, $route, $window) {
    $scope.tmpGLOBALPERM = "";
    $http({
        method: 'POST',
        skipAuthorization: true,
        url: './consultas/login/login.php',
        data: {
          'tempLogin': true
        },
        headers: {
          'GLOBALPERM': 'login'
        }
      })
      .then(function (data) {
        $scope.tmpGLOBALPERM = data.data.temp;
      });
    $scope.personaLogin = function (user) {
      user.GLOBALPERM = $scope.tmpGLOBALPERM;
      factoriaAutentificacion.login(user)
        .then(function (res) {
          if (res.data.code === 0) {
            store.set('token', res.data.response.token);
            $scope.tokendata = jwtHelper.decodeToken(res.data.response.token);
            $mdToast.showSimple("Wrong Login");
            //$window.location.href = "/usa/#/search";
            $location.path("/index");
            $scope.$on('$locationChangeSuccess', function () {
              $window.location.reload(true);
            });
          }
          else {
            $mdToast.showSimple(res.data.error);
          }
        });
    };
    $scope.personaLogout = function () {
      store.remove('token');
      $window.location.reload(true);
    };
    $scope.cambioVista = function (val) {
      if (val == 1) {
        $location.path("/search");
      }
      else if (val == 2) {
        $location.path("/index");
      }
      else if (val == 4) {
        $location.path("/change");
      }
      else {
        $location.path("/admin");
      }
    }
    $scope.changePassLogin = function (passwd) {
      if (passwd.oldPassword === passwd.newPassword) {
        $mdToast.showSimple("New and old password don't have to be the same");
      }
      else {
        if (passwd.newPassword === passwd.confPassword) {
          /* Compraracion de claves */
          if ($scope.password !== "") {
            $http.post('./consultas/login/changePassword.php', {
                'email': $rootScope.email,
                'password': passwd.newPassword
              })
              .then(function (data) {
                if (data.data.code === 0) {
                  $mdToast.showSimple("The password has been successfully updated");
                  $window.location.reload();
                  $location.path("/");
                }
                else {
                  $mdToast.showSimple("Failed to change password");
                }
              });
          }
          else {
            $mdToast.showSimple("Password is incorrect or malformed");
          }
        }
        else {
          $mdToast.showSimple("Passwords are not similar.");
        }
      }
    };
    $scope.resetPass = function (email) {
      $http.post('./consultas/email/forget_password.php', {
          'email': email
        })
        .then(function (email != NULL ) {
          $mdToast.showSimple("New password has been sent to your email");
        })
        .catch(function (email) {
          $mdToast.showSimple("Write you e-mail");
        });
    }
    /* Cambio de clave */
    var token = $routeParams.token;
    var idpersona = $routeParams.id;
    $scope.estado = "Desactivado";
    if (token) {
      $scope.tokendata = jwtHelper.decodeToken(token);
      if (!isNaN(idpersona)) {
        $scope.estado = "Activo";
        $scope.idUser = idpersona;
        $scope.keySecret = $scope.tokendata.aud;
      }
      else {
        $scope.estado = "Incorrect or Expired Token";
        $mdToast.showSimple("Incorrect or Expired Token");
      }
    }
    $scope.generatePassLogin = function () {
      $http({
          method: 'POST',
          skipAuthorization: true,
          url: './consultas/login/generate_password.php',
          data: {
            'idUser': $scope.idUser,
            'secretKey': $scope.keySecret,
            'password': $scope.password
          },
          headers: {
            'GLOBALPERM': $scope.tmpGLOBALPERM
          }
        })
        .then(function (data) {
          if (data.data.code === 0) {
            $mdToast.showSimple("Password Generated Correctly");
            $window.location.reload();
            $location.path("/");
          }
          else if (data.data.code === 2) {
            $mdToast.showSimple("Secret key error");
          }
          else {
            $mdToast.showSimple("Error to change password");
          }
        });
    };
  }
}());
