console.log("tile directive loaded...");
angular.module('hueSquare')

  .directive('tile', function($timeout, GameData) {
    return {
      require: '^squareRender',
      restrict: 'A',
      template:
      "<div ng-repeat='tile in tiles' class='tile'></div>",
      link: function($rootScope, $scope, $element, $compile) {
        console.log("TILES");

      }


    }
  });
