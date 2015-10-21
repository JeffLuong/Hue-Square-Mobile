console.log("square directive loaded...");
angular.module('hueSquare')

  .directive('squareRender', function($timeout) {
    return {
      require: '^rowRender',
      restrict: 'A',
      template: "<div tile class='tile' tile-render></div>",
      link: function(scope, element, attr) {
        var square    = element[0],
            squareNum = scope.square.squareNum,
            width     = scope.square.width;
        square.style.width = "calc(100% / " + width + ")";
        square.classList.add("square" + (squareNum + 1));
      },

      controller: function($rootScope, $scope, $element) {
        var tile = $scope.square.tile,
            size = $scope.square.width;

        // Tile Functions
        function insertTiles() {
          $scope.tile = {
            aiLastPosition: tile.aiLastPosition,
            lastPosition:   tile.lastPosition,
            color:          tile.color,
            x:              tile.x,
            y:              tile.y
          }
        };

        insertTiles();
      }
    };
  });
