console.log("row directive loaded...");
angular.module('hueSquare')

  .directive('rowRender', function($timeout, GameData) {
    return {
      require: '^board',
      restrict: 'AE',
      template:
      "<div ng-repeat='tile in tiles' class='tile'></div>",
      link: function($rootScope, $scope, $element, $compile) {
        console.log("THISSS");

      }


    }
  });
