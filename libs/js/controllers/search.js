(function() {
  'use strict';
  angular.module('app')
    .factory('PagerService', PagerService)
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
    $scope.page = 0;
    $scope.greeting = 0;
    $scope.greetingTotal=0;
    $scope.pages=0;
    $scope.data = {
      someModel : ""
    };
    var datoSearch;
    $scope.mostrarDetallado = function(ev, searchArray) {
      $scope.showDialog(ev, searchArray);
    };
    $scope.getNumber = function() {
        $scope.number = $scope.greetingTotal;
        return new Array($scope.number);   
    }
    $scope.previousNext = function(a, b, c, d, e, f, val) {
      var newVal = $scope.greetingTotal;
      if (val == newVal) {
        $scope.currentPage = (val-1);
        $scope.page = $scope.currentPage;
      }
      else if (val < 0) {
        $scope.currentPage = 0;
        $scope.page = $scope.currentPage;
      } else {
        $scope.currentPage = val;
        $scope.page = $scope.currentPage;
      }
      $scope.traeDatosAdvance(a, b, c, d, e, f);

    };
    $scope.traeDatosAdvance = function(a, b, c, d, e, f) {
      if (a || b || c || d || e || f) {
        delete $http.defaults.headers.common;
        delete $scope.greeting;
        var term, typeEntry, nombre, address, pais, depar, term1, typeEntry1, nombre1, address1, pais1, depar1;
        if (!a) {
          term = "";
        } else {
          term = "&q=" + a;
        }
        if (!b) {
          typeEntry = "";
        } else {
          typeEntry = "&type=" + b;
        }
        if (!c) {
          nombre = "";
        } else {
          nombre = "&name=" + c;
        }
        if (!d) {
          address = "";
        } else {
          address = "&address=" + d;
        }
        if (!e) {
          pais = "";
        } else {
          pais = "&countries=" + e;
        }
        if (!f) {
          depar = "";
        } else {
          depar = "&sources=" + f;
        }
        $http.get(serverUrl + "&offset=" + $scope.currentPage * 10 + term + typeEntry + nombre + address + pais + depar + "&fuzzy_name=true&sort=name:desc")
          .then(function(response) {
            $scope.greeting = response.data.results;
            $scope.great = response.data.total;
            $scope.greetingTotal = Math.round(parseInt(response.data.total) / 10);
            // console.log(response.data.results);
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
              .then(function(data) {
                $mdToast.showSimple("Search's Registered");
              });
          });
      } else {
        $mdToast.showSimple("You must enter some data in the fields");
      }
    };
    $scope.clearSearchTerm = function() {
      $scope.botonhide = 'false';
      $scope.searchTerm = '';
    };
    $scope.vg = function(ev) {
      ev.stopPropagation();
    };
    $scope.showDialog = function(ev, searchArray) {
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
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.country = paises.country();
      $scope.searchDetalle = [];
      $scope.searchDetalle.push(locals.searchArray);
      $scope.muestraDocumento = function(name) {
        var query = "https://www.federalregister.gov/api/v1/documents.json?fields%5B%5D=publication_date&fields%5B%5D=start_page&fields%5B%5D=volume&per_page=20&order=relevance&conditions%5Bterm%5D=";
        var query2 = query + name.replace(" ", "%20") + "&conditions%5Btype%5D%5B%5D=NOTICE";
        var trustedUrl = $sce.trustAsResourceUrl(query2);
        $http.jsonp(trustedUrl)
          .then(function(response) {
            $scope.fdr = response.data.results;
          });
      };
      $scope.muestraDocumento($scope.searchDetalle[0].name.replace(/[^a-zA-Z 0-9.]+/g, ''));
      $scope.fechaAjust = function(fecha) {
        var arregloDeSubCadenas = fecha.split("-");
        var fechanueva = arregloDeSubCadenas[1] + "/" + arregloDeSubCadenas[2] + "/" + arregloDeSubCadenas[0]
        return fechanueva;
      };
    };
    $scope.paginate = function() {
      $scope.muestraSearches($scope.currentNavItem);
    }
    $scope.muestraSearches = function(val) {
      $scope.query = {
        order: 'name',
        limit: 10,
        page: 1
      };
      if (val == "2") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 2,
            'idUser': $rootScope.idUser
          })
          .then(function(response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_all_search.php', {
            'idUser': $rootScope.idUser,
            'page': $scope.query.page,
            'limit': $scope.query.limit
          })
          .then(function(response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function(response) {
            $scope.myListSearch = [];
          });
      } else if (val == "3") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 3,
            'idUser': $rootScope.idUser
          })
          .then(function(response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_by_empresas.php', {
            'idUser': $rootScope.idUser,
            'page': $scope.query.page,
            'limit': $scope.query.limit
          })
          .then(function(response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function(response) {
            $scope.myListSearch = [];
          });
      } else if (val == "4") {
        $http.post('consultas/busquedas/contador.php', {
            'opcion': 1
          })
          .then(function(response) {
            $scope.contador = response.data.records[0].contador;
          });
        $http.post('consultas/busquedas/read_all.php', $scope.query)
          .then(function(response) {
            $scope.myListSearch = response.data.records;
          })
          .catch(function(response) {
            $scope.myListSearch = [];
          });
      } else if (val == "5") {
        $http.post('consultas/busquedas/read_search_empresa.php', {
            query: $scope.query2
          })
          .then(function(response) {
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
    $scope.changeEmpresa = function(){
      // console.log($scope.query.page);
      $scope.variableprueba = $scope.data.someModel;
      $http.post('consultas/busquedas/contadorByComp.php',{
        'idUser' : $scope.data.someModel
      })
        .then(function (response) {
          $scope.contador2 = response.data.records;
          $scope.contadorPagination = parseInt($scope.contador2[0].contador);
          // console.log($scope.contadorPagination);
        });
      $http.post('consultas/busquedas/read_search_company.php',{
        'idUser' : $scope.data.someModel,
        'page': $scope.query.page,
        'limit': $scope.query.limit
      })
      .then(function(response){
        $scope.search_company = response.data.records;
        // console.log(response.data.records);
      });
    }
    $scope.muestraAllList = function() {
      $http.post('consultas/busquedas/contador.php', {
          'opcion': 1
        })
        .then(function(response) {
          $scope.contador = response.data.records[0].contador;
        });
      $http.post('consultas/busquedas/read_all.php', $scope.query)
        .then(function(response) {
          $scope.myListSearch = response.data.records;
        });
    }
    $scope.paisNombre = function(val) {
      var nombre = _.find(paises.country(), function(o) {
        return o.code == val;
      });
      return nombre ? nombre.name : "-";
    }
    $scope.sourceNombre = function(val) {
      var nombre = _.find(paises.sources(), function(o) {
        return o.code == val;
      });
      return nombre ? nombre.name : "-";
    }
  }

  function ExampleController(PagerService) {
    var vm = this;
    vm.dummyItems = _.range(1, 151); // dummy array of items to be paged
    vm.pager = {};
    vm.setPage = setPage;
    initController();

    function initController() {
      // initialize to page 1
      vm.setPage(1);
    }

    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
        return;
      }
      // get pager object from service
      vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
      // get current page of items
      vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
  }

  function PagerService() {
    // service definition
    var service = {};
    service.GetPager = GetPager;
    return service;
    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
      // default to first page
      currentPage = currentPage || 1;
      // default page size is 10
      pageSize = pageSize || 10;
      // calculate total pages
      var totalPages = Math.ceil(totalItems / pageSize);
      var startPage, endPage;
      if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
          startPage = 1;
          endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
          startPage = totalPages - 9;
          endPage = totalPages;
        } else {
          startPage = currentPage - 5;
          endPage = currentPage + 4;
        }
      }
      // calculate start and end item indexes
      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
      // create an array of pages to ng-repeat in the pager control
      var pages = _.range(startPage, endPage + 1);
      // return object with all pager properties required by the view
      return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
      };
    }
  }
}());
