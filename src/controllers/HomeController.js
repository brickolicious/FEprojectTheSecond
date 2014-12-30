/**
 * Created by Bart on 28/11/2014.
 */
(function(){
    var allConflicts = getConflictsJSON();

    var HomeController = function($scope,$html){
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

    try{
	var xmlhttp=new XMLHttpRequest(),conflicts;
    xmlhttp.open("GET","http://"+window.location.hostname+":3000/src/data/data.json",false);
	xmlhttp.send();
	conflicts = JSON.parse(xmlhttp.responseText);

	conflicts.sort(compare);
    localStorage.setItem('conflicts',JSON.stringify(conflicts));

    return conflicts;
    }
    catch(exception){
        console.log("No xmlhttprequest possible.");
        return localStorage.getItem('conflicts');
    }

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


