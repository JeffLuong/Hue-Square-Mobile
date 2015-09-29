console.log("tile directive loaded...");
angular.module('hueSquare')

  .directive('tileRender', function($timeout, GameData) {
    console.log("------------------------");
    return {
      restrict: 'A',
      template: "<h1>HELLO WORLD</h1>",
      controller: function($rootScope, $scope, $element) {
        var game = new GameData;
        var currGame = game.getCurrGame();
        console.log(currGame.board.savedBoard);
      }
    }
  });
