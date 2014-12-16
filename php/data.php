<?php
header('Content-Type: application/json');

echo "[";

$txt = " ";
foreach(getAllConflicts() as $key => $value){

    $almostJSON =  stripslashes(json_encode($value,true));
    $almostJSON = str_replace('"{','{',$almostJSON);
    $almostJSON = str_replace('}"','}',$almostJSON);
    $almostJSON = str_replace('"[','[',$almostJSON);
    $almostJSON = str_replace(']"',']',$almostJSON);
    //echo $almostJSON.",";
    $txt = $txt.($almostJSON.',');
}
    $txt = trim($txt,",");
echo $txt;
echo "]";




class Conflict{


    public $conflictID;
    public $conflictName;
    public $conflictLocation = array("long"=>"","lat"=>"");
    public $conflictStart; //= date("d-m-Y");
    public $conflictEnd; // = date("d-m-Y");
    public $conflictDescription;
    public $conflictDead;
    public $conflictWounded;
    public $conflictImgName;
    public $conflictRegime;
    public $conflictType;
    public $conflictCountries = array();
    public $conflictWeapons = array();


}
class Type{

    public $typeID;
    public $typeName;

}
class Regime{

        public $regimeID;
        public $regimeName;
        public $regimeLeader;
        public $regimeDescription;


}
class Country{
        public $countryID;
        public $countryName;

}
class Weapon{
        public $weaponID;
        public $weaponName;
        public $weaponDeveloped;
        public $weaponDescription;
        public $weaponIMG;
        public $weaponCountry;
}

function getAllConflicts(){

    $host = "sql4.freemysqlhosting.net";
    $dbname="sql457591";
    $user="sql457591";
    $password="uC3!pV9%";
    $port=3306;
    $mysqli = new mysqli($host,$user,$password,$dbname,3306);
    $mysqli->set_charset('utf-8');
    if ($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ') '. $mysqli->connect_error);
    }

        $stmt = $mysqli->prepare("SELECT * FROM conflicts INNER JOIN regime ON regime.regimeID = conflicts.regimeID JOIN conflictType ON typeID = conflictType_typeID");

        $stmt->execute();
        $res = $stmt->get_result();
        $output = array();
        while ($row = $res->fetch_assoc()) {

            $conflictObj = new Conflict();
            $conflictObj->conflictID = $row["conflictID"];
            $conflictObj->conflictName = $row["name"];
            $conflictObj->conflictLocation = array("long" => $row["long"], "lat" => $row["lat"]);
            $conflictObj->conflictStart = $row["start"];
            $conflictObj->conflictEnd = $row["end"];
            $conflictObj->conflictDescription = $row["description"];
            $conflictObj->conflictDead = $row["dead"];
            $conflictObj->conflictWounded = $row["wounded"];
            $conflictObj->conflictImgName = $row["imgConflict"];

            $regime = new Regime();
            $regime->regimeID = $row["regimeID"];
            $regime->regimeName = $row["regimeName"];
            $regime->regimeLeader = $row["regimeLeader"];
            $regime->regimeDescription = $row["regimeDescription"];

            $reg = stripslashes(json_encode($regime));
            $reg = str_replace('"{','{',$reg);
            $reg = str_replace('}"','}',$reg);
            $conflictObj->conflictRegime = $reg;

            $type = new Type();
            $type->typeID = $row["typeID"];
            $type->typeName = $row["conflictType"];

            $tempType = stripslashes(json_encode($type));
            $tempType = str_replace('"{','{',$tempType);
            $tempType = str_replace('}"','}',$tempType);
            $conflictObj->conflictType = $tempType;

            $conflictObj->conflictWeapons = array();


            array_push($output,$conflictObj);
        };


        $mysqli->close();


        foreach($output as $key => $value){

            $tempID = $value->conflictID;
            $gunz = getAllWeaponsUsedInConflict($tempID);
            $conts = getInvolvedCountries($tempID);
            if(count($gunz) > 0) {
                //$gunz = substr($gunz,0,0);
                $value->conflictWeapons = $gunz;
                $value->conflictCountries = $conts;
            }else{
                $value->conflictWeapons = array();
            }
            //print_r($value);
        }

        return $output;

}


