var WordcountApp = angular.module('WordcountApp', ['ngMaterial', 'md.data.table']);

WordcountApp.config(['$interpolateProvider', function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);

WordcountApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
  'use strict';
  $mdThemingProvider.theme('default')
      .primaryPalette('blue');
}]);

WordcountApp.controller('WordcountController', ['$scope', '$log', '$http','$mdEditDialog', '$timeout','$mdSidenav',
  function($scope, $log, $http, $mdEditDialog, $timeout, $mdSidenav) {

    // https://codepen.io/geocine/pen/ZpoaVK

    $scope.getResults = function() {
      $http({
        method: 'POST',
        url: '/data'
      }).then(function successCallback(response) {

        $scope.returnData = response.data;
        $log.log($scope.returnData);
        $scope.filteredItems = []

        $scope.resetFilters();

      }, function errorCallback(response) {
        $log.log(response);
      });
    };

    $scope.resetFilters = function(){
      $scope.filterData = $scope.returnData[0]
      for(var key in $scope.filterData){
        $scope.filterData[key] = '';
      }
      $log.log($scope.filterData);
    };

    $scope.$watch('filterData', function (newValues, oldValues, scope) {
      $log.log($scope.filterData);
      $scope.filteredItems = [];
      angular.forEach($scope.returnData, function (tool, key) {
        $scope.compareObjects(tool)
      });
      $log.log($scope.filteredItems)

    }, true);


    $scope.compareObjects = function(object) {
      var count = 0
      for (let [key, value] of Object.entries($scope.filterData)) {
        // console.log(key, value);
        // console.log(object[key]);
        if(value && object[key] === value){
          count += 1;
        }
      }

      if (count > 0 && object.name){
        // $log.log(object.name, count);
        $scope.filteredItems.push(
            {"name":object.name, "matchingCount":count}
        );
      }
    };

    $scope.getCriteria = function() {
      $http({
        method: 'POST',
        url: '/criteria'
      }).then(function successCallback(response) {
        $log.log(response.data);
        $scope.returnCriteria = response.data
      }, function errorCallback(response) {
        $log.log(response);
      });
    };

    $scope.toggleRight = buildDelayedToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
      }, 200);
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
    };

  }]);
