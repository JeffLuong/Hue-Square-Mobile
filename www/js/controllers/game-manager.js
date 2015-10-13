console.log("game-manager.js loaded...");
var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($rootScope, $scope, Game, Board, Tile, GameData, baseColors) {

  console.log("game-manager controller loaded...");
  this.data     = new GameData;
  this.game     = new Game;

  this.gameLvls = this.game.initLevels();

  // Check if any user stats are stored in local storage
  // this.userStatsStored = this.data.getUserStats();
  console.log(this.userStatsStored);
  // if (this.userStatsStored) {
  //   console.log("GETTING USER STORED STATS");
  //   this.currLvl = this.userStatsStored.level;
  // } else {
    // console.log("NO USER STORED STATS");
    this.currLvl = 1;
  // }

  this.wins      = 0;
  this.totalWins = 0;
  this.rounds    = 3; // Number of rounds until board increase

  this.initGame = function (level) {
    console.log("game starting...");
    // var prevState     = this.data.getCurrGame();
        this.gameOver = false;
        this.won      = false;
    // if (prevState) {
    //   console.log("fetching saved game state...");
    //   this.boardObj         = new Board(prevState.board.size);
    //   this.board            = prevState.board.savedboard;
    //   this.initUser(prevState.savedPosition);
    // } else {
      this.size             = this.gameLvls[level].size;
      this.boardObj         = new Board(this.size);
      this.board            = this.boardObj.board;
      this.movedFromStart   = false;
      this.aiMovedFromStart = false;
      this.userMoves        = 0;
      this.moves            = { undoMoves: [], redoMoves: [] };
      this.aiMoves          = [];
      this.winColor;
      this.makeTiles();
      this.initUser();
    // }
  };

  this.initUser = function(savedPosition) {
    var startPos;
    if (savedPosition) {
      startPos = this.getStartPosition(this.size, savedPosition);
    } else {
      startPos = this.getStartPosition(this.size);
    }
    this.insertUser(this.board, startPos);
  };

  this.insertUser = function(board, position) {
    this.userTile = board[position.x][position.y];
  };

  this.getStartPosition = function(size, savedPosition) {
    if (savedPosition === undefined) {
      var x        = 0,
          y        = 0,
          position = {x: x, y: y},
          color    = this.board[x][y].color;
          tile     = new Tile(position, color);

      console.log(this.board);
      return tile.startPosition();

    } else if (savedPosition) {
      var x        = savedPosition.x,
          y        = savedPosition.y,
          position = {x: x, y: y},
          color    = this.board[x][y].color;
          tile     = new Tile(position, color);
          tile.lastPosition = position;

      return tile.startPosition();
    }
  };

  this.genColor = function() {
    var colors = baseColors.arrColors;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Make tile objects
  this.makeTiles = function(savedBoard) {
    console.log("making tiles...");
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if (savedBoard) {
          var color = this.board[y][x].color;
        } else {
          console.log("randomly generating colors...");
          var color = this.genColor();
        }
        var tile = new Tile(this.boardObj.returnPosition(y, x), color);
        console.log("adding", tile);
        this.boardObj.addTile(tile);
      };
    };
    console.log(this.board);
  };

  this.serializeState = function(currPosition) {
    console.log("serializing...");
    var currGame = {
      board:         this.boardObj.serializeBoard(this.board),
      moves:         this.moves,
      winColor:      this.winColor,
      winPoint:      this.winPoint,
      savedPosition: currPosition,
      aiMoves:       this.aiMoves
    };

    var userStats = {
      totalWins: this.totalWins,
      level:     this.currLvl,
      wins:      this.wins
    }

    // stores user stats
    this.data.storeUserStats(userStats);
    console.log(currGame);
    return currGame;
  };


  this.onSwipe = function (direction) {
    $rootScope.$broadcast("game.onSwipe('" + direction + "')");
  };

  this.initGame(this.currLvl); // Initialize game
  // this.data.storeGame(this.serializeState({x: 0, y: 0}));

});
