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
