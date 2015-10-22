console.log("preview directive loaded...");
angular.module('hueSquare')

  .directive('previewRender', function($rootScope, $timeout) {
    return {
      require: '^tileRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        // console.log(element[0]);
        // console.log(scope);
        var previewElem = element[0],
            previewXpos = scope.tile.x,
            previewYpos = scope.tile.y;

        previewElem.classList.add("prev-position-" + (previewXpos + 1) + "-" + (previewYpos + 1));

        $rootScope.$on("game.render-user", renderPreviews);

        function renderPreviews(e, currPosition, newPosition, color, previews) {
          // resets all previews to display none
          previewElem.style.display = "none";
          // sets neighboring previews to display block and change color
          var len = previews.length;
          for (var i = 0; i < len; i++) {
            if (previewXpos === previews[i].position.x && previewYpos === previews[i].position.y) {
              console.log(previews[i].position.x, previews[i].position.y);
              console.log(previewElem);
              previewElem.style.display = "block";
              // color not setting correctly
              previewElem.style.backgroundColor = "hsl(" + previews[i].color + ", 75%, 60%)";
            };
          };
        };

      }

    };
  });
