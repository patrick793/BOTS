/**
	--Minimap function--
	Things to note:
		i. Minimap.js files in Assets - deprecated
		ii. MouseOrbit2 - is attached to the minicamera, hence any camera manipulation is placed here
				Added the ability to toggle drawing min/Max
	Issues:
		0. Currently, the level selection screen does not have an MMCamera object created.
		i. The level string in LoadMiniMapCam() is not the correct one -- called in StartGame.js 
		
*/
class Minimap{


//Fields
var camPos : Rect;  // Rectangle to store user specified position
//var camMinRect : Rect = new Rect(.01,.01,.325,.325); // Default Position for in-game, minimized 
var camMaxRect : Rect = new Rect(.01,.01,.98,.98); //Default Position for in-game, maximized

//Objects
var cameraMM : GameObject;
var myLevel : GameObject;

function Load(){
	Application.LoadLevelAdditive("Level1");	//Load the level ontop of the scene - includes game objects, specifically MMCamera; takes one update cycle
}

function LoadMiniMapCam(camLoc : Rect, autoRot : boolean, minMax : boolean)
{
	cameraMM = GameObject.Find("/MMCamera");	//Attach script to current Unity GameObject
	
	//If minicam is null, 
	if (!cameraMM){
		return;
	}
	
	camPos = camLoc;													//Store position
	cameraMM.camera.rect = camPos;										//Set Camera Position
	cameraMM.GetComponent("MouseOrbit2").ResetCamera();					//Reset the view
	//myRobot = myLevel.GetComponent("CreateLevel").myRobot.gameObject; //##Is this needed?
		
	//Reset position 
	myLevel.GetComponent("CreateLevel").ResetLevel();					//##Also needed?
	
	//Set auto rot
	cameraMM.GetComponent("MouseOrbit2").autoRot = autoRot;

	//Set draw bool for the camera
	cameraMM.GetComponent("MouseOrbit2").drawMinMax = minMax;
}

//Functions 
function Maximize()
{
	cameraMM.camera.rect = camMaxRect;						//Set to default max position
	cameraMM.GetComponent("MouseOrbit2").cam1 = true;		//##Not sure what this line does, but I think int informs Unity that the "main" camera, cam1, is now the minimap cam
	cameraMM.GetComponent("MouseOrbit2").enabled = true;	//Enable camera to be moved
	cameraMM.GetComponent("MouseOrbit2").maximized = true;	//Finally, set MouseOrbit2 to maximize the screen
}

function Minimize()
{
	cameraMM.camera.rect = camPos;							//Set to specified min position
	cameraMM.GetComponent("MouseOrbit2").cam1 = true;
	cameraMM.GetComponent("MouseOrbit2").ResetCamera();
	cameraMM.GetComponent("MouseOrbit2").enabled = true;
	cameraMM.GetComponent("MouseOrbit2").maximized = false;
}

}