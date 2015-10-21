console.log("tile directive loaded...");
angular.module('hueSquare')

  .directive('tileRender', function($rootScope, $timeout, GameData, vectors) {
    return {
      require: '^squareRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        var tileElem  = element[0],
            tileColor = scope.tile.color,
            tileXpos  = scope.tile.x,
            tileYpos  = scope.tile.y;

        // $rootScope.$on("game.render-user", renderUser);

        // Somehow use handlebars??
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

        function renderUser(e, vector) {
          var currUserTile = document.querySelector(".user");
          console.log(currUserTile);

          // console.log("RENDERING");
          // var hasUserClass = tileElem.classList.contains("user");
          // // Tests if the element has user class...if yes then render movement
          // if (hasUserClass) {
          //   tileElem.classList.remove("user");
          //   var vectorVal   = vectors[vector],
          //       newXpos     = (tileXpos + 1) + vectorVal.x,
          //       newYpos     = (tileYpos + 1) + vectorVal.y,
          //       newUserTile = document.querySelector(".tile-position-" + newXpos + "-" + newYpos);
          //       // console.log(counter);
          //       console.log(newUserTile);
          //       console.log(e);
          //
          //   newUserTile.classList.add("user");
          // } else {
          //   return;
          // }
        };


      }

    };
  });
