console.log("game.js loaded...");

// For game levels and settings
angular.module('hueSquare')

  .factory('Game', function(baseColors) {
    'use strict';

    var Game = function() {
      this.initLevels = function() {
        var levels = {
          1: { scale: 0.80, size: 2 }, //moveRange is num of moves ai takes
          2: { scale: 0.85, size: 3 },
          3: { scale: 0.90, size: 4 },
          // 4: { scale: 0.92, size: 5 },
          // 5: { scale: 0.94, size: 6 },
          // 6: { scale: 0.96, size: 7 },
          winPoint: function(level) {
            return { x: this[level].size - 1, y: this[level].size - 1 };
          }
        };

        return levels;
      };
    };

    return (Game);
  });
