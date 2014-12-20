var nsMap = {};

(function(){
    var year;
    var currentYear = new Date().getFullYear();


    var MapController = function($scope,$html){

        initialize();
        var markers = createMarkers();


        $scope.yearcount = markers.startConflict;
        $scope.speedSlider = 500;
        $scope.start = function(){
            $scope.yearcount = markers.startConflict;

            year = setInterval(function(){
                if($scope.yearcount < currentYear){

                    setPointsOnMap($scope.yearcount,markers.heatMapMarkerArr);

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
            position: myLatlng, title:"My location!"
        });

        marker.setMap(map);
        nsMap.map =  map;
    };

}

function createMarkers(){

    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET","http://localhost:3000/src/data/data.json",false);
    xmlhttp.send();
    var data = JSON.parse(xmlhttp.responseText),
        startConflict = 3000,
        confstartYear,
        heatMapMarkerArr =[],
        i= 0,
        length=data.length;



    for(i;i<length;i++){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].conflictLocation.lat, data[i].conflictLocation.lat),
            title: data[i].conflictName
        });

        var point = {

            confStart: new Date(data[i].conflictStart).getFullYear(),
            confEnd: new Date(data[i].conflictEnd).getFullYear(),
            confLocation:marker

        };
        heatMapMarkerArr.push(point);

        confstartYear = new Date(data[i].conflictStart).getFullYear()
        if(confstartYear < startConflict){ startConflict=confstartYear};

    }

    return {
        heatMapMarkerArr:heatMapMarkerArr,
        startConflict:startConflict
    }

}

function setPointsOnMap(runningYear,markers){
    var i= 0,length=markers.length;

    for(i;i<length;i++){

        if(runningYear >= markers[i].confStart){
            if(runningYear <= markers[i].confEnd){
                markers[i].confLocation.setMap(nsMap.map);

            }else{
                markers[i].confLocation.setMap(null);
            }
        }else{
            markers[i].confLocation.setMap(null);
        }

    }

}