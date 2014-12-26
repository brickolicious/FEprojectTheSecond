/**
 * Created by Bart on 28/11/2014.
 */

(function(){
    "use strict";
    //bij aanmaken van app verplicht array meegeven!!! []
    //bij oproepen niet
    var app = angular.module("app",["ngRoute","ngAnimate"]);

    app.config(function($routeProvider){
        $routeProvider.when("/home",{
            templateUrl : "../partialviews/home.html",
            controller:"HomeController"
        }).when("/map",{
            templateUrl:"../partialviews/map.html",
            controller:"MapController"
        }).otherwise({redirectTo:"/home"});
    });
})();