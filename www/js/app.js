// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('hueSquare', ['ionic', 'ngCordova']);

// Constants
app.constant('baseColors', {
  arrColors: [360, 230, 60]
})

.constant('vectors', {
  "up":    { x:  0, y: -1 },
  "right": { x:  1, y:  0 },
  "down":  { x:  0, y:  1 },
  "left":  { x: -1, y:  0 }
})

// Run app
.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {

    // Hides status bar
    // $cordovaStatusbar.hide();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Loading screen
    // function onReady(callback) {
    //   var interval = window.setInterval(checkReady, 250);
    //   function checkReady() {
    //     if ($("body")[0] !== undefined) {
    //       window.clearInterval(interval);
    //       callback.call(this);
    //     }
    //   }
    // }
    //
    // onReady(function() {
    //   $("#loading").fadeOut(250);
    //   $("#main-container").fadeIn(350);
    // });

    console.log("app.js is loaded...");

  });
})
