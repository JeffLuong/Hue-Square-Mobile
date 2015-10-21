console.log("row directive loaded...");
angular.module('hueSquare')

  .directive('board', function($timeout, GameData, vectors) {
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

        $rootScope.$on("game.onSwipe", swipe);

        function swipe(e, vector) {
          e.preventDefault();
          var currUserTile = document.querySelector(".user");

          var values = currUserTile.classList[1].split("-");
          currUserTile.classList.remove("user");
          var vectorVal   = vectors[vector],
                newXpos     = (parseInt(values[2])) + vectorVal.x,
                newYpos     = (parseInt(values[3])) + vectorVal.y,
                newUserTile = document.querySelector(".tile-position-" + newXpos + "-" + newYpos);
          console.log(newXpos, newYpos);
          console.log(newUserTile);

          newUserTile.classList.add("user");
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
              rowNum: y
            });
          };
        };

        initRows();
      }
    };
  });
