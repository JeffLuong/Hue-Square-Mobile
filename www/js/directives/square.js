console.log("square directive loaded...");
angular.module('hueSquare')

  .directive('squareRender', function($timeout, GameData) {
    return {
      require: '^board',
      restrict: 'A',
      template:
      "<div ng-repeat='square in squares' class='board-sq' tile-render>" +
      "</div>",
      link: function(scope, $scope, $element) {
        $scope[0].style.height = "calc(100% / " + scope.row.rowHeight + ")";
      }


    }
  });
