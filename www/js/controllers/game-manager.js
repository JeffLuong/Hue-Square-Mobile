var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($scope, render, game, baseColors, board, tile) {
  // this.size = 3;
  //
  // this.genColor = function() {
  //   return baseColors[Math.floor(Math.random() * this.baseColors.length)];
  // }
  //
  // this.makeTiles = function(savedBoard) {
  //   for (var y = 0; y < this.size; y++) {
  //     for (var x = 0; x < this.size; x++) {
  //       if (savedBoard) {
  //         var color = this.gameBoard[y][x].color;
  //       } else {
  //         var color = $scope.genColor();
  //       }
  //       var tile = new Tile(this.board.position(y, x), color);
  //
  //       board.addTile(tile);
  //     };
  //   };
  // }

});
