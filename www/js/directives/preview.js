console.log("preview directive loaded...");
angular.module('hueSquare')

  .directive('previewRender', function($rootScope, $timeout) {
    return {
      require: '^tileRender',
      restrict: 'A',

      link: function(scope, element, attr) {
        // console.log(scope);
      }

    };
  });
