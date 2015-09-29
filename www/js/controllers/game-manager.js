console.log("game-manager.js loaded...");
var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($scope, render, game, baseColors, Board, Tile, GameData) {

  console.log("game-manager controller loaded...");

  // console.log(tile);

  $scope.tile = new Tile({x: 0, y:0}, 360);
  $scope.board = new Board;
  $scope.data = new GameData;

  console.log($scope.tile);
  console.log($scope.board);
  console.log($scope.data);

});
