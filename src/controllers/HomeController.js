/**
 * Created by Bart on 28/11/2014.
 */
(function(){
    var allConflicts = getConflictsJSON();

    var HomeController = function($scope,$html){
        //addSideScrollToTimeLine();
        $scope.conflicts = allConflicts;
        $scope.selectedConflict = allConflicts[allConflicts.length-1];
        $scope.setHighlight = function(conf){ $scope.selectedConflict = conf;  }
        $scope.tab = 1;
        $scope.selectTab = function (setTab){$scope.tab = setTab;};
        $scope.isSelected = function(checkTab) {return $scope.tab === checkTab;};
        $scope.scrollInit = function(){scrollInit();};


    };
    var app = angular.module("app");
    app.controller("HomeController",["$scope","$http","$log",HomeController]);

})();

function changeContent(section){



}

function getConflictByID(confID){
    var allConflicts = getConflictsJSON();
    var i= 0,arrlength = allConflicts.length;
    for(i;i<arrlength;i++){
        if(allConflicts[i].conflictID == confID){
            return allConflicts[i];
        }
    }

    return allConflicts[0];

}

function getConflictsJSON(){
	//console.log("In get JSON");
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","http://localhost:3000/src/data/data.json",false);
	xmlhttp.send();
    //console.log("suchJSON: "+conflicts);
	var conflicts = JSON.parse(xmlhttp.responseText);

	conflicts.sort(compare);

	return conflicts;



}

function compare(a,b) {
  if (a.conflictStart < b.conflictStart)
     return -1;
  if (a.conflictStart > b.conflictStart)
    return 1;
  return 0;
}

function getTimeLineItems(conflictsJSON){
    var i=0, conflictsLength= conflictsJSON.length;

    var myLittleConflictBuilder="";
    for(i;i<conflictsLength;i++){


        myLittleConflictBuilder +=
        '<div class="tl-cnf-item">'+

            '<div class="tl-cnf-bd"><p>'+conflictsJSON[i].conflictStart+'</p></div>'+
        '<div class="tl-cnf-title"><p>'+conflictsJSON[i].conflictName+'</p></div>'+
        '<div class="tl-cnf-ed"><p>'+conflictsJSON[i].conflictEnd+'</p></div>'

        +'</div>';

    }


    return myLittleConflictBuilder;
}

function scrollInit(){

    document.getElementById('timeLine').addEventListener('mousewheel', scrollElement, false);
}

function scrollElement(evt) {
    scrollTarget =      evt.currentTarget || evt.srcElement;

    if(scrollTarget.scrollWidth > scrollTarget.offsetWidth) {
        var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
        switch(delta) {
            case 1:
                scrollTarget.scrollLeft -= 32;
                break;

            case -1:
                scrollTarget.scrollLeft += 32;
                break;
        }
    }
}