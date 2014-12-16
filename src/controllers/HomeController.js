/**
 * Created by Bart on 28/11/2014.
 */
(function(){
    var allConflicts = getConflictsJSON();

    var HomeController = function($scope,$html){
        //addSideScrollToTimeLine();
        $scope.conflicts = allConflicts;

        $scope.filterString="";
        $scope.listFilter = function(){
            if($scope.filterString == ""){
                $scope.conflicts = allConflicts;
            }else{
                $scope.conflicts = filterConflicts(allConflicts,$scope.filterString);
            }
        };

        $scope.selectedConflict = allConflicts[allConflicts.length-1];
        $scope.setHighlight = function(conf){ $scope.selectedConflict = conf;  };
        $scope.tab = 1;
        $scope.selectTab = function (setTab){$scope.tab = setTab;};
        $scope.isSelected = function(checkTab) {return $scope.tab === checkTab;};


    };
    var app = angular.module("app");
    app.controller("HomeController",["$scope","$http","$log",HomeController]);

})();


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

function filterConflicts(confArr,keyword){
    var filteredArr=[],confLength=confArr.length,i=0;

    for(i;i<confLength;i++){
        if(confArr[i].conflictName.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
            filteredArr.push(confArr[i]);
        }
    }

    return filteredArr;

}

