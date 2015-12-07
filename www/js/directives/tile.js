angular.module('hueSquare')

  .directive('tileRender', function($rootScope, $timeout) {
    return {
      require: '^squareRender',
      restrict: 'A',
      template: "<div preview class='preview' preview-render>" +
      "</div>",
      link: function(scope, element, attr) {
        var tileElem  = element[0],
            tileColor = scope.tile.color,
            tileXpos  = scope.tile.x,
            tileYpos  = scope.tile.y,
            winPoint  = scope.$parent.$parent.game.winPoint,
            winColor  = scope.$parent.$parent.game.winColor,
            userXpos  = scope.$parent.row.userPosition.x,
            userYpos  = scope.$parent.row.userPosition.y;

        $rootScope.$on("game.render-user", renderUser);
        $rootScope.$on("game.game-over", animateGoal);

        tileElem.style.backgroundColor = "hsl(" + tileColor + ", 75%, 60%)";
        tileElem.classList.add("tile-position-" + (tileXpos + 1) + "-" + (tileYpos + 1));

        // Render user tile
        if (tileXpos === userXpos && tileYpos === userYpos) {
          tileElem.classList.add("user");
        }

        // Render Goal Diamond
        if (tileXpos === winPoint.x && tileYpos === winPoint.y) {
          var goal = angular.element("<div class='game-goal shadow'>")[0],
              tile = angular.element(tileElem);

          goal.style.backgroundColor = "hsl(" + winColor + ", 75%, 60%)"; // angular element 'goal' is an array of elements
          tile.append(goal);
        }

        // Timeout for animating-in tiles
        $timeout(animateTiles, 250);

        function animateTiles() {
          var delay = tileXpos + tileYpos,
              tile = angular.element(tileElem);

          // Calculates Delay time based on tile position.
          if (delay >= 10) {
            var splitDelay = delay.toString().split(""),
                index     = splitDelay.length - 1;

            // Adds decimal point into delay time.
            splitDelay.splice(index, 0, ".");
            delay = splitDelay.join("") + "s";
          } else {
            delay = "0." + delay.toString() + "s";
          }

          tile.css({
            "transition-delay" : delay
          });

          tile.addClass("animateIn");

          $timeout(removeDelay, 300);
        };

        function removeDelay() {
          tileElem.classList.add("delay-none");
        };

        function renderUser(e, lastPosition, newPosition, color, previews, color2) {
          if (tileXpos === newPosition.x && tileYpos === newPosition.y) {
            tileElem.classList.add("user");
            if (color2 === null || color2 === undefined) {
              tileElem.style.backgroundColor = "hsl(" + color + ", 75%, 60%)";
            } else if (color2 === 0 || color2) { // If color2 exists, then it is a redo or undo
              var prevTile = document.querySelector(".tile-position-" + (lastPosition.x + 1) + "-" + (lastPosition.y + 1));
              prevTile.style.backgroundColor = "hsl(" + color2 + ", 75%, 60%)";
            }
          } else if (tileXpos === lastPosition.x && tileYpos === lastPosition.y) {
            tileElem.classList.remove("user");
          } else {
            return;
          };

          $rootScope.$broadcast("game.render-previews", previews);
        };

        function animateGoal(e, restart, won) {
          var goal = document.querySelector(".game-goal");

          if (!restart && won) {
            goal.classList.add("rotate");
            setTimeout(function() {
              goal.classList.remove("shadow");
            }, 750);
          } else if (restart && won) {
            goal.classList.remove("rotate");
            setTimeout(function() {
              goal.classList.add("shadow");
            }, 500);
          } else if (!restart && !won) {
            setTimeout(function() {
              goal.classList.remove("shadow");
            }, 750);
          } else if (restart && !won) {
            goal.classList.add("shadow");
            setTimeout(function() {
              goal.classList.remove("rotate");
            }, 500);
          }
        };

      },

      controller: function($rootScope, $scope, $element) {
        // Need this controller for preview directive
      }

    };
  });
