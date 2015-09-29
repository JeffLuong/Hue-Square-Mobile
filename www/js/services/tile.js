console.log("tile.js loaded...");

// For tile object
angular.module('hueSquare')

  .factory('Tile', function(baseColors) {
    'use strict';

    var Tile = function(position, color) {
      this.x              = position.x;
      this.y              = position.y;
      this.color          = color;
      this.lastPosition   = null;
      this.aiLastPosition = {x: 0, y: 0};

      this.startPosition  = function() {
        return {x: this.x, y: this.y};
      };

      this.saveLastPosition = function(position, isAiPlayer) {
        if (isAiPlayer) {
          this.aiLastPosition = {x: position.x, y: position.y};
        } else {
          this.lastPosition = {x: position.x, y: position.y};
        }
      };

      this.updatePosition = function(position) {
        this.x = position.x;
        this.y = position.y;
      };

      this.dupeTile = function () {
        return new Tile({
          x: this.x,
          y: this.y
        }, this.color);
      };
    };

    return (Tile);
  });
