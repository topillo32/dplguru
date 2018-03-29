(function () {
  'use strict';
  angular.module('app')
    .controller("adminCtrl", ['$rootScope', '$scope', '$http', '$mdDialog', '$mdToast', '$window', 'paises', adminCtrl]);

  function adminCtrl($rootScope, $scope, $http, $mdDialog, $mdToast, $window, paises) {
    $scope.user = {};
    $scope.readEmpresa = function () {
      $http.get("consultas/busquedas/read_empresa.php")
        .then(function (response) {
          $scope.empresaSel = response.data.records;
        });
      $scope.country = paises.country();
    }
    $scope.currentF = function () {
      if ($rootScope.loginPermisos == 1 || $rootScope.loginPermisos == 0) {
        $scope.currentNavItem = 1;
      }
      else {
        $scope.currentNavItem = 2;
      }
      if ($rootScope.loginPermisos == 0) {
        $scope.readEmpresa();
      }
    }
    $scope.createUser = function () {
      var comp;
      if ($rootScope.loginPermisos != 0) {
        comp = $rootScope.loginCompany;
      }
      else {
        comp = $scope.user.company;
      }
      if ($scope.user.passwd == $scope.user.repasswd) {
        $http.post('consultas/login/create_usuario.php', {
            'email': $scope.user.email,
            'password': $scope.user.passwd,
            'idCompany': comp,
            'permiso': parseInt($scope.user.permisos),
            'userName': $scope.user.userName
          })
          .then(function (response) {
            $mdToast.showSimple(response.data.records.datos);
            load();
          });
      }
      else {
        $mdToast.showSimple("Invalid Password");
      }
    }
    $scope.createEmpresa = function (empr) {
      $http.post('consultas/empresas/create_empresa.php', {
          'name': empr.name,
          'company': empr.company,
          'titulo': empr.titulo,
          'city': empr.city,
          'country': empr.country,
          'zipcode': empr.zipcode,
          'phone': parseInt(empr.phone),
          'street': empr.street
        })
        .then(function (response) {
          $mdToast.showSimple(response.data.records.datos);
        });
    }
    $scope.readUsers = function () {
      $http.get("consultas/busquedas/read_users.php")
        .then(function (response) {
          $scope.userSel = response.data.records;
        });
    }
    $scope.updateActivo = function (val, email) {
      var activo;
      if (val == false) {
        activo = 0;
      }
      else {
        activo = 1;
      }
      $http.post('consultas/busquedas/update_user_disable.php', {
          'activo': activo,
          'email': email
        })
        .then(function (response) {
          $mdToast.showSimple("User Updated");
        });
    };
    $scope.readCompanies = function () {
      $http.get("consultas/busquedas/read_all_empresas.php")
        .then(function (response) {
          $scope.companySel = response.data.records;
        });
    }
    $scope.updateActivoEmpresa = function (val, id) {
      var activo;
      if (val == false) {
        activo = 0;
      }
      else {
        activo = 1;
      }
      $http.post('consultas/busquedas/update_company_disable.php', {
          'activo': activo,
          'idCompany': id
        })
        .then(function (response) {
          $mdToast.showSimple("User Updated");
        });
    };
    var load = function () {
      setTimeout(function () {
        $window.location.reload();
      }, 1000);
    }
  }
}());
