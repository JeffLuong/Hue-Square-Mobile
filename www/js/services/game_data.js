// Game states & local storage
angular.module('hueSquare')

  .factory('gameData', function(baseColors) {
    'use strict';

    window.tempStorage = {
      data: {},

      setItem: function(id, val) {
        return this.data[id] = String(val);
      },

      getItem: function(id) {
        if (this.data.hasOwnProperty(id)) {
          return this.data[id];
        } else {
          return undefined;
        }
      },

      removeItem: function(id) {
        return delete this.data[id];
      },

      clearData: function() {
        return this.data = {};
      }
    }

    var GameDats = function() {
      this.currLvlKey   = "currLvl";
      this.userStatsKey = "stats";
      this.gameKey      = "gameState";

      // Test if browser supports window.localStorage
      this.isLocalStorageSupported = function() {
        var test    = "works?",
            storage = window.localStorage;

        console.log("testing if local storage is supported...");
        try {
          storage.setItem(test, "yes");
          storage.removeItem(test);
          return true;
        } catch (err) {
          return false;
        }
      };

      var browserSupports = this.isLocalStorageSupported();

      if (browserSupports) {
        this.storage = window.localStorage;
      } else {
        this.storage = window.tempStorage;
      };

      // Game State functions
      this.storeGame = function(game) {
        this.storage.setItem(this.gameKey, JSON.stringify(game));
      };

      this.deleteGameState = function() {
        this.storage.removeItem(this.gameKey);
      };

      this.storeUserStats = function(stats) {
        this.storage.setItem(this.userStatsKey, JSON.stringify(stats));
      }

      this.getUserStats = function() {
        var statsJSON = this.storage.getItem(this.userStatsKey);
        if (statsJSON) {
          return JSON.parse(statsJSON);
        } else {
          return null;
        }
      }

    };

    return (Board);
  });
