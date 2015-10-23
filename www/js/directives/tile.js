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
            tileYpos  = scope.tile.y;

            // console.log(scope);
        $rootScope.$on("game.render-user", renderUser);

        tileElem.style.backgroundColor = "hsl(" + tileColor + ", 75%, 60%)";
        tileElem.classList.add("tile-position-" + (tileXpos + 1) + "-" + (tileYpos + 1));

        // Render user tile
        if (tileXpos === 0 && tileYpos === 0) {
          tileElem.classList.add("user");
        }

        // Timeout for animating tiles
        $timeout(animateTiles, 250);

        function animateTiles() {
          tileElem.classList.add("delayX" + (tileXpos + 1) + "Y" + (tileYpos + 1));
          tileElem.classList.add("animateIn");
        };

        function renderUser(e, currPosition, newPosition, color, previews) {
          if (tileXpos === newPosition.x && tileYpos === newPosition.y) {
            tileElem.classList.add("user");
            tileElem.style.backgroundColor = "hsl(" + color + ", 75%, 60%)";
          } else if (tileXpos === currPosition.x && tileYpos === currPosition.y) {
            tileElem.classList.remove("user");
          } else {
            return;
          };

          $rootScope.$broadcast("game.render-previews", previews);
        };
      },

      controller: function($rootScope, $scope, $element) {

      }

    };
  });
