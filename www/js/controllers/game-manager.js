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
    this.currLvl = 3;
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
      this.genSolution(this.gameLvls[this.currLvl]);
      this.startPoint = this.getStartPosition(this.size);
      // this.getPreviewColors(this.startPoint);
      this.data.storeGame(this.serializeState(this.startPoint));
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

  this.moveUser = function(direction, aiPlayer, playOut) {
    console.log(this.gameOver);
    var position = null,
        vector   = this.getVector(direction),
        mixedColor,
        that = this;

    if (this.gameOver) {
      return;
    };

    // Actual Move function
    function makeMove(newPosition, AI) {
      // User dupeBoard if AI is making moves, otherwise use actual game board
      // var board = AI ? that.dupeBoard : that.board;
      if (AI) {
        board = that.dupeBoard;
      } else {
        board = that.board;
      }

      if (that.boardObj.inBounds(newPosition)) {
        mixedColor = that.findAverage(that.returnColor(position, board), that.returnColor(newPosition, board));
        board[newPosition.y][newPosition.x].color = mixedColor;
        tile.saveLastPosition(newPosition, AI);
        if (AI) {
          that.aiMoves.push(direction);
        };
      } else {
        return;
      };
    };

    // If AI PLAYER is making moves
    if (aiPlayer) {
      console.log("AI PLAYER is moving...");
      if (playOut) {
        // REMOVE PREVIEWS
      }

      position = this.aiMovedFromStart ? tile.aiLastPosition : tile.startPosition();
      var nextPosition = this.findNextPosition(position, vector);

      makeMove(nextPosition, aiPlayer);
      this.aiMovedFromStart = true;
    }

    // If USER PLAYER is making moves
    else if (aiPlayer === undefined || aiPlayer === false || aiPlayer === null) {
      console.log("PLAYER is moving...");
      this.moves.redoMoves = [];

      position = this.movedFromStart ? tile.lastPosition : tile.startPosition();
      var nextPosition = this.findNextPosition(position, vector);

      makeMove(nextPosition, aiPlayer);
      this.getPreviewColors(nextPosition);
      this.movedFromStart = true;

      // Serialize move to be stored
      var lastMove = {
        currPosition : nextPosition,
        lastPosition : position,
        lastVector   : vector,
        lastColor    : this.returnColor(position, this.board),
        mergedColor  : mixedColor
      };

      this.updateGame(lastMove, nextPosition, mixedColor);
      this.testIfWon(nextPosition, mixedColor, playOut);
      this.userMoves++;
    };
  };

  this.findNextPosition = function(currPosition, vector) {
    return { x: (currPosition.x + vector.x), y: (currPosition.y + vector.y) };
  };

  this.findLastPosition = function(currPosition, vector) {
    return { x: (currPosition.x - vector.x), y: (currPosition.y - vector.y) };
  };

  this.findNeighbors = function(position) {
    var availableNeighbors = [];
        availableVectors   = this.arrayifyVectors();

    for (var i = 0; i < 4; i++) {
      var neighbor = this.findNextPosition(position, availableVectors[i]);

      if (this.boardObj.inBounds(neighbor)) {
        availableNeighbors.push(neighbor);
      }
    };

    return availableNeighbors;
  };

  // Returns vector of any given direction...see app.js for vector object (it is a constant) & it's coordinates
  this.getVector = function(direction) {
    return vectors[direction];
  };

  this.arrayifyVectors = function() {
    var directionKeys = ["up", "right", "down", "left"],
        coordArray    = [];

    for (var i = 0; i < 4; i++) {
      coordArray.push(vectors[directionKeys[i]]);
    }
    return coordArray;
  }

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
      var color = this.findAverage(this.board[position.y][position.x].color, this.returnColor(neighbors[i], this.board));
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
    return board[position.y][position.x].color;
  };

  // Board Object Functions
  this.makeTiles = function(savedBoard) {
    console.log("making tiles...");
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if (savedBoard) {
          var color = this.board[y][x].color;
        } else {
          var color = this.genColor();
        }
        var tile = new Tile(this.boardObj.returnPosition(y, x), color);
        this.boardObj.addTile(tile);
      };
    };
  };

  // Game Mechanic Functions
  this.testIfWon = function(position, color, solution) {
    var rangeHigh = this.winColor + 2.25,
        rangeLow  = this.winColor - 2.25;
    if (position.x === this.winPoint.x && position.y === this.winPoint.y) {
      this.data.deleteGameState();
      console.log("hitting");
      this.gameOver = true;
      if (color >= rangeLow && color <= rangeHigh && solution !== true) {
        this.won = true;
        this.wins++;
        this.totalWins++;
        // this.renderer.rotateGoal(false, true);

        if (this.wins === this.rounds) {
          this.currLvl++;
          this.wins = 0;
        }

        if (this.currLvl === 8 && this.wins === 3) {
          // this.renderer.renderMessage(true, true)
        } else {
          // this.renderer.renderMessage(true, false);
        }
      } else if (color >= rangeLow || color <= rangeHigh) {
        // this.renderer.rotateGoal(false, false);
        // this.renderer.renderMessage(false, false);
      };
    };
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

    // if (this.won === true) {
    //   this.renderer.rotateGoal(true, true);
    // } else if (this.won === false) {
    //   this.renderer.rotateGoal(true, false);
    // }
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
      this.moves.redoMoves.unshift(this.moves.undoMoves[0]);
    }

    //~~~ Remove last move from undo list ~~~//
    var lastMove     = this.moves.undoMoves.shift(),
        lastPos      = this.findLastPosition(lastMove.currPosition, lastMove.lastVector),
        unMixedColor = this.reverseAverage(lastMove.mergedColor, lastMove.lastColor);

    //~~~ Save undone position ~~~//
    tile.saveLastPosition(lastMove.lastPosition);
    //~~~ Save undone colors onto board ~~~//
    this.board[lastMove.lastPosition.y][lastMove.lastPosition.x].color = lastMove.lastColor;
    this.board[lastMove.currPosition.y][lastMove.currPosition.x].color = unMixedColor;
    //~~~ Render changes ~~~//
    // this.renderer.undoUser(lastMove.currPosition, unMixedColor);
    // this.renderer.renderUser(lastMove.currPosition, lastMove.lastPosition, lastMove.lastColor);
    // this.getPreviewColors(lastMove.lastPosition);
    // this.userMoves -=1;
    // this.renderer.renderStats(this.userMoves, this.currLvl, this.totalWins);
    //~~~ serialize game ~~~//
    // this.data.storeGame(this.serializeState(lastMove.lastPosition));
    this.updateGame();
  };

  this.redo = function() {
    if (this.gameOver) {
      return;
    };

    //~~~ Return if there are no redo moves in stored ~~~//
    if (this.moves.redoMoves.length === 0) {
      return;
    }

    //~~~ Store undo moves into redo moves array ~~~//
    if (this.moves.redoMoves.length !== 0) {
      this.moves.undoMoves.unshift(this.moves.redoMoves[0]);
    }

    //~~~ Remove last move from redo list ~~~//
    var redoLast = this.moves.redoMoves.shift(),
        redoPos  = this.findNextPosition(redoLast.lastPosition, redoLast.lastVector);

    //~~~ Save redone position ~~~//
    tile.saveLastPosition(redoLast.currPosition);
    //~~~ Save redone colors onto board ~~~//
    this.board[redoLast.currPosition.y][redoLast.currPosition.x].color = redoLast.mergedColor;
    this.board[redoLast.lastPosition.y][redoLast.lastPosition.x].color = redoLast.lastColor;
    //~~~ Render changes ~~~//
    // this.renderer.undoUser(redoLast.lastPosition, redoLast.lastColor);
    // this.renderer.renderUser(redoLast.lastPosition, redoLast.currPosition, redoLast.mergedColor);
    this.getPreviewColors(redoLast.currPosition);
    this.userMoves++;
    // this.renderer.renderStats(this.userMoves, this.currLvl, this.totalWins);
    //~~~ serialize game ~~~//
    this.data.storeGame(this.serializeState(redoLast.currPosition));
  };

  // AI Functions
  this.genSolution = function(level) {
    console.log("Making dupe board....");
    var makeDupeBoard = this.boardObj.dupeBoard();
    this.dupeBoard    = makeDupeBoard.board;
    this.winPoint     = this.gameLvls.winPoint(this.currLvl);
    while (true) {
      var move = this.moveAiPlayer(level);
      if ((tile.aiLastPosition.x === this.winPoint.x) && (tile.aiLastPosition.y === this.winPoint.y)) {
        console.log("Win Position Reached");
        break;
      };
    };
    this.winColor = this.returnColor(this.winPoint, this.dupeBoard);
  };

  this.moveAiPlayer = function(level) {
    var chance  = Math.random(),
        move    = null;

    if (chance < level.scale) {
      var moves = ["right", "down"];
          move  = moves[Math.floor(Math.random() * 2)];
          console.log("AI PLAYER MOVINGGG");
      this.moveUser(move, true, null);
    } else {
      var moves = ["up", "left"];
          move  = moves[Math.floor(Math.random() * 2)];
          console.log("AI PLAYER MOVINGGG");
      this.moveUser(move, true, null);
    };
  };

  this.showSolution = function() {
    this.restart();
    var length   = this.aiMoves.length,
        that     = this,
        playOut  = true, // Means solution is being played out
        aiPlayer = undefined,
        timeout  = 10;

    for (var i = 0; i < length; i++) {
      (function(i) {
        setTimeout(function() {
          that.moveUser(that.aiMoves[i], aiPlayer, playOut);
        }, 750 + (750 * i));
      })(i);
    };
  };

  // Save Game
  this.serializeState = function(currPosition) {
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
    return currGame;
  };

  // Swipe functions
  this.onSwipe = function (direction) {
    $rootScope.$broadcast("game.onSwipe", direction);
    this.moveUser(direction);

  };

  // Initiate Game
  this.initGame(this.currLvl);

});
