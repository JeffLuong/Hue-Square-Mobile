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

        $rootScope.$on("game.onSwipe('right')", swipeRight);
        $rootScope.$on("game.onSwipe('left')", swipeLeft);
        $rootScope.$on("game.onSwipe('down')", swipeDown);
        $rootScope.$on("game.onSwipe('up')", swipeUp);

        function swipeRight() {
          console.log("root scope swipe right!");
          var vector = getVectors('right');
          console.log(vector);
        }

        function swipeLeft() {
          console.log("root scope swipe left!");
          var vector = getVectors('left');
          console.log(vector);
        }

        function swipeDown() {
          console.log("root scope swipe down!");
          var vector = getVectors('down');
          console.log(vector);
        }

        function swipeUp() {
          console.log("root scope swipe up!");
          var vector = getVectors('up');
          console.log(vector);
        }

        function getVectors(direction) {
          var directionKeys = {
            "up":    { x:  0, y: -1 },
            "right": { x:  1, y:  0 },
            "down":  { x:  0, y:  1 },
            "left":  { x: -1, y:  0 }
          };

          return directionKeys[direction];
        }

        function inBounds(position) {
          return position.x >= 0 && position.y >= 0 && position.x < size && position.y < size;
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
