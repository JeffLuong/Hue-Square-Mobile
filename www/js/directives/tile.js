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

          renderPreviews(previews);
        };

        function renderPreviews(previews) {
          var len = previews.length;
          for (var i = 0; i < len; i++) {
            if (
              ((tileXpos + 1) === previews[i].position.x && tileYpos === previews[i].position.y) || // if it's right of new position
              (tileXpos === previews[i].position.x && (tileYpos + 1) === previews[i].position.y) || // if it's below the new position
              ((tileXpos - 1) === previews[i].position.x && tileYpos === previews[i].position.y) || // if it's left of new position
              (tileXpos === previews[i].position.x && (tileYpos - 1) === previews[i].position.y)    // if it's above the new position
            ) {
              // console.log("BLAHHHH", previews[i]);
              // insertPreviews(previews[i]);
              console.log(tileElem);
            }
          }
        };

        // preview functions
        function insertPreviews(preview) {
          scope.preview = {
            color: preview.color,
            x:     preview.position.x,
            y:     preview.position.y
          }
        };



      },

      controller: function($rootScope, $scope, $element) {
        // var preview = $scope.tile.preview;
        //
        // $rootScope.$on("game.render-user", testing);
        //
        // function testing(e, currPosition, newPosition, color, previews) {
        //   console.log("TESTTTTTT", previews);
        // }
      }

    };
  });
