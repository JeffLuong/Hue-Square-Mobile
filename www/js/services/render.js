angular.module('hueSquare')

  .factory('render', function($timeout) {
    'use strict';

    var render = {
      initBoard: function(size, board, userTile, winColor) {
        this.makeRows(size, board, winColor);
        this.renderUser(board, userTile, null, null);
      },

      removeGameBoard: function(board) {
        var $rows = $(".board-row");
        $rows.remove();
        this.clearMessage();
      },

      renderStats: function(count, level, wins) {
        $timeout(function() {
          angular.element(".game-levels").addClass("animateStats");
          angular.element(".game-moves").addClass("animateStats");
          angular.element(".game-wins").addClass("animateStats");
        }, 250);
        $timeout(function() {
          // $(".wins").text(wins);
          // $(".moves").text(count);
          // $(".levels").text(level);
          angular.element(".game-wins").addClass("animateText");
          angular.element(".game-moves p").addClass("animateText");
          angular.element(".game-levels p").addClass("animateText");
        }, 500);
      },

      makeRows: function(size, board, winColor) {
        var windowSize = $(window).width();

        for (var y = 0; y < size; y++) {
          var $row = angular.element("<div class='board-row row" + (y + 1) + "'>");

          for (var x = 0; x < size; x++) {
            var $sq  = angular.element("<div class='board-sq square" + (x + 1) + "'>");
            $sq.css({
              "width": "calc(100% / " + size + ")"
            });

            var $tile  = this.renderTiles(board, y, x);

            if ((x === (size - 1)) && (y === (size - 1))) {
              var $goal = angular.element("<div class='game-goal shadow'>");

              $goal.css({
                "background-color": "hsl(" + winColor + ", 75%, 60%)"
              });

              $tile.append($goal);
            };
            $sq.append($tile);
            $row.append($sq);
          };

          $row.css({
            "height": "calc(100% / " + size + ")"
          });
          this.$boardContainer.append($row);
          this.animateRows(size);
        }
      },

      animateRows: function(size) {
        //~~ Adds animation for each tile ~~//
        $timeout(function() {
          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var $eachTile = $(".tile-position-" + (x + 1) + "-" + (y + 1));
              $eachTile.addClass("delayX" + (x + 1) + "Y" + (y + 1));
              $eachTile.addClass("animateIn");
            };
          }
        }, 250);
      },

      renderTiles: function(board, y, x) {
        var $tile
      }




    }

    return render;
  });
