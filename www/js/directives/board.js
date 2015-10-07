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

          // Use $broadcast to dispatch events downards
          // Use $emit to dispatch events upwards
          console.log($rootScope.$broadcast);
        // Row functions
        function initRows() {
          addRows(board);
        };

        function addRows(board) {
          $scope.rows = [];
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
