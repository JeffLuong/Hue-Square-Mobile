console.log("game-manager.js loaded...");
var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($rootScope, $scope, Game, Board, Tile, GameData, baseColors, vectors) {

  console.log("game-manager controller loaded...");
  this.data     = new GameData;
  this.game     = new Game;

  this.gameLvls = this.game.initLevels();

  // Check if any user stats are stored in local storage
  // this.userStatsStored = this.data.getUserStats();
  // console.log(this.userStatsStored);
  // if (this.userStatsStored) {
  //   console.log("GETTING USER STORED STATS");
  //   this.currLvl = this.userStatsStored.level;
  // } else {
  //   console.log("NO USER STORED STATS");
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

  // User Tile Functions
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

  this.moveUser = function(direction, aiPlayer, aiMoves, solution) {

  };

  this.findNextPosition = function(currPosition, vector) {
    return { x: (currPosition.x + vector.x), y: (currPosition.y + vector.y) };
  };

  this.findLastPosition = function(currPosition, vector) {
    return { x: (currPosition.x - vector.x), y: (currPosition.y - vector.y) };
  };

  this.findNeighbors = function(position) {
    var availableNeighbors = [];

    for (var i = 0; i < 4; i++) {
      var neighbor = this.findNextPosition(position, vectors[i]);

      if (this.boardObj.inBounds(neighbor)) {
        availableNeighbors.push(neighbor);
      }
    };
    return availableNeighbors;
  };

  this.getVector = function(direction) {
    return vectors[direction];
  };

  // Color Functions
  this.genColor = function() {
    var colors = baseColors.arrColors;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  this.getPreviewColors = function(position) {
    var neighbors     = this.findNeighbors(position);
        length        = neighbors.length,
        previewColors = [];

    for (var i = 0; i < length; i++) {
      var color = this.findAverage(this.board[position.x][position.y].color, this.returnColor(neighbors[i], this.gameBoard));
      previewColors.push(color);
    };

    // this.renderer.renderPreview(this.gameBoard, neighbors, previewColors);
  };

  this.findAverage = function(color1, color2) {
    var colorDiff;

    //~~~ Finds out if colors are over 180 or not ~~~//
    var colorResult1 = 360 - color1,
        colorResult2 = 360 - color2;

    //~~~ Finds out if color difference is over 180 or not ~~~//
    if (color1 > color2) {
      colorDiff = color1 - color2;
    } else if (color2 > color1) {
      colorDiff = color2 - color1;
    }

    //~~~ If difference between colors is larger than 180 ~~~//
    if (colorDiff > 180) {
      var finalColor;
      if (colorResult1 < 180 && colorResult2 > 180) {
        finalColor = ((colorResult2 + color1) / 2) - colorResult2;
      } else if (colorResult1 > 180 && colorResult2 < 180) {
        finalColor = ((colorResult1 + color2) / 2) - colorResult1;
      };

      //~~~ If mixed color value is less than 0, rotate back to positive  ~~~//
      if (finalColor < 0) {
        return finalColor + 360
      }

      return finalColor;
    } else {
      return ((color1 + color2) / 2);
    };
  };

  this.reverseAverage = function(color1, color2) {
    var unMixedColor = (color1 * 2) - color2;

    if (unMixedColor < 0) {
      return unMixedColor + 360;
    } else if (unMixedColor > 360){
      return unMixedColor - 360;
    } else {
      return unMixedColor;
    };
  };

  this.returnColor = function(position, board) {
    return board[position.x][position.y].color;
  };

  // Board Object Functions
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

  // Game Mechanic Functions
  this.testIfWon = function(position, color, solution) {
    var rangeHigh = this.winColor + 2.25,
        rangeLow  = this.winColor - 2.25;
    if (position.x === this.winPoint.x && position.y === this.winPoint.y) {
      this.data.deleteGameState();
      this.gameOver = true;
      if (color >= rangeLow && color <= rangeHigh && solution !== true) {
        this.won = true;
        this.wins++;
        this.totalWins++;
        // this.renderer.rotateGoal(false, true);

        if (this.wins === this.rounds) {
          this.setting++;
          this.wins = 0;
        }

        if (this.setting === 8 && this.wins === 3) {
          // this.renderer.renderMessage(true, true)
        } else {
          // this.renderer.renderMessage(true, false);
        }
      } else if (color >= rangeLow || color <= rangeHigh) {
        // this.renderer.rotateGoal(false, false);
        // this.renderer.renderMessage(false, false);
      };
    };
    console.log(this.wins);
  };

  this.restart = function() {
    this.data.deleteGameState();
    this.gameOver = false;
    // this.renderer.clearMessage(); <<<need to think about how to clear message
    var allMoves = this.moves.undoMoves,
        length   = allMoves.length;

    //~~~ Executes all undos ~~~//
    for (var i = 0; i < length; i++) {
      this.undo();
    };

    if (this.won === true) {
      this.renderer.rotateGoal(true, true);
    } else if (this.won === false) {
      this.renderer.rotateGoal(true, false);
    }
    this.won = false;
    this.moves.undoMoves = [];
    this.moves.redoMoves = [];
  };

  this.nextMap = function() {
    this.gameOver = false;
    this.moves.undoMoves = [];
    this.moves.redoMoves = [];
    // this.renderer.removeGameBoard(); <<<need to think about how to remove game board
    this.initGame(this.currLvl);
    this.won = false;
  };

  this.updateGame = function(lastMove, nextPosition, mixedColor) {
    // this.moves.undoMoves.unshift(lastMove);
    // this.renderer.renderUser(lastMove.lastPosition, nextPosition, mixedColor);
    this.data.storeGame(this.serializeState(nextPosition));
  };

  this.undo = function() {
    if (this.gameOver) {
      return;
    }
    //~~~ Return if there are no undo moves in stored ~~~//
    if (this.moves.undoMoves.length === 0) {
      return;
    }

    //~~~ Store undo moves into redo moves array ~~~//
    if (this.moves.undoMoves.length !== 0) {
      console.log("storing undo...");
      this.moves.redoMoves.unshift(this.moves.undoMoves[0]);
    }

    //~~~ Remove last move from undo list ~~~//
    var lastMove     = this.moves.undoMoves.shift(),
        lastPos      = this.findLastPosition(lastMove.currPosition, lastMove.lastVector),
        unMixedColor = this.reverseAverage(lastMove.mergedColor, lastMove.lastColor);

    //~~~ Save undone position ~~~//
    tile.saveLastPosition(lastMove.lastPosition);
    //~~~ Save undone colors onto board ~~~//
    this.board[lastMove.lastPosition.x][lastMove.lastPosition.y].color = lastMove.lastColor;
    this.board[lastMove.currPosition.x][lastMove.currPosition.y].color = unMixedColor;
    //~~~ Render changes ~~~//
    // this.renderer.undoUser(lastMove.currPosition, unMixedColor);
    // this.renderer.renderUser(lastMove.currPosition, lastMove.lastPosition, lastMove.lastColor);
    // this.getPreviewColors(lastMove.lastPosition);
    // this.userMoves -=1;
    // this.renderer.renderStats(this.userMoves, this.setting, this.totalWins);
    //~~~ serialize game ~~~//
    // this.data.storeGame(this.serializeState(lastMove.lastPosition));
    this.updateGame();
  };

  // Save Game
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

    var vector = this.getVector(direction);
    this.moveUser(vector);
  };

  this.initGame(this.currLvl); // Initialize game
  this.data.storeGame(this.serializeState({x: 0, y: 0}));

});
