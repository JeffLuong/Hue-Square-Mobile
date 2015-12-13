angular.module('hueSquare')

  .directive('board', function($timeout, GameData, vectors, $rootScope) {
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' row-render>" +
      "</div>",
      link: function(scope, element, attr) {
          // Saved Game Data
          var game       = scope.game.data,
              currGame   = game.getCurrGame(),
              gameBeaten = currGame.beatGame,
              gameOver   = currGame.gameOver;

          // Element Selectors && Text States
          var messageContainer  = document.querySelector(".game-message"),
              retryButton       = document.querySelector(".retry"),
              nextButton        = document.querySelector(".next"),
              messageText       = document.querySelector(".game-message p"),
              showSolButton     = document.querySelector(".bottom-option-1"),
              restartGameButton = document.querySelector(".bottom-option-2"),
              winMessage        = "You Win!",
              loseMessage       = "You Lost!",
              beatGameMessage   = "You beat the game!",
              playAgain         = "play again",
              nextPuzzle        = "next puzzle",
              tryAgain          = "try again",
              skipPuzzle        = "skip puzzle";

          if (gameOver && gameBeaten) {
            console.log("Game over and game won...rendering message");
            messageContainer.classList.toggle("game-over");
            retryButton.classList.add("display-none");
            nextButton.classList.add("display-none");
            messageText.innerHTML = "You beat the game!";
            restartGameButton.classList.add("block");
          } else if (gameOver) {
            console.log("Game over but game is not beaten...");
            retryButton.innerHTML = playAgain;
            nextButton.innerHTML = nextPuzzle;
            messageContainer.classList.toggle("game-over");
            messageText.innerHTML = winMessage;
          }

          // Event Listener
          $rootScope.$on("game.game-over", displayMessage);

          function displayMessage(e, restart, won, wonGame) {
            var message = won ? winMessage : loseMessage,
                options = won ? "next" : "retry";

            if (won && !wonGame && !restart) {
              retryButton.innerHTML = playAgain;
              nextButton.innerHTML = nextPuzzle;
              messageText.innerHTML = message;
            } else if (!won && !wonGame && !restart) {
              nextButton.innerHTML = skipPuzzle;
              retryButton.innerHTML = tryAgain;
              showSolButton.classList.add("block");
              messageText.innerHTML = message;
            } else if (won && wonGame && !restart) {
              retryButton.classList.add("display-none");
              nextButton.classList.add("display-none");
              messageText.innerHTML = beatGameMessage;
              restartGameButton.classList.add("block");
            } else if (restart) {
              clearSolution();
            }

            messageContainer.classList.toggle("game-over");
          };


          function clearSolution() {
            retryButton.classList.remove("display-none");
            nextButton.classList.remove("display-none");
            showSolButton.classList.remove("block");
            restartGameButton.classList.remove("block");
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
          var game       = $scope.game.data,
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
