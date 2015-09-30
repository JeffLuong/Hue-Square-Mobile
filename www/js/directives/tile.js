console.log("tile directive loaded...");
angular.module('hueSquare')

  .directive('tileRender', function($timeout, GameData) {
    console.log("------------------------");
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row'>" +
        "<div ng-repeat='square in squares' class='board-sq'>" +
          "<div ng-repeat='tile in tiles' class='tile'></div>" +
        "</div>" +
      "</div>",
      controller: function($rootScope, $scope, $element) {
        var game      = new GameData,
            currGame  = game.getCurrGame(),
            numOfRows = currGame.board.savedBoard.length;
        console.log(currGame.board.savedBoard);
        console.log(currGame.board.savedBoard.length);
        console.log($element[0]);


        // Tile functions
        function initTiles() {
          addColors();
        }

        function addColors() {
          for (var i = 0; i < numOfRows; i++) {
            console.log("adding row");
          }

        }

        
      }


    }
  });
