console.log("tile directive loaded...");
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
            winColor  = scope.$parent.$parent.game.winColor;

        $rootScope.$on("game.render-user", renderUser);
        $rootScope.$on("game.game-over", animateGoal);

        tileElem.style.backgroundColor = "hsl(" + tileColor + ", 75%, 60%)";
        tileElem.classList.add("tile-position-" + (tileXpos + 1) + "-" + (tileYpos + 1));

        // Render user tile
        if (tileXpos === 0 && tileYpos === 0) {
          tileElem.classList.add("user");
        }

        // Render Goal Diamond
        if (tileXpos === winPoint.x && tileYpos === winPoint.y) {
          var goal = angular.element("<div class='game-goal shadow'>"),
              tile = angular.element(tileElem);

          goal[0].style.backgroundColor = "hsl(" + winColor + ", 75%, 60%)"; // angular element 'goal' is an array of elements
          tile.append(goal);
        }

        // Timeout for animating-in tiles
        $timeout(animateTiles, 250);

        function animateTiles() {
          tileElem.classList.add("delayX" + (tileXpos + 1) + "Y" + (tileYpos + 1));
          tileElem.classList.add("animateIn");
        };

        function renderUser(e, lastPosition, newPosition, color, previews) {
          if (tileXpos === newPosition.x && tileYpos === newPosition.y) {
            tileElem.classList.add("user");
            tileElem.style.backgroundColor = "hsl(" + color + ", 75%, 60%)";
          } else if (tileXpos === lastPosition.x && tileYpos === lastPosition.y) {
            tileElem.classList.remove("user");
          } else {
            return;
          };

          $rootScope.$broadcast("game.render-previews", previews);
        };

        function animateGoal(e, restart, won) {
          if (!restart && won) {
            var goal = document.getElementsByClassName("game-goal")[0];
            console.log("animating win");
            goal.classList.add("rotate");
            setTimeout(function() {
              goal.classList.remove("shadow");
            }, 750);
          } else if (!restart && !won) {
            var goal = document.getElementsByClassName("game-goal")[0];
            console.log("animating lost");
            setTimeout(function() {
              goal.classList.remove("shadow");
            }, 750);
          }
        };
      },

      controller: function($rootScope, $scope, $element) {
        // Need this controller for preview directive
      }

    };
  });
