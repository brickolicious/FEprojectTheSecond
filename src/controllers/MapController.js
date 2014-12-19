(function(){
    var year;
    var MapController = function($scope,$html){
    	var map;
    	initialize();

        $scope.yearcount = 0000;
        $scope.speedSlider = 500;
        $scope.start = function(){
            $scope.yearcount = 1990;
            year = setInterval(function(){
                if($scope.yearcount < 2015){
                    $scope.yearcount++;
                    $scope.$apply();
                    //console.log($scope.yearcount);
                }else{clearInterval(year);}
            },$scope.speedSlider);
        }

    };
    var app = angular.module("app");
    app.controller("MapController",["$scope","$http","$log",MapController]);

})();

function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var style = [{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#00ff88"},{"lightness":14},{"color":"#667348"},{"saturation":4},{"gamma":1.14}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#313916"},{"weight":0.8}]},{"featureType":"road","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"simplified"},{"color":"#334b1f"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]}];
    var styledMap = new google.maps.StyledMapType(style, {name:"Styled Map"});
    var map;



    navigator.geolocation.getCurrentPosition(success,navError);
    function navError(){ console.log("No nav available.");}

    function success(pos) {

        myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        var mapOptions = {
            zoom: 3,
            center: myLatlng,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        var marker = new google.maps.Marker({
            position: myLatlng, title:"Hello World!"
        });

        marker.setMap(map);
    };


}