console.log("board directive loaded...");
angular.module('hueSquare')

  .directive('board', function($timeout, GameData, vectors, $rootScope) {
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' row-render>" +
      "</div>",
      link: function(scope, element, attr) {
          var messageContainer = element[0].parentElement.children[0];

          $rootScope.$on("game.game-over", displayMessage);
          $rootScope.$on("game.new-game", clearSolution);

          function displayMessage(e, restart, won, wonGame) {
            var message     = won ? "You Win!" : "You Lost!",
                winGame     = "You beat the game!",
                options     = won ? "next" : "retry",
                retry       = document.querySelector(".retry"),
                next        = document.querySelector(".next"),
                messageElem = document.querySelector(".game-message p"),
                bottomOpt1  = document.querySelector(".bottom-option-1");

            if (won && wonGame === false && !restart) {
              retry.innerHTML = "play again";
              next.innerHTML = "next puzzle";
              messageElem.innerHTML = message;
            } else if (!won && !wonGame && !restart) {
              next.innerHTML = "skip puzzle";
              retry.innerHTML = "try again";
              bottomOpt1.classList.add("block");
              messageElem.innerHTML = message;
            } else if (won && wonGame && !restart) {
              retry.classList.remove("retry");
              next.classList.remove("next");
              messageElem.innerHTML = winGame;
              bottomOpt2.classList.add("block");
            } else if (restart) {
              console.log("next map!!!");
            }

            messageContainer.classList.toggle("game-over");
          };

          function clearSolution(e) {
            document.querySelector(".bottom-option").classList.remove("block");
          };
      },

      controller: function($rootScope, $scope, $element) {

        $rootScope.$on("game.onSwipe", swipe);
        $rootScope.$on("game.start-game", startLevel);

        function swipe(e, currPosition, newPosition, color, previews, color2) {
          $rootScope.$broadcast("game.render-user", currPosition, newPosition, color, previews, color2);
        };

        function startLevel() {
          initRows();
        }

        function initRows() {
        console.log("BOARD JS GAME DATA");
          var game       = new GameData,
              currGame   = game.getCurrGame(),
              savedBoard = currGame.board.savedBoard,
              numOfRows  = currGame.board.savedBoard.length,
              boardElem  = $element[0];

          addRows(savedBoard, numOfRows);
        };

        function addRows(board, numOfRows) {
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

        startLevel();
      }
    };
  });
