console.log("game-manager.js loaded...");
var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($scope, Game, Board, Tile, GameData, baseColors) {

  console.log("game-manager controller loaded...");

  this.tile     = new Tile({x: 0, y:0}, 360);
  this.boardObj = new Board(3);
  this.data     = new GameData;
  this.game     = new Game;

  this.gameLvls = this.game.initLevels();

  var userStatsStored = this.data.getUserStats();

  if (userStatsStored) {
    this.currLvl = userStatsStored.level;
  } else {
    this.currLvl = 1;
  }

  console.log(this.tile);
  console.log(this.boardObj);
  console.log(this.data);
  console.log(this.game);

  this.initGame = function () {
    console.log("game starting...");
  }

  this.genColor = function() {
    var colors = baseColors.arrColors;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Make tile objects
  this.makeTiles = function() {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if (savedBoard) {
          var color = this.gameBoard[y][x].color;
        } else {
          var color = this.genColor();
        }
        var tile = new Tile(this.board.position(y, x), color);

        this.board.addTile(tile);
      };
    };
  }

});
