// For board object
angular.module('hueSquare')

  .factory('Board', function(baseColors) {
    'use strict';

    var Board = function(size) {
      this.size  = size;

      this.makeBoard = function() {
        var emptyBoard = [];
        for (var x = 0; x < this.size; x++) {
          var row = emptyBoard[x] = [];
          for (var y = 0; y < this.size; y++) {
            row.push(null);
          };
        };
        return emptyBoard;
      };

      // Dupe board for ai to play
      this.dupeBoard = function() {
        var duped = new Board(this.size);

        for (var row = 0; row < duped.size; row++) {
          for (var col = 0; col < duped.size; col++) {
            var tile = this.board[row][col].dupeTile();
            duped.addTile(tile);
          };
        };

        return duped;
      };

      this.returnPosition = function(y, x) {
        return {x: x, y: y};
      };

      this.addTile = function(tile) {
        this.board[tile.y][tile.x] = tile;
      };

      // Check if within bounds...returns true/false
      this.inBounds = function(position) {
        return position.x >= 0 && position.y >= 0 && position.x < this.size && position.y < this.size;
      };

      this.serializeBoard = function(board) {
        var currState = {
          size       : this.size,
          savedBoard : board
        };

        return currState;
      }

      this.board = this.makeBoard();
    };

    return (Board);
  });
