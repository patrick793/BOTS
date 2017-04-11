#pragma strict

public static var facing : int;

/*n indicates the direction of the movement to spin bot and 
guide the arrowCrumbs
n = 0 indicates movement from west to east (z axe growing)
n = 1 indicates movement from south to north (x axe decreasing)
n = 2 indicates movement from east to west (z axe decreasing)
n = 3 indicates movement from north to south (x axe growing)
*/

public static var n : int;

private static var instance : BotCompass;
static function getInstance() : BotCompass{

	if( instance == null ){
		instance = GameObject.FindObjectOfType(BotCompass);
	}
	return instance;
}

/*
function to rotate bot and indicate direction of movement for breadCrumb arrow and offset
param 3: 0 for moving in x, 1 for moving in z
*/
function orientation(startPos : Vector3, endPos : Vector3, direction : int){
	if (direction==0){
		if (endPos.x - startPos.x > 0){
			n=3;
			this.transform.rotation.y = 90;
		}
		if (startPos.x - endPos.x > 0) {
			n=1;
			this.transform.rotation.y = 270;
		}
    } else if (direction==1){
        if (endPos.z - startPos.z > 0) {
        	n=0;
        	this.transform.rotation.y = 0;
        }
        if (startPos.z - endPos.z > 0) {
        	n=2;
        	this.transform.rotation.y = 180;
        }
    }

}

function getMovement(){
	return this.n;
}