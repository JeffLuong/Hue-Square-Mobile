console.log("row directive loaded...");
angular.module('hueSquare')

  .directive('rowRender', function($timeout) {
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
      },

      controller: function($rootScope, $scope, $element) {
        var rowArr = $scope.row.rowArr,
            size   = $scope.row.size;

        // Controller functions
        function addSquares() {
          $scope.squares = [];
          for (var y = 0; y < size; y++) {
            $scope.squares.push({
              width: size,
              tile: rowArr[y],
              squareNum: y
            });
          };
        };

        addSquares();
      }

    };
  });
