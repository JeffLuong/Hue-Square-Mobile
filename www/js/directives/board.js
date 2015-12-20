angular.module('hueSquare')

  .directive('board', function($timeout, GameData, vectors, $rootScope) {
    return {
      restrict: 'A',
      template:
      "<div ng-repeat='row in rows' class='board-row' row-render>" +
      "</div>",
      link: function(scope, element, attr) {
          // Saved Game Data
          var gameData   = scope.game.data,
              currGame   = gameData.getCurrGame(),
              gameBeaten = currGame.beatGame,
              gameOver   = currGame.gameOver,
              wonRound   = currGame.wonRound;

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

          if (gameOver) {
            messageContainer.classList.toggle("game-over");
            if (gameBeaten && !wonRound) {
              toggleBeatGameMessage();
            } else if (!gameBeaten && wonRound) {
              toggleWinMessage();
            } else {
              toggleLoseMessage();
            }
          }

          // Event Listener
          $rootScope.$on("game.game-over", displayMessage);

          function toggleWinMessage() {
            retryButton.innerHTML = playAgain;
            nextButton.innerHTML = nextPuzzle;
            messageText.innerHTML = winMessage;
          };

          function toggleLoseMessage() {
            retryButton.innerHTML = tryAgain;
            nextButton.innerHTML = skipPuzzle;
            messageText.innerHTML = loseMessage;
            showSolButton.classList.add("block");
          };

          function toggleBeatGameMessage() {
            retryButton.classList.add("display-none");
            nextButton.classList.add("display-none");
            messageText.innerHTML = beatGameMessage;
            restartGameButton.classList.add("block");
          };

          function toggleClearMessage() {
            retryButton.classList.remove("display-none");
            nextButton.classList.remove("display-none");
            showSolButton.classList.remove("block");
            restartGameButton.classList.remove("block");
          };

          function displayMessage(e, restart, won, wonGame) {
            var message = won ? winMessage : loseMessage,
                options = won ? "next" : "retry";

            if (won && !wonGame && !restart) {
              toggleWinMessage();
            } else if (!won && !wonGame && !restart) {
              toggleLoseMessage();
            } else if (won && wonGame && !restart) {
              toggleBeatGameMessage();
            } else if (restart) {
              toggleClearMessage();
            }

            messageContainer.classList.toggle("game-over");
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
