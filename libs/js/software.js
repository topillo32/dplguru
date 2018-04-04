(function () {
  'use strict';
  angular.module("app", ['ngRoute', 'ngMaterial', 'md.data.table', 'angular-jwt', 'angular-storage', 'ngMessages']);
}());

    (function () {
      'use strict';
      angular.module('app')
        .config(['$routeProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider', 'jwtOptionsProvider', 'storeProvider', '$mdDateLocaleProvider', '$mdThemingProvider', config]);

      function config($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider, storeProvider, $mdDateLocaleProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('');
        storeProvider.setStore('localStorage');
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.interceptors.push('jwtInterceptor');
        jwtInterceptorProvider.tokenGetter = function () {
          return sessionStorage.getItem('token');
        };
        jwtOptionsProvider.config({
          whiteListedDomains: ["https://api.trade.gov/consolidated_screening_list/"]
        });
        if (localStorage.getItem('token')) {
          $httpProvider.defaults.headers.common.globalPerm = localStorage.getItem('token');
        }
        angular.module('app')
          .modoSistemLogin = true;
        $mdDateLocaleProvider.formatDate = function (date) {
          return moment(date)
            .format('DD/MM/YYYY');
        };
        $mdThemingProvider.theme('default')
          .primaryPalette('blue', {
            'default': '900'
          })
          .accentPalette('deep-purple', {
            'default': 'A400'
          })
          .warnPalette('deep-orange', {
            'default': '600'
          });
        $routeProvider.when("/search", {
            templateUrl: "templates/search.html",
            controller: "searchCtrl",
            title: 'Software USA'
          })
          .when("/", {
            title: 'Login',
            templateUrl: "templates/login.html",
            controller: "loginCtrl"
          })
          .when("/admin", {
            title: 'Admin',
            templateUrl: "templates/admin.html",
            controller: "adminCtrl"
          })
          .when("/index", {
            title: 'Index',
            templateUrl: "templates/index.html",
            controller: "loginCtrl"
          })
          .when("/changepasswd/:token/:id", {
            title: 'Change Password',
            templateUrl: "templates/changepasswd.html",
            controller: "loginCtrl",
            authorization: false,
            permissions: false,
            permissionsEmp: false
          })
          .when("/change", {
            title: 'changePassword',
            templateUrl: "templates/change.html",
            controller: "loginCtrl"
          })
          .otherwise({
            redirectTo: "/"
          });
      }
    }());

angular.module('app')
  .constant("serverUrl", 'https://api.trade.gov/consolidated_screening_list/search?api_key=6ZRkkBFTdh9lHTTttqzDamXs');

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
          load();
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
          $mdToast.showSimple("Company Updated");
        });
    };
    var load = function () {
      setTimeout(function () {
        $window.location.reload();
      }, 1000);
    }
  }
}());

