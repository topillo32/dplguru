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
          .when("/saveApiKey", {
            title: 'Validate Api Key',
            templateUrl: "templates/saveApiKey.html",
            controller: "validaApiKeyCtrl"
          })
          .otherwise({
            redirectTo: "/"
          });
      }
    }());
