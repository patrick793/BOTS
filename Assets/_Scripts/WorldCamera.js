#pragma strict

//Camera position variables
static var distance : float;
static var targDistance : float; 
static var angleX : float;
static var angleY : float;
static var targAngleX : float;
static var targAngleY : float;
static var centerX : float;
static var centerY : float;
static var centerZ : float;

//Movement settings
var mouseSensitivity : float = 2;
var scrollSensitivity : float = 1;
var minRotate : float;
var maxRotate : float;
var moveDrag : float = 5;
static var zoomMin : float = 4;
static var zoomMax : float = 24;

//Editor mode
public enum Mode {GAME,LEVEL_EDITOR,PATH_DRAWER}
var mode : Mode = Mode.GAME;


function Start () {

	//Set the static starting values
	distance = 12;
	targDistance = 12;
	angleX = -45;
	angleY = 315;
	
	targAngleX = angleX;
	targAngleY = angleY;

}

function Update () {

	//Position of the camera based on the position of bots
	if( mode != mode.PATH_DRAWER && WorldManager.botsList.Count > 0)
	{
		// && mode == Mode.GAME ){
		var newPos : Vector3 = new Vector3(0,0,0);
		for( bot in WorldManager.botsList ){
			newPos.x += bot.obj.transform.position.x;
			newPos.y += bot.obj.transform.position.y;
			newPos.z += bot.obj.transform.position.z;
		}
		newPos.x = newPos.x / WorldManager.botsList.Count;
		newPos.y = newPos.y / WorldManager.botsList.Count;
		newPos.z = newPos.z / WorldManager.botsList.Count;
		centerX += (newPos.x-centerX) / moveDrag;
		centerY += (newPos.y-centerY) / moveDrag;
		centerZ += (newPos.z-centerZ) / moveDrag;
	}
		

	//Mouse rotation of the camera
	if( Input.GetButton( "Fire2" ) ){
		angleX += Input.GetAxis( "Mouse Y" ) * mouseSensitivity;
		angleY += Input.GetAxis( "Mouse X" ) * mouseSensitivity;
		targAngleX = angleX;
		targAngleY = angleY;
	}

	//Zooming the camera
	if( GUIManager.mouseOnCamera || (mode == Mode.LEVEL_EDITOR && Camera.main.pixelRect.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y))) ){
		targDistance -= Input.GetAxis( "Mouse ScrollWheel" ) * scrollSensitivity;
	}
	
	//Move zoom towards targets
	if( targDistance > zoomMax )
		targDistance = zoomMax;
	if( targDistance < zoomMin )
		targDistance = zoomMin;
	distance += (targDistance-distance) * 0.1;

	//Move towards targets
	angleX += (targAngleX - angleX) * 0.1;
	angleY += (targAngleY - angleY) * 0.1;

	//Rotation bounds
	if( angleX < minRotate ){
		angleX = minRotate;
		targAngleX = minRotate;
	}
	if( angleX > maxRotate ){
		angleX = maxRotate;
		targAngleX = maxRotate;
	}
	while( angleY > 360 && targAngleY > 360 ){
		angleY -= 360;
		targAngleY -= 360;
	}
	while( angleY < 0 && targAngleY < 0 ){
		angleY += 360;
		targAngleY += 360;
	}

	//Position the camera
	var radX = ((angleX+180) * Mathf.PI) / 180;
	var radY = ((angleY+180) * Mathf.PI) / 180;
	gameObject.camera.transform.position.x = centerX + Mathf.Sin(radY) * (0-Mathf.Cos(radX)) * distance;
	gameObject.camera.transform.position.y = centerY + Mathf.Sin(radX) * distance;
	gameObject.camera.transform.position.z = centerZ + Mathf.Cos(radY) * (0-Mathf.Cos(radX)) * distance;
	gameObject.camera.transform.eulerAngles = Vector3( 0-angleX, angleY, 0 );

}

static function curveAngle( currentAngle : float, targetAngle : float, drag : float ) : float{

	currentAngle = currentAngle % 360;
	targetAngle = targetAngle % 360;
	
	if( drag == 0 )
		drag = 1;
		

	if( currentAngle  < 180 ){
		if( targetAngle >= currentAngle + 180 )
			targetAngle -= 360;
	}else{
		if( targetAngle <= currentAngle - 180 )
			targetAngle += 360;
	}
	
	return currentAngle + (targetAngle - currentAngle) * drag;

}











