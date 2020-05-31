var WordcountApp = angular.module(
    'WordcountApp',
    ['ngMaterial', 'md.data.table']
);

WordcountApp.config(['$interpolateProvider', function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);

WordcountApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
  'use strict';
  $mdThemingProvider.theme('default')
      .primaryPalette('blue');
}]);

WordcountApp.controller('WordcountController', ['$scope', '$log', '$http','$mdEditDialog', '$timeout','$mdSidenav', '$mdBottomSheet', '$mdToast',
  function($scope, $log, $http, $mdEditDialog, $timeout, $mdSidenav, $mdBottomSheet, $mdToast) {

    // PAGINATION
    // https://codepen.io/geocine/pen/ZpoaVK
    // https://embed.plnkr.co/plunk/IL3cWx

    // PAGINATION
    $scope.limitOptions = [5, 10, 15];
    $scope.query = {
      order: 'matchingCount',
      limit: 10,
      page: 1
    };

    $scope.logPagination = function (page, limit) {
      console.log('page: ', page);
      console.log('limit: ', limit);
    }

    $scope.options = {
      rowSelection: true,
      multiSelect: true,
      autoSelect: true,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: false,
      limitSelect: true,
      pageSelect: true
    };
    // PAGINATION

    $scope.getResults = function() {
      $http({
        method: 'POST',
        url: '/data'
      }).then(function successCallback(response) {

        $scope.returnData = response.data;
        $scope.filteredItems = $scope.returnData;
        $scope.resetFilters();

      }, function errorCallback(response) {
        $log.log(response);
      });
    };

    $scope.getCriteria = function() {
      $http({
        method: 'POST',
        url: '/criteria'
      }).then(function successCallback(response) {
        $log.log('criteria\t',response.data);
        $scope.returnCriteria = response.data;
        $scope.toggleCriteria = {}
        for(var key in response.data){
            $scope.toggleCriteria[key] = false;
        }
      }, function errorCallback(response) {
        $log.log(response);
      });
    };

    $scope.resetFilters = function(){
      $scope.filterData = {};
      for(var key in $scope.returnData[0]){
        if (key !== '$$hashKey'){
          $scope.filterData[key] = false;
        }
      }
      $scope.filteredItems = $scope.returnData;
      $log.log($scope.filteredItems);
      $log.log($scope.filterData);
    };

    $scope.containsFalse = function (){
      for(var prop in $scope.filterData){
        if(prop != '$$hashKey' && $scope.filterData[prop] !== false) return true;
      }
      return false;
    }


    $scope.$watch('filterData', function (newValues, oldValues, scope) {

      $log.log('filterData:\t' + $scope.filterData);
      if ($scope.containsFalse()){
        $log.log('not empty at all');
        $scope.filteredItems = [];
        angular.forEach($scope.returnData, function (tool, key) {
          $scope.compareObjects(tool)
        });
      } else{
        $scope.filteredItems = $scope.returnData;
        $log.log('should be empty and should return all.');
      }

      $scope.query.page = 1;

      $log.log($scope.filteredItems);

    }, true);

    $scope.compareObjects = function(object) {
      var count = 0;
      var matchingObject = {};
      matchingObject['matched']= []
      for (let [key, value] of Object.entries($scope.filterData)) {
        if(value && object[key] === value){
          count += 1;
          matchingObject[key]=value;
          matchingObject['matched'].push(key);
        }
      }

      if (count > 0){
        matchingObject["matchingCount"]=count;
        matchingObject["name"]=object.name;
        matchingObject["last_publication"]=object.last_publication;
        matchingObject["paper"]=object.paper;
        matchingObject["url"]=object.url;
        $scope.filteredItems.push(matchingObject);
      }
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
      }, 100);
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
    };

    $scope.showAbout = function() {
      $mdBottomSheet.show({
        // templateUrl: './templates/about.html',
        template:
            '<md-bottom-sheet class="md-grid" layout="column">\n' +
            '<div layout="row" layout-align="center center" ng-cloak>\n' +
            '\tPlease find more details about the repository of annotation tools in the <a href="https://github.com/mariananeves/annotation-tools">Annotationsaurus GitHub page</a>.\t\n' +
            '</div>\n' +
            '\n' +
            '<div ng-cloak>\n' +
            'Details about the filters....</a>.\t\n' +
            '</div>\n' +
            '</md-bottom-sheet>',
        controller: 'WordcountController',
        clickOutsideToClose: true
      }).then(function(clickedItem) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(clickedItem['name'] + ' clicked!')
                .position('top right')
                .hideDelay(100)
        );
      }).catch(function(error) {
        // User clicked outside or hit escape
      });
    };

    $scope.showFAQ = function() {
      $mdBottomSheet.show({
        // templateUrl: 'templates/faq.html',
        template: '<md-bottom-sheet class="md-grid" layout="column">\n' +
            '<div class="page-header">\n' +
            'Add FAQ content...\n' +
            '</div>\n' +
            '</md-bottom-sheet>',
        controller: 'WordcountController',
        clickOutsideToClose: true
      }).then(function(clickedItem) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(clickedItem['name'] + ' clicked!')
                .position('top right')
                .hideDelay(100)
        );
      }).catch(function(error) {
        // User clicked outside or hit escape
      });
    };

  }]);
