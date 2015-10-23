console.log("board directive loaded...");
angular.module('hueSquare')

  .directive('board', function($timeout, GameData, vectors) {
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' row-render>" +
      "</div>",
      controller: function($rootScope, $scope, $element) {
        console.log("BOARD JS GAME DATA");
        var game       = new GameData,
            currGame   = game.getCurrGame(),
            savedBoard = currGame.board.savedBoard,
            numOfRows  = currGame.board.savedBoard.length,
            boardElem  = $element[0];

        $rootScope.$on("game.onSwipe", swipe);

        function swipe(e, currPosition, newPosition, color, previews) {
          $rootScope.$broadcast("game.render-user", currPosition, newPosition, color, previews);
        };

        // Row functions
        function initRows() {
          addRows(savedBoard);
        };

        function addRows(board) {
          $scope.rows = [];
          for (var y = 0; y < numOfRows; y++) {
            $scope.rows.push({
              size: numOfRows,
              rowArr: board[y],
              rowNum: y,
              previews: previews
            });
          };

        };

        initRows();
      }
    };
  });
