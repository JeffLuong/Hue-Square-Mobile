angular.module('hueSquare')

  .directive('rowRender', function($timeout, $rootScope) {
    return {
      require: '^board',
      restrict: 'A',
      template:
      "<div ng-repeat='square in squares' class='board-sq' square-render>" +
      "</div>",
      link: function(scope, element, attr) {
        var row    = element[0],
            rowNum = scope.row.rowNum,
            size   = scope.row.size;


        row.style.height = "calc(100% / " + size + ")";
        row.classList.add("row" + (rowNum + 1));

        // Square functions
        var rowArr   = scope.row.rowArr,
            size     = scope.row.size,
            previews = scope.row.previews;

        function addSquares() {
          scope.squares = [];
          for (var y = 0; y < size; y++) {
            scope.squares.push({
              width: size,
              tile: rowArr[y],
              squareNum: y,
              previews: previews
            });
          };
        };

        addSquares();
      },

      controller: function($rootScope, $scope, $element) {
        // Need this controller for square directive
      }

    };
  });
