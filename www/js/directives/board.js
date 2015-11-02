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
                bottomOpt1  = document.querySelector(".bottom-option-1"),
                bottomOpt2  = document.querySelector(".bottom-option-2");

            if (won && !wonGame && !restart) {
              retry.innerHTML = "play again";
              next.innerHTML = "next puzzle";
              messageElem.innerHTML = message;
            } else if (!won && !wonGame && !restart) {
              next.innerHTML = "skip puzzle";
              retry.innerHTML = "try again";
              bottomOpt1.classList.add("block");
              messageElem.innerHTML = message;
            } else if (won && wonGame && !restart) {
              retry.classList.add("display-none");
              next.classList.add("display-none");
              messageElem.innerHTML = winGame;
              bottomOpt2.classList.add("block");
            } else if (restart) {
              console.log("next map!!!");
            }

            messageContainer.classList.toggle("game-over");
          };

          function clearSolution(e) {
            document.querySelector(".bottom-option-1").classList.remove("block");
            document.querySelector(".bottom-option-2").classList.remove("block");
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
          var game       = new GameData,
              currGame   = game.getCurrGame(),
              savedBoard = currGame.board.savedBoard,
              numOfRows  = currGame.board.savedBoard.length,
              boardElem  = $element[0];

          addRows(savedBoard, numOfRows, currGame.savedPosition);
        };

        function addRows(board, numOfRows, userPosition) {
          $scope.rows = [];
          for (var y = 0; y < numOfRows; y++) {
            $scope.rows.push({
              size: numOfRows,
              rowArr: board[y],
              rowNum: y,
              previews: previews,
              userPosition: userPosition
            });
          };

        };

        startLevel();
      }
    };
  });
