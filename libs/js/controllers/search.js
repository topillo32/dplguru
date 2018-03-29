(function () {
  'use strict';
  angular.module('app')
    .controller("searchCtrl", ['$rootScope', '$scope', '$http', '$mdDialog', '$sce', '$mdToast', 'paises', 'serverUrl', searchCtrl]);

  function searchCtrl($rootScope, $scope, $http, $mdDialog, $sce, $mdToast, paises, serverUrl) {
    $scope.query = {
      order: 'name',
      limit: 10,
      page: 1
    };
    $scope.query2 = [];
    $scope.contador = "";
    $scope.contador2 = [];
    $scope.permiso = $rootScope.loginPermisos;
    $scope.searchType = "1";
    $scope.country = paises.country();
    $scope.departamentos = paises.sources();
    $scope.botonhide = "";
    $scope.advanceButon = "1";
    $scope.filtroSearch = '&name=';
    $scope.currentPage = 0;
    var datoSearch;
    $scope.mostrarDetallado = function (ev, searchArray) {
      $scope.showDialog(ev, searchArray);
    };
    $scope.previousNext = function (a, b, c, d, e, f, val) {
      if (val == "2") {
        $scope.currentPage = $scope.currentPage + 1;
      }
      else {
        $scope.currentPage = $scope.currentPage - 1;
      }
      $scope.page = $scope.currentPage;
      $scope.traeDatosAdvance(a, b, c, d, e, f);
    };
    $scope.traeDatosAdvance = function (a, b, c, d, e, f) {
      if (a || b || c || d || e || f) {
        delete $http.defaults.headers.common;
        delete $scope.greeting;
        var term, typeEntry, nombre, address, pais, depar, term1, typeEntry1, nombre1, address1, pais1, depar1;
        if (!a) {
          term = "";
        }
        else {
          term = "&q=" + a;
        }
        if (!b) {
          typeEntry = "";
        }
        else {
          typeEntry = "&type=" + b;
        }
        if (!c) {
          nombre = "";
        }
        else {
          nombre = "&name=" + c;
        }
        if (!d) {
          address = "";
        }
        else {
          address = "&address=" + d;
        }
        if (!e) {
          pais = "";
        }
        else {
          pais = "&countries=" + e;
        }
        if (!f) {
          depar = "";
        }
        else {
          depar = "&sources=" + f;
        }
        $http.get(serverUrl + "&offset=" + $scope.currentPage * 10 + term + typeEntry + nombre + address + pais + depar + "&fuzzy_name=true&sort=name:desc")
          .then(function (response) {
            $scope.greeting = response.data.results;
            $scope.great = response.data.total;
            $scope.greetingTotal = Math.round(parseInt(response.data.total) / 10);
            $scope.contadorMatches = 0;
            for (var i = 0; i < $scope.greeting.length; i++) {
              $scope.contadorMatches = $scope.contadorMatches + 1;
              if ($scope.greeting[i].alt_names) {
                for (var j = 0; j < $scope.greeting[i].alt_names.length; j++) {
                  $scope.contadorMatches = $scope.contadorMatches + 1;
                }
              }
            }
            $http.post('consultas/busquedas/insert_search.php', {
                'idUser': parseInt($rootScope.idUser),
                'term': a ? a : "",
                'type': b ? b : "",
                'name': c ? c : "",
                'source': f ? f : "",
                'country': e ? e : "",
                'address': d ? d : "",
                'matches': $scope.contadorMatches
              })
              .then(function (data) {
                $mdToast.showSimple("Search's Registered");
              });
          });
      }
      else {
        $mdToast.showSimple("You must enter some data in the fields");
      }
    };
    $scope.clearSearchTerm = function () {
      $scope.botonhide = 'false';
      $scope.searchTerm = '';
    };
    $scope.vg = function (ev) {
      ev.stopPropagation();
    };
    $scope.showDialog = function (ev, searchArray) {
      $mdDialog.show({
        controller: dialogCtrl,
        templateUrl: 'templates/showMore.html',
        locals: {
          searchArray: searchArray
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    };

    function dialogCtrl($scope, $mdDialog, locals) {
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.country = paises.country();
      $scope.searchDetalle = [];
      $scope.searchDetalle.push(locals.searchArray);
      $scope.muestraDocumento = function (name) {
        var query = "https://www.federalregister.gov/api/v1/documents.json?fields%5B%5D=publication_date&fields%5B%5D=start_page&fields%5B%5D=volume&per_page=20&order=relevance&conditions%5Bterm%5D=";
        var query2 = query + name.replace(" ", "%20") + "&conditions%5Btype%5D%5B%5D=NOTICE";
        var trustedUrl = $sce.trustAsResourceUrl(query2);
        $http.jsonp(trustedUrl)
          .then(function (response) {
            $scope.fdr = response.data.results;
          });
      };
      $scope.muestraDocumento($scope.searchDetalle[0].name.replace(/[^a-zA-Z 0-9.]+/g, ''));
      $scope.fechaAjust = function (fecha) {
        var arregloDeSubCadenas = fecha.split("-");
        var fechanueva = arregloDeSubCadenas[1] + "/" + arregloDeSubCadenas[2] + "/" + arregloDeSubCadenas[0]
        return fechanueva;
      };
    };
    $scope.paginate = function () {
      $scope.muestraSearches($scope.currentNavItem);
    }
    $scope.muestraSearches = function (val) {
      if (val == "2") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 2,
            'idUser': $rootScope.idUser
          })
          .then(function (response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_all_search.php', {
            'idUser': $rootScope.idUser,
            'page': $scope.query.page,
            'limit': $scope.query.limit
          })
          .then(function (response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function (response) {
            $scope.myListSearch = [];
          });
      }
      else if (val == "3") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 3,
            'idUser': $rootScope.idUser
          })
          .then(function (response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_by_empresas.php', {
            'idUser': $rootScope.idUser,
            'page': $scope.query.page,
            'limit': $scope.query.limit
          })
          .then(function (response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function (response) {
            $scope.myListSearch = [];
          });
      }
      else if (val == "4") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 1
          })
          .then(function (response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_all.php', $scope.query)
          .then(function (response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function (response) {
            $scope.myListSearch = [];
          });
      }
      else if (val == "5") {
        $http.get('consultas/busquedas/contadorEmpresas.php')
          .then(function (response) {
            $scope.contador2 = response.data.records;
          });
        $http.post('consultas/busquedas/read_search_empresa.php', {
            query: $scope.query2
          })
          .then(function (response) {
            $scope.myListSearch2 = response.data.records;
            for (var i = 0; i < response.data.records.length; i++) {
              $scope.query2.push({
                order: 'name',
                limit: 10,
                page: 1
              });
            }
          });
      }
    }
    $scope.muestraAllList = function () {
      $http.post('consultas/busquedas/contador.php', {
          'opcion': 1
        })
        .then(function (response) {
          $scope.contador = response.data.records[0].contador;
        });
      $http.post('consultas/busquedas/read_all.php', $scope.query)
        .then(function (response) {
          $scope.myListSearch = response.data.records;
        });
    }
    $scope.paisNombre = function (val) {
      var nombre = _.find(paises.country(), function (o) {
        return o.code == val;
      });
      return nombre ? nombre.name : "-";
    }
    $scope.sourceNombre = function (val) {
      var nombre = _.find(paises.sources(), function (o) {
        return o.code == val;
      });
      return nombre ? nombre.name : "-";
    }
  }
}());
