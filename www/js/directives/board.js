console.log("row directive loaded...");
angular.module('hueSquare')

  .directive('board', function($timeout, GameData) {
    console.log("------------------------");
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' row-render>" +
      "</div>",
      controller: function($rootScope, $scope, $element) {
        var game      = new GameData,
            currGame  = game.getCurrGame(),
            board     = currGame.board.savedBoard,
            numOfRows = currGame.board.savedBoard.length;

        // Row functions
        function initRows() {
          addRows(board);
        };

        function addRows(board) {
          $scope.rows = [];
          $scope.squares = [];
          console.log(board);
          for (var y = 0; y < numOfRows; y++) {
            $scope.rows.push({
              size: numOfRows,
              rowArr: board[y],
              rowNum: y
            });
          };
        };

        initRows();
      }
    };
  });
