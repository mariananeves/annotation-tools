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
      order: ['-matchingCount', 'name'],
      limit: 15,
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
      // $log.log($scope.filteredItems);
      // $log.log($scope.filterData);
    };

    $scope.containsFalse = function (){
      for(var prop in $scope.filterData){
        if(prop != '$$hashKey' && $scope.filterData[prop] !== false) return true;
      }
      return false;
    }

    // switchData SWITCH
    $scope.switchData = 'OR';
    $scope.$watch('switchData', function (newValue, oldValue, scope) {
      if ($scope.switchData === 'AND') {
        $scope.filterLength = 0;
        for (let [key, value] of Object.entries($scope.filterData)) {
          if(value){
            $scope.filterLength += 1;
          }
        }
      } else {
        $scope.filterLength = 1;
      }
      console.log($scope.filterLength);
      // console.log(Object.keys($scope.filterData).length);
      $scope.filterObjects();
    }, true);

    // filterData SWITCH
    $scope.$watch('filterData', function (newValues, oldValues, scope) {
      $scope.filterObjects();
    }, true);

    $scope.filterObjects = function (){
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
      $log.log('filteredItems: ' + $scope.filteredItems);
    };

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

      if (count > ($scope.filterLength-1)){
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
        template:
          '<md-bottom-sheet>' +
          '<p>Please find more details about the repository of annotation tools in the <a href="https://github.com/mariananeves/annotation-tools" target="_blank">Annotationsaurus GitHub page</a>.</p>' +
          '<p>If you used our tool, please cite our publication:</p>' +
        '<ul><li>' +
        'Neves M, Ševa J.' +
        '<b>Annotationsaurus: A Searchable Directory of Annotation Tools</b>,' +
        'EMNLP demo paper [under review]' +
        '</li><li>' +
        'Neves M, Ševa J.' +
        '<b>An extensive review of tools for manual annotation of documents</b>,' +
        'Briefings in Bioinformatics.' +
        '<a href="https://academic.oup.com/bib/advance-article/doi/10.1093/bib/bbz130/5670958" target="_blank">[Full Text, PDF, and BibTex]</a>' +
          '</li></ul></md-bottom-sheet>'
        ,
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
        template: `
<md-bottom-sheet>
  <h1>FAQ</h1>

  <ul>
    <li><a href="#filters">What is the meaning of the filters?</a></li>
    <li><a href="#newtool">HHow do I ask to add a new annotation tool?</a></li>
    <li><a href="#newcriterion">How do I ask to add a new criterion?</a></li>
    <li><a href="#changecriterion">The evaluation of a criterion is wrong for a particular tool, could you correct it?</a></li>
    <li><a href="#trust">Why should I trust the evaluation that you carried out?</a></li>
    <li><a href="#collaborate">I find the project great, could I collaborate with you?</a></li>
  </ul>

  <p id="filters">
  <h3>What is the meaning of the filters?</h3>

  Please check more details in our <a href="https://academic.oup.com/bib/advance-article/doi/10.1093/bib/bbz130/5670958">survey paper</a>.

  <h4>#data format</h4>
  <ul>
    <li><b>format_annotations</b>: Format of the schema</li>
    <li><b>format_documents</b>: Input format for documents</li>
    <li><b>format_schema</b>: Output format for annotations</li>
  </ul>

  <h4>#functional</h4>
  <ul>
    <li><b>data_privacy</b>: Data privacy</li>
    <li><b>document_level</b>: Allowance of document-level annotations</li>
    <li><b>full_texts</b>: Suitability for full texts</li>
    <li><b>highlight</b>: Ability to highlight parts of the text</li>
    <li><b>iaa</b>: Support for inter-annotator agreement (IAA)</li>
    <li><b>medline_pmc</b>: Integration with PubMed</li>
    <li><b>multilabel</b>: Allowance of multi-label annotations</li>
    <li><b>multilingual</b>: Support for various languages</li>
    <li><b>ontologies</b>: Support for ontologies and terminologies</li>
    <li><b>partial_save</b>: Allowance for saving documents partially</li>
    <li><b>preannotations</b>: Support for pre-annotations</li>
    <li><b>relationships</b>: Support for annotation of relationships</li>
    <li><b>users_teams</b>: Support for users and teams</li>
  </ul>

  <h4>#requirements</h4>
  <ul>
    <li><b>available</b>: Should be readily available</li>
    <li><b>installable</b>: If not available online, should be able to be installed in a maximum of 2 h</li>
    <li><b>schematic</b>: Allowance for the configuration of a schema</li>
    <li><b>type</b>: Type of the tool: Web-based, Plug-in, Stand-alone</li>
    <li><b>workable</b>: Whether it worked properly during our experiments</li>
  </ul>

  <h4>#technical</h4>
  <ul>
    <li><b>documentation</b>: Quality of the documentation</li>
    <li><b>free</b>: Free of charge version</li>
    <li><b>installation</b>: Easiness of installation</li>
    <li><b>last_version</b>:  Date of the last version</li>
    <li><b>license</b>: Type of license</li>
    <li><b>online_available</b>: Online availability for use</li>
    <li><b>source_code</b>: Availability of the source code</li>
  </ul>
  </p>

  <p id="newtool">
  <h3>How do I ask to add a new annotation tool?</h3>

  Please add an issue asking for that in our <a href="https://github.com/mariananeves/annotation-tools">Annotationsaurus GitHub page</a>.
  We'll add the tool to the list in GitHub and will try to evaluate it over some of the features.
  Please inform the URL of the tool and its publication (if available), as well as any addiitonal important infrmation.
  </p>

  <p id="newcriterion">
  <h3>How do I ask to add a new criterion?</h3>

  Please add an issue asking for that in our <a href="https://github.com/mariananeves/annotation-tools">Annotationsaurus GitHub page</a>.
  We'll analyze this new criterion, and eventually, add it at least the tools for which we can easily evaluate the criterion.
  </p>

  <p id="changecriterion">
  <h3>The evaluation of a criterion is wrong for a particular tool, could you correct it?</h3>

  Please add an issue asking for that in our <a href="https://github.com/mariananeves/annotation-tools">Annotationsaurus GitHub page</a>.
  Please also add some evidence for this change, such as by referring to the tool's publcation or tutorial, or by uploading a screenshot.
  We'll analyze the evidence, and eventually update the evaluation, otherwise, we'll contest your request.
  </p>

  <p id="trust">
  <h3>Why should I trust the evaluation that you carried out?</h3>

  We're researchers working on this are since many years, and we have not been involved in the development of any annotation tool.
  Therefore, we don not have any reasons to favor a particular tool.
  And we published our <a href="https://academic.oup.com/bib/advance-article/doi/10.1093/bib/bbz130/5670958">methodology</a> in a reputable journal.
  We certainly might have done some mistakes in the evaluationof some tools, but we offer the opportunity for the community to help us to keep our evaluation as up to date as possible.
  </p>

  <p id="collaborate">
  <h3>I find the project great, could I collaborate with you?</h3>

  Sure, we'de be glad to have the support of other researchers.
  Please check our contact info in our profile at <a href="https://github.com/mariananeves/annotation-tools">GitHub </a>.
  For instance, we envisage that there are many interesting projects for automatizing the evaluation of some of the criteria that we consider here.
  </p>
</md-bottom-sheet>`,
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


WordcountApp.filter('join', function () {
  return function join(array, separator, prop) {
    if (!Array.isArray(array)) {
      return array; // if not array return original - can also throw error
    }

    return (!angular.isUndefined(prop) ? array.map(function (item) {
      return item[prop];
    }) : array).join(separator);
  };
});


WordcountApp.filter('targets', function() {
  return function(x) {
    var i, c, txt = "";
    for (i = 0; i < x.length; i++) {
      c = x[i];

      c = c.toUpperCase();

      txt += c;
    }
    return txt;
  };
});