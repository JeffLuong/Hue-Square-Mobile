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
        var game       = new GameData,
            currGame   = game.getCurrGame(),
            savedBoard = currGame.board.savedBoard,
            numOfRows  = currGame.board.savedBoard.length,
            boardElem  = $element[0];

        console.log(boardElem);
        // Event Listeners
        // boardElem.addEventListener('')
        function onSwipe(e) {
          console.log("Swiped!");
          // $rootScope.$broadcast('game.swipe-' + direction, vector);
        }

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
              rowNum: y
            });
          };
        };

        initRows();
      }
    };
  });
