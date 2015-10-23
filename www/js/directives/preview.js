console.log("preview directive loaded...");
angular.module('hueSquare')

  .directive('previewRender', function($rootScope, $timeout) {
    return {
      require: '^tileRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        var previewElem = element[0],
            previewXpos = scope.tile.x,
            previewYpos = scope.tile.y,
            size        = scope.square.width;

        $rootScope.$on("game.render-previews", renderPreviews);

        previewElem.classList.add("prev-position-" + (previewXpos + 1) + "-" + (previewYpos + 1));
        renderPreviews(null, scope.tile.previews); // render previews based on current position

        if (previewXpos === (size - 1) && (previewYpos === (size - 1))) {
          previewElem.remove();
        }

        function renderPreviews(e, previews) {
          // resets all previews to display none
          previewElem.style.display = "none";

          // sets neighboring previews to display block and change color
          var len = previews.length;
          for (var i = 0; i < len; i++) {
            if (previewXpos === previews[i].position.x && previewYpos === previews[i].position.y) {
              previewElem.style.display = "block";
              previewElem.style.backgroundColor = "hsl(" + previews[i].color + ", 75%, 60%)";
            };
          };
        };

      }

    };
  });
