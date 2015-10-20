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
        console.log("BOARD JS GAME DATA");
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
          // var vector = getVector('right');
        }

        function swipeLeft() {
          console.log("root scope swipe left!");
          // var vector = getVector('left');
        }

        function swipeDown() {
          console.log("root scope swipe down!");
          // var vector = getVector('down');
        }

        function swipeUp() {
          console.log("root scope swipe up!");
          // var vector = getVector('up');
        }

        // function getVector(direction) {
        //   var directionKeys = {
        //     "up":    { x:  0, y: -1 },
        //     "right": { x:  1, y:  0 },
        //     "down":  { x:  0, y:  1 },
        //     "left":  { x: -1, y:  0 }
        //   };
        //
        //   return directionKeys[direction];
        // };

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
