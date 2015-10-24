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

          $rootScope.$on("game.new-game", clearMessage);
          $rootScope.$on("game.game-over", displayMessage);

          function displayMessage(e, restart, won, wonGame) {
            var message     = won ? "You Win!" : "You Lost!",
                winGame     = "You beat the game!",
                options     = won ? "next" : "retry",
                retry       = document.querySelector(".retry"),
                next        = document.querySelector(".next"),
                messageElem = document.querySelector(".game-message > p");

            if (won && wonGame === false) {
              retry.innerHTML = "play again";
              next.innerHTML = "next puzzle";
              messageElem.innerHTML(message);
            } else if (!won && !wonGame) {
              next.innerHTML = "skip puzzle";
              retry.innerHTML = "try again";
              document.querySelector(".bottom-option").classList.add("block");
              messageElem.innerHTML = message;
            } else if (won && wonGame) {
              retry.classList.remove("retry");
              next.classList.remove("next");
              messageElem.innerHTML = winGame;
            }

            messageContainer.classList.add("game-over");
          };

          function clearMessage() {
            var elem = document.getElementsByClassName("game-over")[0];
            console.log(elem.classList.contains("game-over"));
            if (elem.classList.contains("game-over")) {
              console.log("restart game.........");
              elem.classList.remove("game-over");
            }
            console.log(elem.classList.contains("game-over"));
          };
      },

      controller: function($rootScope, $scope, $element) {
        console.log("BOARD JS GAME DATA");
        var game       = new GameData,
            currGame   = game.getCurrGame(),
            savedBoard = currGame.board.savedBoard,
            numOfRows  = currGame.board.savedBoard.length,
            boardElem  = $element[0];

        $rootScope.$on("game.onSwipe", swipe);

        function swipe(e, currPosition, newPosition, color, previews, color2) {
          $rootScope.$broadcast("game.render-user", currPosition, newPosition, color, previews, color2);
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
