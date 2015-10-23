console.log("preview directive loaded...");
angular.module('hueSquare')

  .directive('previewRender', function($rootScope, $timeout) {
    return {
      require: '^tileRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        var previewElem = element[0],
            previewXpos = scope.tile.x,
            previewYpos = scope.tile.y;

        previewElem.classList.add("prev-position-" + (previewXpos + 1) + "-" + (previewYpos + 1));
        // console.log(scope);

        renderPreviews(null, scope.tile.previews); // render previews based on current position

        $rootScope.$on("game.render-previews", renderPreviews);

        function renderPreviews(e, previews) {
          console.log("rendering previews");
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