function getAllWeaponsUsedInConflict($confID =0){
    //echo 'In get weapons for conflict.';
    if($confID == 0 || $confID == null){ return array();}

    $host = "sql4.freemysqlhosting.net";
    $dbname="sql457591";
    $user="sql457591";
    $password="uC3!pV9%";
    $port=3306;
    $mysqli = new mysqli($host,$user,$password,$dbname,3306);
    $mysqli->set_charset('utf-8');
    if ($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ') '. $mysqli->connect_error);
    }

    $stmt = $mysqli->prepare("
    SELECT * FROM conflictsWeapons
    INNER JOIN weapons on weaponID = weapons_weaponID
    INNER JOIN countries ON countryID = countries_countryID
    WHERE conflicts_conflictID = ?
    ");
    $stmt->bind_param("i",$confID);

    $stmt->execute();
    $res = $stmt->get_result();
    $weaponArr = array();
    while ($row = $res->fetch_assoc()) {

        $weapon = new Weapon();
        $weapon->weaponID = $row["weaponID"];
        $weapon->weaponName = $row["name"];
        $weapon->weaponDescription  = $row["description"];
        $weapon->weaponDeveloped  = $row["developed"];
        $weapon->weaponIMG  = $row["imgWeapon"];

        $country = new Country();
        $country->countryID  = $row["countryID"];
        $country->countryName = $row["countryName"];

        $cont = stripslashes(json_encode($country));
        $cont = str_replace('"{','{',$cont);
        $cont = str_replace('}"','}',$cont);
        $weapon->weaponCountry = $cont;

        array_push($weaponArr,$weapon);
    };
    //print_r($weaponArr);
    $wep = stripslashes(json_encode($weaponArr));
    $wep = str_replace('"{','{',$wep);
    $wep = str_replace('}"','}',$wep);


    //echo '++++++++++++++++++++++++++++++++++'.print_r($wep).'+++++++++++++++++++++++++++++++++++++++';
    return $wep;
}

function getInvolvedCountries($confID){


    $host = "sql4.freemysqlhosting.net";
    $dbname="sql457591";
    $user="sql457591";
    $password="uC3!pV9%";
    $port=3306;
    $mysqli = new mysqli($host,$user,$password,$dbname,3306);
    $mysqli->set_charset('utf-8');
    if ($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ') '. $mysqli->connect_error);
    }

    $stmt = $mysqli->prepare("
    SELECT * FROM  conflictCountries INNER JOIN countries ON countries_countryID = countryID WHERE conflicts_conflictID =?
    ");
    $stmt->bind_param('i',$confID);
    $stmt->execute();
    $res = $stmt->get_result();
    $output = array();
    while ($row = $res->fetch_assoc()) {

        $country = new Country();
        $country->countryID = $row["countryID"];
        $country->countryName = $row["countryName"];
        array_push($output,$country);

    };


    $mysqli->close();

    $wep = stripslashes(json_encode($output));
    $wep = str_replace('"{','{',$wep);
    $wep = str_replace('}"','}',$wep);

    return $wep;
}



function outPutJSON($objs){

    $objArray = array();
    $arrLength = count($objs);
    //echo $arrLength.'\n';
    $suchJSON = "";
    echo "[";
    for($i=0;$i < $arrLength;$i++){

        //if(json_encode(get_object_vars($objs[$i]))== null){ echo '';}
        if($i < $arrLength-1) {
            $suchJSON = $suchJSON . json_encode(get_object_vars($objs[$i])) . ",";
        }else{
            $suchJSON = $suchJSON . json_encode(get_object_vars($objs[$i]));
        }


    }
    //trim($suchJSON,',');
    echo $suchJSON."]" ;
    ///echo json_encode($objArray);

}



?>