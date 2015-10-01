console.log("row directive loaded...");
angular.module('hueSquare')

  .directive('board', function($timeout, GameData) {
    console.log("------------------------");
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' square-render>" +
      "</div>",
      controller: function($rootScope, $scope, $element, $compile) {
        var game      = new GameData,
            currGame  = game.getCurrGame(),
            board     = currGame.board.savedBoard,
            numOfRows = currGame.board.savedBoard.length;

          console.log(board);

        // Row functions
        function initRows() {
          addSquares();
        }

        function addSquares() {
          $scope.rows    = [];
          for (var y = 0; y < numOfRows; y++) {
            $scope.rows.push({
              rowHeight: numOfRows
            });
          }

          console.log($scope.rows);
        }

        function addColors() {

        }

        initRows();
      }


    }
  });
