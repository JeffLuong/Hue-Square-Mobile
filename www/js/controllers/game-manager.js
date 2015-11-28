var appModule = angular.module('hueSquare');

appModule.controller('gameManager', function($rootScope, $scope, Game, Board, Tile, GameData, baseColors, vectors, $timeout, $ionicModal) {

  // Modal
  $ionicModal.fromTemplateUrl('instruct-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Game Controller
  this.data     = new GameData;
  this.game     = new Game;

  this.gameLvls = this.game.initLevels();
  // Check if any user stats are stored in local storage
  this.userStatsStored = this.data.getUserStats();
  if (this.userStatsStored) {
    this.currLvl = this.userStatsStored.level;
  } else {
    this.currLvl = 1;
  }

  this.wins      = 0;
  this.totalWins = 0;
  this.rounds    = 2; // Number of rounds until board increase
  this.beatGame  = false;

  this.initGame = function (level) {
    var prevState   = this.data.getCurrGame();
    this.gameOver   = false;
    this.won        = false;
    if (prevState) {
      this.beatGame       = prevState.beatGame;
      this.boardObj       = new Board(prevState.board.size);
      this.board          = prevState.board.savedBoard;
      this.gameOver       = prevState.gameOver;
      this.movedFromStart = true;
      this.moves          = prevState.moves;
      this.aiMoves        = prevState.aiMoves;
      if (this.userStatsStored) {
        this.wins         = this.userStatsStored.wins;
        this.totalWins    = this.userStatsStored.totalWins;
      }
      this.winColor       = prevState.winColor;
      this.winPoint       = prevState.winPoint;
      this.makeTiles(prevState.board.savedBoard);
      this.initUser(prevState.savedPosition);
      var previews = this.getPreviewColors(prevState.savedPosition);
      this.data.storeGame(this.serializeState(prevState.savedPosition));
    } else {
      this.size             = this.gameLvls[level].size;
      this.boardObj         = new Board(this.size);
      this.board            = this.boardObj.board;
      this.movedFromStart   = false;
      this.aiMovedFromStart = false;
      this.moves            = { undoMoves: [], redoMoves: [] };
      this.aiMoves          = [];
      this.winColor;
      this.makeTiles();
      this.initUser();
      this.genSolution(this.gameLvls[this.currLvl]);
      this.startPoint = this.getStartPosition(this.size);
      var previews = this.getPreviewColors(this.startPoint);
      this.data.storeGame(this.serializeState(this.startPoint));
    };
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
      var board = AI ? that.dupeBoard : that.board;

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
      this.moves.redoMoves = [];

      position = this.movedFromStart ? tile.lastPosition : tile.startPosition();
      var nextPosition = this.findNextPosition(position, vector);

      makeMove(nextPosition, aiPlayer);
      var previews = this.getPreviewColors(nextPosition);

      this.movedFromStart = true;

      // Serialize move to be stored
      var lastMove = {
        currPosition : nextPosition,
        lastPosition : position,
        lastVector   : vector,
        lastColor    : this.returnColor(position, this.board),
        mergedColor  : mixedColor
      };

      this.testIfWon(nextPosition, mixedColor, playOut);
      this.updateGame(lastMove, mixedColor, previews, null, null, null, this.beatGame);
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
    var neighbors = this.findNeighbors(position);
        length    = neighbors.length,
        previews  = [];

    for (var i = 0; i < length; i++) {
      var color = this.findAverage(this.board[position.y][position.x].color, this.returnColor(neighbors[i], this.board));
      previews.push({
        position: neighbors[i],
        color: color
      });
    };

    return previews;
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
    var rangeHigh = this.winColor + 3.00,
        rangeLow  = this.winColor - 3.00,
        restart;
    if (position.x === this.winPoint.x && position.y === this.winPoint.y) {
      this.gameOver = true;
      if (color >= rangeLow && color <= rangeHigh && solution !== true) {
        restart  = false;
        this.won = true;
        this.wins++;
        this.totalWins++;

        if (this.wins === this.rounds) {
          this.currLvl++;
          this.wins = 0;
        }

        if (this.currLvl === 7 && this.wins === this.rounds) {
          this.beatGame = true;
        };

      } else if (color >= rangeLow || color <= rangeHigh) {
        restart  = false;
        this.won = false;
      };

      this.endGame(restart, this.won, this.beatGame);
    };
  };

  this.endGame = function(restart, won, wonGame) {
    $rootScope.$broadcast("game.game-over", restart, won, wonGame);
  }

  this.restart = function() {
    if (!this.movedFromStart) {
      return;
    } else {

      this.data.deleteGameState();
      var restart  = true;

      if (this.won) {
        this.wins--;
        this.totalWins--;
      }

      if (this.gameOver) {
        this.gameOver = false;
        this.won = false;

        // broadcast end game at restart
        this.endGame(restart, this.won, this.beatGmae);
      }

      var allMoves = this.moves.undoMoves,
          length   = allMoves.length;

      //~~~ Executes all undos ~~~//
      for (var i = 0; i < length; i++) {
        this.undo();
      };

      this.moves.undoMoves = [];
      this.moves.redoMoves = [];
    }
  };

  this.restartGame = function() {
    var gameRestart = true;
    this.restart();
    this.beatGame  = false;
    this.wins      = 0;
    this.totalWins = 0;
    this.currLvl   = 1;
    this.nextMap(gameRestart);
  };

  this.nextMap = function(gameRestart) {
    this.data.deleteGameState();

    var restart = true,
        won     = true;
    if (!gameRestart) {
      this.endGame(restart, won, this.beatGame);
      this.gameOver = false;
    }

    this.moves.undoMoves = [];
    this.moves.redoMoves = [];

    this.initGame(this.currLvl);
    // Broadcast to start a new game and board
    $rootScope.$broadcast("game.start-game");
    this.won = false;
  };

  this.updateGame = function(lastMove, mixedColor, previews, undo, redo, color, winResult) {

    if (!undo || undo === undefined || redo) {
      this.moves.undoMoves.unshift(lastMove);
      var nextPosition = lastMove.currPosition;
      $rootScope.$broadcast("game.onSwipe", lastMove.lastPosition, nextPosition, mixedColor, previews);
    } else if (undo) {
      var nextPosition = lastMove.lastPosition;
      $rootScope.$broadcast("game.onSwipe", lastMove.currPosition, nextPosition, mixedColor, previews, color);
    }

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
    var previews  = this.getPreviewColors(lastMove.lastPosition),
        undoColor = lastMove.lastColor,
        undo      = true,
        redo      = false;

    this.updateGame(lastMove, undoColor, previews, undo, redo, unMixedColor);

    //~~~ serialize game ~~~//
    this.data.storeGame(this.serializeState(lastMove.lastPosition));
  };

  this.redo = function() {
    if (this.gameOver) {
      return;
    };

    //~~~ Return if there are no redo moves in stored ~~~//
    if (this.moves.redoMoves.length === 0) {
      return;
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
    var previews = this.getPreviewColors(redoLast.currPosition),
        redo      = true,
        undo      = false;

    this.updateGame(redoLast, redoLast.mergedColor, previews, undo, redo);

    //~~~ serialize game ~~~//
    this.data.storeGame(this.serializeState(redoLast.currPosition));
  };

  // AI Functions
  this.genSolution = function(level) {
    var makeDupeBoard = this.boardObj.dupeBoard();
    this.dupeBoard    = makeDupeBoard.board;
    this.winPoint     = this.gameLvls.winPoint(this.currLvl);
    while (true) {
      var move = this.moveAiPlayer(level);
      if ((tile.aiLastPosition.x === this.winPoint.x) && (tile.aiLastPosition.y === this.winPoint.y)) {
        break;
      };
    };
    this.winColor = this.returnColor(this.winPoint, this.dupeBoard);
  };

  this.moveAiPlayer = function(level) {
    var chance = Math.random(),
        move   = null;

    if (chance < level.scale) {
      var moves = ["right", "down"];
          move  = moves[Math.floor(Math.random() * 2)];
      this.moveUser(move, true, null);
    } else {
      var moves = ["up", "left"];
          move  = moves[Math.floor(Math.random() * 2)];
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
      aiMoves:       this.aiMoves,
      beatGame:      this.beatGame,
      gameOver:      this.gameOver
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
    this.moveUser(direction);

  };

  // Initiate Game
  this.initGame(this.currLvl);

});
