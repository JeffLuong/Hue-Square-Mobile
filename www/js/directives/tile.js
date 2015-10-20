console.log("tile directive loaded...");
angular.module('hueSquare')

  .directive('tileRender', function($timeout, GameData) {
    return {
      require: '^squareRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        var tileElem  = element[0],
            tileColor = scope.tile.color,
            tileXpos  = scope.tile.x,
            tileYpos  = scope.tile.y;

        tileElem.style.backgroundColor = "hsl(" + tileColor + ", 75%, 60%)";
        tileElem.classList.add("tile-position-" + (tileXpos + 1) + "-" + (tileYpos + 1));
        // console.log(scope);
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

        function renderUser() {

        }
      }
    };
  });