(function () {
  'use strict';
  angular.module('app')
    .controller("appCtrl", ['$scope', '$http', appCtrl]);

  function appCtrl($scope, $http) {
    var url = "https://api.trade.gov/consolidated_screening_list/search?api_key=";
    var urlKey = "6ZRkkBFTdh9lHTTttqzDamXs";
    $scope.traeDatos = function (dato, filtro) {
      $http.get(url + urlKey + filtro + dato)
        .then(function (data) {
          console.log();
        });
    }
  }
}());

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
            $mdToast.showSimple("Welcome");
            //$window.location.href = "/usa/#/search";
            $location.path("/index");
            $scope.$on('$locationChangeSuccess', function () {
              $window.location.reload(true);
            });
          }
          else {
            $mdToast.showSimple("Something wrong with your credentials");
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
      console.log(passwd);
      if (passwd.oldPassword === passwd.newPassword) {
        $mdToast.showSimple("New and old password don't have to be the same");
      }
      else {
        if (passwd.newPassword === passwd.confPassword) {
          /* Compraracion de claves */
          if (passwd.newPassword !== "") {
            $http.post('./consultas/login/changePassword.php', {
                'email': $rootScope.email,
                'password': passwd.newPassword
              })
              .then(function (data) {
                console.log(data.data);
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
        .then(function (email) {
          $mdToast.showSimple("New password has been sent to your email");
        })
        .catch(function (email) {
          $mdToast.showSimple("Something wrong with your email");
        });
    }
    /* Cambio de clave */
    var token = $routeParams.token;
    var idpersona = $routeParams.id;
    $scope.estado = "Deactivated";
    if (token) {
      $scope.tokendata = jwtHelper.decodeToken(token);
      if (!isNaN(idpersona)) {
        $scope.estado = "Active";
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
    $scope.data = {
      someModel : ""
    };
    var datoSearch;
    $scope.mostrarDetallado = function(ev, searchArray) {
      $scope.showDialog(ev, searchArray);
    };
    $scope.previousNext = function(a, b, c, d, e, f, val) {
      // console.log($scope.greeting.length - 1);
      if (val == $scope.greeting.length) {
        $scope.currentPage = $scope.greeting.length;
        $scope.page = $scope.currentPage;
      }
      if (val < 0) {
        $scope.currentPage = 0;
        $scope.page = $scope.currentPage;
      } else {
        $scope.currentPage = val;
        $scope.page = $scope.currentPage;
      }

      // console.log(val);
      // console.log($scope.page);
      // console.log($scope.currentPage);
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

(function () {
  'use strict';
  angular.module('app')
    .service('paises', [paises]);

  function paises() {
    this.sources = function () {
      return [{
        name: 'Denied Persons List ',
        code: 'DPL'
      }, {
        name: 'Entity List ',
        code: 'EL'
      }, {
        name: 'Unverified List ',
        code: 'UVL'
      }, {
        name: 'Nonproliferation Sanctions ',
        code: 'ISN'
      }, {
        name: 'ITAR Debarred ',
        code: 'DTC'
      }, {
        name: 'Foreign Sanctions Evaders ',
        code: 'FSE'
      }, {
        name: 'Non-SDN Iranian Sanctions Act List ',
        code: 'ISA'
      }, {
        name: 'Palestinian Legislative Council List ',
        code: 'PLC'
      }, {
        name: 'Part 561 List ',
        code: '561'
      }, {
        name: 'Sectoral Sanctions Identifications List ',
        code: 'SSI'
      }, {
        name: 'Specially Designated Nationals ',
        code: 'SDN'
      }]
    };
    this.country = function () {
      return [{
        name: 'Afghanistan',
        code: 'AF'
      }, {
        name: 'Åland Islands',
        code: 'AX'
      }, {
        name: 'Albania',
        code: 'AL'
      }, {
        name: 'Algeria',
        code: 'DZ'
      }, {
        name: 'American Samoa',
        code: 'AS'
      }, {
        name: 'Andorra',
        code: 'AD'
      }, {
        name: 'Angola',
        code: 'AO'
      }, {
        name: 'Anguilla',
        code: 'AI'
      }, {
        name: 'Antarctica',
        code: 'AQ'
      }, {
        name: 'Antigua and Barbuda',
        code: 'AG'
      }, {
        name: 'Argentina',
        code: 'AR'
      }, {
        name: 'Armenia',
        code: 'AM'
      }, {
        name: 'Aruba',
        code: 'AW'
      }, {
        name: 'Australia',
        code: 'AU'
      }, {
        name: 'Austria',
        code: 'AT'
      }, {
        name: 'Azerbaijan',
        code: 'AZ'
      }, {
        name: 'Bahamas',
        code: 'BS'
      }, {
        name: 'Bahrain',
        code: 'BH'
      }, {
        name: 'Bangladesh',
        code: 'BD'
      }, {
        name: 'Barbados',
        code: 'BB'
      }, {
        name: 'Belarus',
        code: 'BY'
      }, {
        name: 'Belgium',
        code: 'BE'
      }, {
        name: 'Belize',
        code: 'BZ'
      }, {
        name: 'Benin',
        code: 'BJ'
      }, {
        name: 'Bermuda',
        code: 'BM'
      }, {
        name: 'Bhutan',
        code: 'BT'
      }, {
        name: 'Bolivia',
        code: 'BO'
      }, {
        name: 'Bosnia and Herzegovina',
        code: 'BA'
      }, {
        name: 'Botswana',
        code: 'BW'
      }, {
        name: 'Bouvet Island',
        code: 'BV'
      }, {
        name: 'Brazil',
        code: 'BR'
      }, {
        name: 'British Indian Ocean Territory',
        code: 'IO'
      }, {
        name: 'Brunei Darussalam',
        code: 'BN'
      }, {
        name: 'Bulgaria',
        code: 'BG'
      }, {
        name: 'Burkina Faso',
        code: 'BF'
      }, {
        name: 'Burundi',
        code: 'BI'
      }, {
        name: 'Cambodia',
        code: 'KH'
      }, {
        name: 'Cameroon',
        code: 'CM'
      }, {
        name: 'Canada',
        code: 'CA'
      }, {
        name: 'Cape Verde',
        code: 'CV'
      }, {
        name: 'Cayman Islands',
        code: 'KY'
      }, {
        name: 'Central African Republic',
        code: 'CF'
      }, {
        name: 'Chad',
        code: 'TD'
      }, {
        name: 'Chile',
        code: 'CL'
      }, {
        name: 'China',
        code: 'CN'
      }, {
        name: 'Christmas Island',
        code: 'CX'
      }, {
        name: 'Cocos (Keeling) Islands',
        code: 'CC'
      }, {
        name: 'Colombia',
        code: 'CO'
      }, {
        name: 'Comoros',
        code: 'KM'
      }, {
        name: 'Congo',
        code: 'CG'
      }, {
        name: 'Congo, The Democratic Republic of the',
        code: 'CD'
      }, {
        name: 'Cook Islands',
        code: 'CK'
      }, {
        name: 'Costa Rica',
        code: 'CR'
      }, {
        name: 'Cote D\'Ivoire',
        code: 'CI'
      }, {
        name: 'Croatia',
        code: 'HR'
      }, {
        name: 'Cuba',
        code: 'CU'
      }, {
        name: 'Cyprus',
        code: 'CY'
      }, {
        name: 'Czech Republic',
        code: 'CZ'
      }, {
        name: 'Denmark',
        code: 'DK'
      }, {
        name: 'Djibouti',
        code: 'DJ'
      }, {
        name: 'Dominica',
        code: 'DM'
      }, {
        name: 'Dominican Republic',
        code: 'DO'
      }, {
        name: 'Ecuador',
        code: 'EC'
      }, {
        name: 'Egypt',
        code: 'EG'
      }, {
        name: 'El Salvador',
        code: 'SV'
      }, {
        name: 'Equatorial Guinea',
        code: 'GQ'
      }, {
        name: 'Eritrea',
        code: 'ER'
      }, {
        name: 'Estonia',
        code: 'EE'
      }, {
        name: 'Ethiopia',
        code: 'ET'
      }, {
        name: 'Falkland Islands (Malvinas)',
        code: 'FK'
      }, {
        name: 'Faroe Islands',
        code: 'FO'
      }, {
        name: 'Fiji',
        code: 'FJ'
      }, {
        name: 'Finland',
        code: 'FI'
      }, {
        name: 'France',
        code: 'FR'
      }, {
        name: 'French Guiana',
        code: 'GF'
      }, {
        name: 'French Polynesia',
        code: 'PF'
      }, {
        name: 'French Southern Territories',
        code: 'TF'
      }, {
        name: 'Gabon',
        code: 'GA'
      }, {
        name: 'Gambia',
        code: 'GM'
      }, {
        name: 'Georgia',
        code: 'GE'
      }, {
        name: 'Germany',
        code: 'DE'
      }, {
        name: 'Ghana',
        code: 'GH'
      }, {
        name: 'Gibraltar',
        code: 'GI'
      }, {
        name: 'Greece',
        code: 'GR'
      }, {
        name: 'Greenland',
        code: 'GL'
      }, {
        name: 'Grenada',
        code: 'GD'
      }, {
        name: 'Guadeloupe',
        code: 'GP'
      }, {
        name: 'Guam',
        code: 'GU'
      }, {
        name: 'Guatemala',
        code: 'GT'
      }, {
        name: 'Guernsey',
        code: 'GG'
      }, {
        name: 'Guinea',
        code: 'GN'
      }, {
        name: 'Guinea-Bissau',
        code: 'GW'
      }, {
        name: 'Guyana',
        code: 'GY'
      }, {
        name: 'Haiti',
        code: 'HT'
      }, {
        name: 'Heard Island and Mcdonald Islands',
        code: 'HM'
      }, {
        name: 'Holy See (Vatican City State)',
        code: 'VA'
      }, {
        name: 'Honduras',
        code: 'HN'
      }, {
        name: 'Hong Kong',
        code: 'HK'
      }, {
        name: 'Hungary',
        code: 'HU'
      }, {
        name: 'Iceland',
        code: 'IS'
      }, {
        name: 'India',
        code: 'IN'
      }, {
        name: 'Indonesia',
        code: 'ID'
      }, {
        name: 'Iran, Islamic Republic Of',
        code: 'IR'
      }, {
        name: 'Iraq',
        code: 'IQ'
      }, {
        name: 'Ireland',
        code: 'IE'
      }, {
        name: 'Isle of Man',
        code: 'IM'
      }, {
        name: 'Israel',
        code: 'IL'
      }, {
        name: 'Italy',
        code: 'IT'
      }, {
        name: 'Jamaica',
        code: 'JM'
      }, {
        name: 'Japan',
        code: 'JP'
      }, {
        name: 'Jersey',
        code: 'JE'
      }, {
        name: 'Jordan',
        code: 'JO'
      }, {
        name: 'Kazakhstan',
        code: 'KZ'
      }, {
        name: 'Kenya',
        code: 'KE'
      }, {
        name: 'Kiribati',
        code: 'KI'
      }, {
        name: 'Korea, Democratic People\'S Republic of',
        code: 'KP'
      }, {
        name: 'Korea, Republic of',
        code: 'KR'
      }, {
        name: 'Kuwait',
        code: 'KW'
      }, {
        name: 'Kyrgyzstan',
        code: 'KG'
      }, {
        name: 'Lao People\'S Democratic Republic',
        code: 'LA'
      }, {
        name: 'Latvia',
        code: 'LV'
      }, {
        name: 'Lebanon',
        code: 'LB'
      }, {
        name: 'Lesotho',
        code: 'LS'
      }, {
        name: 'Liberia',
        code: 'LR'
      }, {
        name: 'Libyan Arab Jamahiriya',
        code: 'LY'
      }, {
        name: 'Liechtenstein',
        code: 'LI'
      }, {
        name: 'Lithuania',
        code: 'LT'
      }, {
        name: 'Luxembourg',
        code: 'LU'
      }, {
        name: 'Macao',
        code: 'MO'
      }, {
        name: 'Macedonia, The Former Yugoslav Republic of',
        code: 'MK'
      }, {
        name: 'Madagascar',
        code: 'MG'
      }, {
        name: 'Malawi',
        code: 'MW'
      }, {
        name: 'Malaysia',
        code: 'MY'
      }, {
        name: 'Maldives',
        code: 'MV'
      }, {
        name: 'Mali',
        code: 'ML'
      }, {
        name: 'Malta',
        code: 'MT'
      }, {
        name: 'Marshall Islands',
        code: 'MH'
      }, {
        name: 'Martinique',
        code: 'MQ'
      }, {
        name: 'Mauritania',
        code: 'MR'
      }, {
        name: 'Mauritius',
        code: 'MU'
      }, {
        name: 'Mayotte',
        code: 'YT'
      }, {
        name: 'Mexico',
        code: 'MX'
      }, {
        name: 'Micronesia, Federated States of',
        code: 'FM'
      }, {
        name: 'Moldova, Republic of',
        code: 'MD'
      }, {
        name: 'Monaco',
        code: 'MC'
      }, {
        name: 'Mongolia',
        code: 'MN'
      }, {
        name: 'Montserrat',
        code: 'MS'
      }, {
        name: 'Morocco',
        code: 'MA'
      }, {
        name: 'Mozambique',
        code: 'MZ'
      }, {
        name: 'Myanmar',
        code: 'MM'
      }, {
        name: 'Namibia',
        code: 'NA'
      }, {
        name: 'Nauru',
        code: 'NR'
      }, {
        name: 'Nepal',
        code: 'NP'
      }, {
        name: 'Netherlands',
        code: 'NL'
      }, {
        name: 'Netherlands Antilles',
        code: 'AN'
      }, {
        name: 'New Caledonia',
        code: 'NC'
      }, {
        name: 'New Zealand',
        code: 'NZ'
      }, {
        name: 'Nicaragua',
        code: 'NI'
      }, {
        name: 'Niger',
        code: 'NE'
      }, {
        name: 'Nigeria',
        code: 'NG'
      }, {
        name: 'Niue',
        code: 'NU'
      }, {
        name: 'Norfolk Island',
        code: 'NF'
      }, {
        name: 'Northern Mariana Islands',
        code: 'MP'
      }, {
        name: 'Norway',
        code: 'NO'
      }, {
        name: 'Oman',
        code: 'OM'
      }, {
        name: 'Pakistan',
        code: 'PK'
      }, {
        name: 'Palau',
        code: 'PW'
      }, {
        name: 'Palestinian Territory, Occupied',
        code: 'PS'
      }, {
        name: 'Panama',
        code: 'PA'
      }, {
        name: 'Papua New Guinea',
        code: 'PG'
      }, {
        name: 'Paraguay',
        code: 'PY'
      }, {
        name: 'Peru',
        code: 'PE'
      }, {
        name: 'Philippines',
        code: 'PH'
      }, {
        name: 'Pitcairn',
        code: 'PN'
      }, {
        name: 'Poland',
        code: 'PL'
      }, {
        name: 'Portugal',
        code: 'PT'
      }, {
        name: 'Puerto Rico',
        code: 'PR'
      }, {
        name: 'Qatar',
        code: 'QA'
      }, {
        name: 'Reunion',
        code: 'RE'
      }, {
        name: 'Romania',
        code: 'RO'
      }, {
        name: 'Russian Federation',
        code: 'RU'
      }, {
        name: 'RWANDA',
        code: 'RW'
      }, {
        name: 'Saint Helena',
        code: 'SH'
      }, {
        name: 'Saint Kitts and Nevis',
        code: 'KN'
      }, {
        name: 'Saint Lucia',
        code: 'LC'
      }, {
        name: 'Saint Pierre and Miquelon',
        code: 'PM'
      }, {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC'
      }, {
        name: 'Samoa',
        code: 'WS'
      }, {
        name: 'San Marino',
        code: 'SM'
      }, {
        name: 'Sao Tome and Principe',
        code: 'ST'
      }, {
        name: 'Saudi Arabia',
        code: 'SA'
      }, {
        name: 'Senegal',
        code: 'SN'
      }, {
        name: 'Serbia and Montenegro',
        code: 'CS'
      }, {
        name: 'Seychelles',
        code: 'SC'
      }, {
        name: 'Sierra Leone',
        code: 'SL'
      }, {
        name: 'Singapore',
        code: 'SG'
      }, {
        name: 'Slovakia',
        code: 'SK'
      }, {
        name: 'Slovenia',
        code: 'SI'
      }, {
        name: 'Solomon Islands',
        code: 'SB'
      }, {
        name: 'Somalia',
        code: 'SO'
      }, {
        name: 'South Africa',
        code: 'ZA'
      }, {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS'
      }, {
        name: 'Spain',
        code: 'ES'
      }, {
        name: 'Sri Lanka',
        code: 'LK'
      }, {
        name: 'Sudan',
        code: 'SD'
      }, {
        name: 'Suriname',
        code: 'SR'
      }, {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ'
      }, {
        name: 'Swaziland',
        code: 'SZ'
      }, {
        name: 'Sweden',
        code: 'SE'
      }, {
        name: 'Switzerland',
        code: 'CH'
      }, {
        name: 'Syrian Arab Republic',
        code: 'SY'
      }, {
        name: 'Taiwan, Province of China',
        code: 'TW'
      }, {
        name: 'Tajikistan',
        code: 'TJ'
      }, {
        name: 'Tanzania, United Republic of',
        code: 'TZ'
      }, {
        name: 'Thailand',
        code: 'TH'
      }, {
        name: 'Timor-Leste',
        code: 'TL'
      }, {
        name: 'Togo',
        code: 'TG'
      }, {
        name: 'Tokelau',
        code: 'TK'
      }, {
        name: 'Tonga',
        code: 'TO'
      }, {
        name: 'Trinidad and Tobago',
        code: 'TT'
      }, {
        name: 'Tunisia',
        code: 'TN'
      }, {
        name: 'Turkey',
        code: 'TR'
      }, {
        name: 'Turkmenistan',
        code: 'TM'
      }, {
        name: 'Turks and Caicos Islands',
        code: 'TC'
      }, {
        name: 'Tuvalu',
        code: 'TV'
      }, {
        name: 'Uganda',
        code: 'UG'
      }, {
        name: 'Ukraine',
        code: 'UA'
      }, {
        name: 'United Arab Emirates',
        code: 'AE'
      }, {
        name: 'United Kingdom',
        code: 'GB'
      }, {
        name: 'United States',
        code: 'US'
      }, {
        name: 'United States Minor Outlying Islands',
        code: 'UM'
      }, {
        name: 'Uruguay',
        code: 'UY'
      }, {
        name: 'Uzbekistan',
        code: 'UZ'
      }, {
        name: 'Vanuatu',
        code: 'VU'
      }, {
        name: 'Venezuela',
        code: 'VE'
      }, {
        name: 'Viet Nam',
        code: 'VN'
      }, {
        name: 'Virgin Islands, British',
        code: 'VG'
      }, {
        name: 'Virgin Islands, U.S.',
        code: 'VI'
      }, {
        name: 'Wallis and Futuna',
        code: 'WF'
      }, {
        name: 'Western Sahara',
        code: 'EH'
      }, {
        name: 'Yemen',
        code: 'YE'
      }, {
        name: 'Zambia',
        code: 'ZM'
      }, {
        name: 'Zimbabwe',
        code: 'ZW'
      }]
    };
  }
}());
