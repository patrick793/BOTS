
var roboActionArray = Array();
var robotModel: GameObject;
var robotBusy : boolean;
var running : boolean;
var animationTime : float = 0.0f;

var inLevel : CreateLevel;

var facing : int = 0;
var newFacing : int = 0;

var heldObject : GameObject;
var lifting : int = 0;
var jumping : int = 0;
//enum action state instead of weird seperate variables

var boardPosition = new Point(0,0);
var newBoardPosition = new Point(0,0);

var errorText : String = "";
var anim_speed = 1.0;

var lastPath : String = "";

var tempX = boardPosition.X;
var tempZ = boardPosition.Y;

var newSpawnPointX : int;
var newSpawnPointY : int;
var newSpawnPointRotation : int;
var considerObjects = false;
var heldObjectHeavyBox;
var heldObjectPickupBox;


//these four variables are pseudo-reference parameters, since UnityScript does not support them
var heavyBoxesHere = 0;
var heavyBoxesTarget = 0;

var lightBoxTarget = false;
var lightBoxHere = false;

var heavyBoxTarget = false;
var heavyBoxHere = false;

var objects;
var objectsHere;
var pickupBoxesTarget = 0;

var	destinationHeight = 0;
var	offset = 0;
var	myPositionHeight = 0;

var target = new Point(0,0);

function Awake()
{

}

public function GetLastPath() : String
{
	var output = lastPath;
	lastPath = "";
	return output;
}

function Start()
{
	errorText = "";
}

function Update () 
{
	//if I have not found an error
	if (running && errorText == "")
	{
		//if I am not busy, do the next action
		//if I am busy, "animate" until I am not busy
		if(!robotBusy)
		{
			RobotAction();
		}
		else
		{
			Animate();
		}
	}	
}

function OnGUI()
{
   
}		

function MoveForward()
{
	Move(1);
}
function MoveBackward()
{
	Move(-1);
}

//movement forward and backward use the same logic
//1 = forward, -1 is backward
function Move(dir : int)
{
	//if a value not 1 or -1 is passed in, reject it
	if(dir != 1 && dir != -1)
	{
		Debug.Log("error: direction outside of parameters");
		return;
	}
	
	//get a temporary copy of the bobot's board position
	var tempX = boardPosition.X;
	var tempZ = boardPosition.Y;
	
	//facing is independent of the robot
	// 0 = +z, 1 = +x
	switch (facing)
	{
		case 0:
			tempZ+=dir; break;
		case 1:
			tempX+=dir;break;
		case 2:
			tempZ-=dir; break;
		case 3:
			tempX-=dir; break;
		default:
			tempZ+=dir; Debug.Log("error: somehow facing is wrong"); break;
	}
	
	//destination point made from the copy
	target = new Point(tempX, tempZ);
		
	var destHeight = inLevel.GetHeight(target);
	var hereHeight = inLevel.GetHeight(boardPosition);
	
	objects = inLevel.GetObjectsAt(target);
	objectsHere = inLevel.GetObjectsAt(boardPosition);
	//heavyBoxesTarget = 0;
	//heavyBoxesHere = 0;
	
	//check to see if the destination point is proper
	if(!inLevel.IsLegalMove(boardPosition, target))
	{		
		ErrorOut("I can't go there!");
		return;		
	}
	
	CheckObjectsHere();
	CheckObjectsTarget();
	
	
	
	if ((hereHeight + heavyBoxesHere) == destHeight + heavyBoxesTarget && !lightBoxTarget)
	{
		newBoardPosition = target;
	}
	else
	{
		ErrorOut("I can't go there!");
		return;
	}
	
	//set the robot's board position to the destination?
	//newBoardPosition = target;
	
	//set the robot to be busy, so he will animate
	robotBusy = true;
	return;
}

function RotateLeft()
{
	Rotate(-1);
}

function RotateRight()
{
	Rotate(1);
}

//both rotations use the same logic, 
// left = -1, right  = 1
function Rotate(dir : int)
{
	if(dir != 1 && dir != -1)
	{
		Debug.Log("error: direction outside of parameters");
	}
	newFacing = (4 + facing + dir) % 4;	
	if (newFacing < 0 || newFacing > 3)
	{
		Debug.Log(facing + " " + newFacing + " " + dir + "error:somehow facing is wrong");
	}
	
	robotBusy = true;
	return;
}

//jumping is kind of like moving forward
//difference is we check the destination differently 
// and we animate differently
function Jump()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	objects = inLevel.GetObjectsAt(target);
	objectsHere = inLevel.GetObjectsAt(boardPosition);
	heavyBoxesTarget = 0;
	heavyBoxesHere = 0;

	if (!inLevel.InBounds(target))
	{
		ErrorOut("I can't go there!");
		return;
	}
	
	if(heldObject && heldObject.GetComponent("LevelItemData").itemName == "HeavyBox")
	{
		ErrorOut("It's too heavy!");
		return;
	}
	
	if(!inLevel.IsLegalJump(boardPosition, target))
	{
		ErrorOut("I can't go there!");
		return;
	}
	
	var destHeight = inLevel.GetHeight(target);
	var hereHeight = inLevel.GetHeight(boardPosition);
	
//Logic error because the height of the block doesn't actually exist, so it does calculations while ontop of a heavy block as though it's standing on the ground below it.
	CheckObjectsHere();
	CheckObjectsTarget();
	
	hereHeight += heavyBoxesHere;
	destHeight += heavyBoxesTarget;
	
	Debug.Log("here" + hereHeight);
	Debug.Log("dest" + destHeight);
	
	if(hereHeight +1 == destHeight) //robot is going to jump up one block
		newBoardPosition = target;
	else if(hereHeight > destHeight) //robot is going to jump down many blocks
		newBoardPosition = target;
	else
		{
			ErrorOut("I can't go there!");
			return;
		}

	/*if(heldObject)
	{
		if((hereHeight != destHeight && !heldObject.GetComponent("LevelItemData").itemName == "HeavyBox"))
		{
			newBoardPosition = target;
		}
		else if ((!check && !checkHere) || ((hereHeight + 1 != destHeight) && (hereHeight + 1 <= destHeight)))
		{
			ErrorOut("I can't go there!");
			return;
		}
	}
	else if(hereHeight != destHeight)//stopped here
	{
		newBoardPosition = target;
	}*/
	
	//Debug.Log("HeldObject: " + heldObject);
	
	robotBusy = true;
	jumping = 1;
	return;
}

function PickUp()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	heldObjectHeavyBox = null;
	heldObjectPickupBox = null;
	
	Debug.Log("why am I broken");
	Debug.Log(boardPosition.toString());
	Debug.Log(target.toString());
	
	var destHeight = inLevel.GetHeight(target);
	var hereHeight = inLevel.GetHeight(boardPosition);
	var pickupBoxesTarget = 0;
	
	if (!inLevel.IsLegalPickUp(boardPosition, target))
	{
		ErrorOut("I can't reach anything from here!");
		return;
	}	
	objects = inLevel.GetObjectsAt(target);
	objectsHere = inLevel.GetObjectsAt(boardPosition);
	
	CheckObjectsHere();
	CheckObjectsTarget();
	myPositionHeight = hereHeight + heavyBoxesHere;
	
	if(!heldObject && objects && objects != null)
	{
		destinationHeight = 0;
		//offset = 0;
		
		
		if(heavyBoxTarget && lightBoxTarget)
			destinationHeight = destHeight + heavyBoxesTarget;
		else if(heavyBoxTarget)
		{
			offset = 1;
			destinationHeight = destHeight + heavyBoxesTarget - offset;
		}
		else
			destinationHeight = destHeight;
			
		//var myPositionHeight = hereHeight + heavyBoxesHere; something happens that if there are more than 1 heavybox the counter in heavyBoxesHere does not restart
		Debug.Log("Dest Height: " + destinationHeight);
		Debug.Log("Here Height: " + myPositionHeight);
		//Debug.Log("Destination Height:" + destHeight + heavyBoxesTarget);
			
		var highest = -99999;
		//need to make sure we get the TOP item with highest Y coordinate
		
		for (var item in objects)
		{
			if(item.GetComponent("LevelItemData").itemName == "PickUp")
			{
				heldObjectPickupBox = item;
				Debug.Log("Picked up: " + item.GetComponent("LevelItemData").toString());

			}
			if(item.GetComponent("LevelItemData").itemName == "HeavyBox")
			{
				//highest = item.GetComponent("LevelItemData").y;
				if(!heldObjectHeavyBox)
				{
					heldObjectHeavyBox = item;
					Debug.Log("Picked up: " + item.GetComponent("LevelItemData").toString());
				}
			}
		}
			//Debug.Log("destinationheight" + destinationHeight);
			//Debug.Log("mypositionheight" + myPositionHeight);
	
			//Debug.Log("heavy target" + heavyBoxesTarget);
			//Debug.Log("heavy here" + heavyBoxesHere);
		
		if(destinationHeight != myPositionHeight)
		{
			ErrorOut("I can't reach anything from here!");
			return;
		}
		else if(!lightBoxTarget && !heavyBoxTarget)//hereHeight - heavyBoxesHere == destHeight - heavyBoxesTarget + 1 || pickupBoxesTarget != 1
		{
				ErrorOut("I can't reach anything from here!2");
				return;
		}
		else
		{
			if(!lightBoxTarget)
			{
				heldObject = heldObjectHeavyBox;
			}
			else
				heldObject = heldObjectPickupBox;
			
			
			if (heldObject && myPositionHeight == destinationHeight && 
			( heldObject.GetComponent("LevelItemData").itemName == "PickUp" 
			|| heldObject.GetComponent("LevelItemData").itemName == "HeavyBox"))
			{
				Debug.Log("Found an item!");
				
				heldObject.transform.parent = robotModel.transform;
				heldObject.GetComponent("LevelItemData").SetHeld(true);
				
				heldObject.GetComponent("LevelItemData").x = -1;
				heldObject.GetComponent("LevelItemData").z = -1;
				heldObject.GetComponent("LevelItemData").y = -1;
				lifting = 1;
			}
			
			//Debug.Log(item);
			/*if (hereHeight == destHeight && 
			( item.GetComponent("LevelItemData").itemName == "PickUp" 
			|| item.GetComponent("LevelItemData").itemName == "HeavyBox"))
			{
				hereHeight -= 1;
				Debug.Log("Found an item!");
				
				heldObject.transform.parent = robotModel.transform;
				heldObject.GetComponent("LevelItemData").SetHeld(true);
				
				heldObject.GetComponent("LevelItemData").x = -1;
				heldObject.GetComponent("LevelItemData").z = -1;
				heldObject.GetComponent("LevelItemData").y = -1;
				lifting = 1;
			}*/
		}
	}
	else if (heldObject)
	{

	
	if(heavyBoxTarget)
			destinationHeight = destHeight + heavyBoxesTarget;
		else
			destinationHeight = destHeight;
	
	//destinationHeight = destHeight + heavyBoxesTarget;
		//makes sure that object cant be put down a block on top of another one 
		if (lightBoxTarget)
			{
				ErrorOut("I can't put this \ndown there!");
				return;
			}
		
		if (destinationHeight > myPositionHeight)
		{
			ErrorOut("I can't put this \ndown there!");
			return;
		}
		lifting = -1;
		heldObject.GetComponent("LevelItemData").SetHeld(false);
		heldObjectHeavyBox = null;
		heldObjectPickupBox = null;
	}
	else
	{
		ErrorOut("There's nothing there!");
		return;
	}
	
	robotBusy = true;
}



/*function PickUp()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	
	heavyBoxesHere = 0;
	heavyBoxesTarget = 0;
	
	var destHeight = inLevel.GetHeight(target);
	var hereHeight = inLevel.GetHeight(boardPosition);
	pickupBoxesTarget = 0;
	
	if (!inLevel.IsLegalPickUp(boardPosition, target))
	{
		ErrorOut("I can't reach anything from here!");
		return;
	}	
	objects = inLevel.GetObjectsAt(target);
	
	CheckObjectsHere();
	CheckObjectsTarget();
	
	if(!heldObject && objects)
	{
		var destinationHeight = destHeight;
		var myPositionHeight = hereHeight + heavyBoxesHere;
		//Debug.Log("Dest Height: " + destinationHeight);
		//Debug.Log("Here Height: " + myPositionHeight);
		//Debug.Log("Destination Height:" + destHeight + heavyBoxesTarget);
	
		//need to make sure we get the TOP item with highest Y coordinate
		var highest = -99999;
		var highestObject;
		var highestHeavyBox;
		var highestPickupBox;
		
		for (var item in objects)
		{

			//if (item.GetComponent("LevelItemData").y > highest)
			//{
				//highest = item.GetComponent("LevelItemData");
				if(hereHeight == destHeight + heavyBoxesTarget)
				highestObject = item;

				/*if (item.GetComponent("LevelItemData").itemName == "HeavyBox")
				{
					highestHeavyBox = item;
				}
				else if (item.GetComponent("LevelItemData").itemName == "PickUp")
				{
					highestPickupBox = item;
				}*/
			//}
			
			
						
		/*}
		
		if(destinationHeight != myPositionHeight && (pickupBoxesTarget <= 0 || pickupBoxesTarget >1))
		{
			ErrorOut("I can't reach anything from here!1");
			return;
		}
		//else if(highestObject.GetComponent("LevelItemData").itemName == "PickUp" && heavyBoxesTarget > 0 && (hereHeight != highest + heavyBoxesTarget))//highestObject.itemName == "PickUp"
		else if (!heavyBoxTarget && !lightBoxTarget)
		{
			ErrorOut("I can't reach anything from here!2");
			return;
		}
		//else
		//{
			//heldObject = highestObject;
			Debug.Log("Highest Object: " + highestObject);
			Debug.Log("Highest Height: " + highest);
			Debug.Log("HereHeight: " + hereHeight);
			
			if (hereHeight == destHeight && 
			( heldObject.GetComponent("LevelItemData").itemName == "PickUp" 
			|| heldObject.GetComponent("LevelItemData").itemName == "HeavyBox"))
			{
				Debug.Log("Found an item!");
				
				heldObject.transform.parent = robotModel.transform;
				heldObject.GetComponent("LevelItemData").SetHeld(true);
				
				heldObject.GetComponent("LevelItemData").x = -1;
				heldObject.GetComponent("LevelItemData").z = -1;
				heldObject.GetComponent("LevelItemData").y = -1;
				lifting = 1;
			}
			
			//Debug.Log(item);
			/*if (hereHeight == destHeight && 
			( item.GetComponent("LevelItemData").itemName == "PickUp" 
			|| item.GetComponent("LevelItemData").itemName == "HeavyBox"))
			{
				hereHeight -= 1;
				Debug.Log("Found an item!");
				
				heldObject.transform.parent = robotModel.transform;
				heldObject.GetComponent("LevelItemData").SetHeld(true);
				
				heldObject.GetComponent("LevelItemData").x = -1;
				heldObject.GetComponent("LevelItemData").z = -1;
				heldObject.GetComponent("LevelItemData").y = -1;
				lifting = 1;
			}*/
		//}
	/*}
	else if (heldObject)
	{
		//makes sure that object cant be put down a block on top of another one 
		for (var item in objects)
		{
			if (item.GetComponent("LevelItemData").itemName == "PickUp")
			{
				ErrorOut("I can't put this \ndown there!");
				return;
			}
			else if (item.GetComponent("LevelItemData").itemName == "HeavyBox")
			{
				
			}
		}
		lifting = -1;
		heldObject.GetComponent("LevelItemData").SetHeld(false);
	}
	
	robotBusy = true;
}*/

function Activate()
{
	Debug.Log("Not real yet!");
}

function Stop()
{
	running = false;
	robotBusy = false;
}

//executes the next robot action
function RobotAction()
{
	if(roboActionArray.length > 0)
	{
		robotBusy = true;
		RobotActionName = roboActionArray.Pop();
		var logString = "{"+boardPosition.X+","+boardPosition.Y+","+facing+"} - "+ RobotActionName;
		if(RobotActionName != "")
			lastPath += logString + '\n';
		
		switch(RobotActionName)
		{
			case "Forward": MoveForward(); break;
  			case "Backward" : MoveBackward();	break;
  			case "Turn Right" : RotateRight(); break;
  			case "Turn Left" : RotateLeft(); break;
  			case "Jump" : Jump(); break;
  			case "Pick Up/Put Down": PickUp(); break;
  			//case "Set Step": PlaceStep(); break;
  			case "Place Switch": PlaceSwitch(); break;
  			case "Place Box": PlaceBox(); break;
  			case "Set Spawn": SetSpawn(); break;
  			case "Raise Ground": PlaceStep(); break;
  			case "Lower Ground": RemoveStep(); Debug.Log("blam"); break;
            case "HeavyBox": PlaceHeavyBox(); break;
  			case "Activate" : Activate(); break;
  			case "Error" : ErrorOut("WAY too many instructions! Check your loops and recursions..."); break;
			case "" : break;
  			default : Debug.Log("error: illegal action type " + RobotActionName);
		}
	}
	else
	{
		Stop();
	}
}

//Places a switch directly in front of himself
function PlaceSwitch()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	if (!inLevel.InBounds(target))
	{
		ErrorOut("I can't place a switch there!");
		return;
	}
	
	var placement = inLevel.GetHeight(target);
  	var here = inLevel.GetHeight(boardPosition);
  	
  	if (!inLevel.GetObjectsAt(target) && !(placement > here)) {
  	    if (placement == here) {
  	    	placement ++;
  	    } else {
  	    	PlaceStep();
  	    }
  		Debug.Log("Target_X:" + target.GetX() + " Target_Y" + placement + " Target_Z" + target.GetY());
 		inLevel.SpawnSwitch(target.GetX(), target.GetY());
 	} else if (inLevel.GetObjectsAt(target)) {
 		ErrorOut("I can't place a switch there!");
 	}
}

//Places a box directly in front of himself
function PlaceBox()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	if (!inLevel.InBounds(target))
	{
		ErrorOut("I can't place a box there!");
		return;
	}
	
	var placement = inLevel.GetHeight(target);
  	var here = inLevel.GetHeight(boardPosition);
  	
  	if (!inLevel.GetObjectsAt(target) && !(placement > here)) {
  	    if (placement == here) {
  	    	placement ++;
  	    } else {
  	    	PlaceStep();
  	    }
  		Debug.Log("Target_X:" + target.GetX() + " Target_Y" + placement + " Target_Z" + target.GetY());
 		inLevel.SpawnBox(target.GetX(), target.GetY());
 		//it can't be !inLevel.InBounds(target) because it ignores switch
 	} else if (inLevel.GetObjectsAt(target)) {
 		ErrorOut("I can't place a box there!");
 	}
}

//Sets his current location as the spawn point
function SetSpawn()
{
Debug.Log("LEAVE SETSPAWN FUNCTION ALONE WE SLEEPING KAY!");
	tempX = boardPosition.X;
	tempZ = boardPosition.Y;
	
	target = new Point(tempX, tempZ);
  	if(ProgramGUI.setNewSpawnPoint)
  	{
  	Debug.Log("X:" + newSpawnPointX + "\nY:" + newSpawnPointY + "\nRotation:" + newSpawnPointRotation);
	  	//inLevel.SpawnHere(destination.GetX(), destination.GetY(), facing);
	  	inLevel.SpawnHere(newSpawnPointX, newSpawnPointY, newSpawnPointRotation);
	  	
	  	if (!inLevel.GetObjectsAt(target)) {
	  		Debug.Log("Target_X:" + target.GetX() + " Target_Z" + target.GetY());
	 		
	 	} else if (inLevel.GetObjectsAt(target)) {
	 		ErrorOut("I can't place my spawn here!");
	 	}
	 	ProgramGUI.setNewSpawnPoint = false;
 	}
 	else
 	{
 	Debug.Log("X:" + target.GetX() + "\nY:" + target.GetX() + "\nRotation:" + facing);
	 	newSpawnPointX = target.GetX();
	 	newSpawnPointY = target.GetY();
	 	newSpawnPointRotation = facing;
 	}
}

//Places a step directly in front of himself
function PlaceStep()
{
  	Debug.Log("place step");
  	var here = inLevel.GetHeight(boardPosition);
  	
  	if (!inLevel.GetObjectsAt(boardPosition)) {
 		inLevel.PlaceStepAt(boardPosition.X, here + 1, boardPosition.Y);
 		robotModel.transform.position = inLevel.ToSpaceCoordinates(boardPosition.X, here+1, boardPosition.Y) + new Vector3(0, GLOBALS.HEIGHT_FACTOR_ROBOT,0); 	
 		robotBusy = true;	
 	} else {
 		ErrorOut("I can't place a box there!");
 	}
}

function RemoveStep()
{
  	var here = inLevel.GetHeight(boardPosition);
  	
  	if (!inLevel.GetObjectsAt(boardPosition) && inLevel.GetHeight(boardPosition)>0) {
  		Debug.Log("Bam");
 		inLevel.DecendAt(boardPosition.X, boardPosition.Y);
 		robotModel.transform.position = inLevel.ToSpaceCoordinates(boardPosition.X, here-1, boardPosition.Y) + new Vector3(0, GLOBALS.HEIGHT_FACTOR_ROBOT,0); 	
 		robotBusy = true;	
 	} else {
 		ErrorOut("I can't remove a box there!");
 	}
}

function PlaceHeavyBox()
{
	target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
	if (!inLevel.InBounds(target))
	{
		ErrorOut("I can't place a box there!");
		return;
	}
	
	var placement = inLevel.GetHeight(target);
  	var here = inLevel.GetHeight(boardPosition);
  	
  	if (!inLevel.GetObjectsAt(target) && !(placement > here)) {
  	    if (placement == here) {
  	    	placement ++;
  	    } else {
  	    	PlaceStep();
  	    }
  	    
  		Debug.Log("Target_X:" + target.GetX() + " Target_Y" + placement + " Target_Z" + target.GetY());
  		
 		inLevel.SpawnHeavyBox(target.GetX(), target.GetY());
 		//it can't be !inLevel.InBounds(target) because it ignores switch
 	}
 	 else if (inLevel.GetObjectsAt(target)) {
 		ErrorOut("I can't place a box there!");
 	}
}

function ResetRobot()
{
	running = false;
	robotBusy = false;
	errorText = "";
	
	objectsHere = null;
	objects = null;
	
	if(heldObject)
	{
		//heldObject.GetComponent("LevelItemData").ResetPosition();
		//heldObject.transform.parent = null;
		//v2 = inLevel.ToSpaceCoordinates(heldObject.GetComponent("LevelItemData").x, heldObject.GetComponent("LevelItemData").z, false);
		
		//v2 = inLevel.ToSpaceCoordinates(Point(heldObject.GetComponent("LevelItemData").x,heldObject.GetComponent("LevelItemData").z), true);
		//heldObject.transform.position = new Vector3(v2.x, v2.y + heldObject.GetComponent("LevelItemData").offset, v2.z);
		heldObject = null;
	}
	if(robotModel)
	{
		boardPosition = inLevel.startLocation;
		newBoardPosition = inLevel.startLocation;

		robotModel.transform.position = inLevel.GetStartLocationSpace();
		//robotModel.animation.Stop();
		//robotModel.animation.Play("idle");
		SetFacing(inLevel.startRotation);
		facing = inLevel.startRotation;
		newFacing = inLevel.startRotation;
	}
}

function CheckObjectsHere()
{

	heavyBoxHere = false;
	heavyBoxesHere = 0;
	
	for (var item in objectsHere)
	{
			
		if (item.GetComponent("LevelItemData").itemName == "HeavyBox")
		{
			heavyBoxHere = true;
			heavyBoxesHere++;
			Debug.Log("heavy here" + heavyBoxesHere);
		}
	}
}

function CheckObjectsTarget()
{
	heavyBoxTarget = false;
	pickupBoxesTarget = 0;
	lightBoxTarget = false;
	heavyBoxesTarget = 0;
	
	for (var item in objects)
	{
		var info = item.GetComponent("LevelItemData");
//		Debug.Log("INFO: " + info.toString());
		if (info.itemName == "HeavyBox")
		{
			heavyBoxTarget = true;
			Debug.Log("heavy box");
			heavyBoxesTarget++;
		}
		else if (info.itemName == "PickUp")
		{
			lightBoxTarget = true;
			Debug.Log("light box");
			pickupBoxesTarget++;
		}
	}
	
	
}

function Animate()
{
	animationTime += Time.deltaTime;
	var v1; //startPoint
	var v2; //endPoint
	
	//replace with switch on robot motion state

	if (boardPosition != newBoardPosition && jumping == 0)
	{
		StartAnim("walking");
		v1 = inLevel.ToSpaceCoordinates(boardPosition, true);
		v2 = inLevel.ToSpaceCoordinates(newBoardPosition, true);
		
		robotModel.transform.position = new Vector3(
		Mathf.Lerp(v1.x, v2.x, animationTime/anim_speed),
		Mathf.Lerp(v1.y + GLOBALS.HEIGHT_FACTOR_ROBOT, v2.y  + GLOBALS.HEIGHT_FACTOR_ROBOT, animationTime/anim_speed),
		Mathf.Lerp(v1.z, v2.z, animationTime/anim_speed));
	}
	else if (boardPosition != newBoardPosition)
	{
		//actual jump animation is glitched. We need to redo it, but since we're redoing the model we'll just do it then.		

		v2 = inLevel.ToSpaceCoordinates(newBoardPosition, true);
		v1 = inLevel.ToSpaceCoordinates(boardPosition, true);
		
		robotModel.transform.position = new Vector3(
		Mathf.Lerp(v1.x, v2.x, animationTime/anim_speed),
		Mathf.Lerp(v1.y + GLOBALS.HEIGHT_FACTOR_ROBOT, v2.y  + GLOBALS.HEIGHT_FACTOR_ROBOT, animationTime/anim_speed),
		Mathf.Lerp(v1.z, v2.z, animationTime/anim_speed));
	}
	else if (newFacing != facing)
	{
		StartAnim("walking");
		v1 = robotModel.transform.position + FacingToDirection(facing);
		v2 = robotModel.transform.position + FacingToDirection(newFacing);
		robotModel.transform.LookAt(new Vector3(
		Mathf.Lerp(v1.x, v2.x, animationTime/anim_speed),
		Mathf.Lerp(v1.y, v2.y, animationTime/anim_speed),
		Mathf.Lerp(v1.z, v2.z, animationTime/anim_speed)));
		
	}
	else if (lifting != 0)
	{
		if (lifting == 1)
		{
			v1 = inLevel.ToSpaceCoordinates(Point.Add(boardPosition, FacingToDirectionPoint(facing)), true);
			v2 = inLevel.ToSpaceCoordinates(boardPosition,true);
			v2.y += GLOBALS.HEIGHT_FACTOR_ROBOT; //?
			
			heldObject.transform.position = new Vector3(
			Mathf.Lerp(v1.x, v2.x, animationTime/anim_speed),
			Mathf.Lerp(v1.y + heldObject.GetComponent("LevelItemData").offset, v2.y  + heldObject.GetComponent("LevelItemData").offset, animationTime/anim_speed),
			Mathf.Lerp(v1.z, v2.z, animationTime/anim_speed));
		}
		else if (lifting == -1)
		{
			v2 = inLevel.ToSpaceCoordinates(Point.Add(boardPosition, FacingToDirectionPoint(facing)), true);
			
			
			v1 = inLevel.ToSpaceCoordinates(boardPosition, true);
			v1.y += GLOBALS.HEIGHT_FACTOR_ROBOT;
			heldObject.transform.position = new Vector3(
			Mathf.Lerp(v1.x, v2.x, animationTime/anim_speed),
			Mathf.Lerp(v1.y + heldObject.GetComponent("LevelItemData").offset, v2.y + heldObject.GetComponent("LevelItemData").offset , animationTime/anim_speed),
			Mathf.Lerp(v1.z, v2.z, animationTime/anim_speed));
		}
	}
	
	if (animationTime >= anim_speed)
	{
		if (lifting == -1)
		{
			heldObject.transform.parent = null;
			
			target = Point.Add(boardPosition, FacingToDirectionPoint(facing));
			objects = inLevel.GetObjectsAt(target);
			CheckObjectsTarget();
			heldObject.GetComponent("LevelItemData").x = target.X;
			heldObject.GetComponent("LevelItemData").z = target.Y;
			heldObject.GetComponent("LevelItemData").y = inLevel.GetHeight(target) + heavyBoxesTarget;
			heldObject = null;
		}
			
		lifting = 0;
		jumping = 0;
		animationTime = 0.0f;
		robotBusy = false;
		boardPosition = newBoardPosition;
		SetFacing(newFacing);
		considerObjects = false;
		//robotModel.animation.Stop();
	}
}

function Run()
{
//		Debug.Log("Robo Run!");
	running = true;
	if(ProgramGUI.directions != null)
	{
		roboActionArray = ProgramGUI.directions.Split("\n"[0]);
		roboActionArray.Reverse();
	}

	robotBusy = false;
}

function SetFacing(newVal : int)
{
	if (newVal < 0 || newVal > 3)
	{
		Debug.Log("error: invalid value for facing");
		return;
	}
	facing = newVal;
	robotModel.transform.LookAt(robotModel.transform.position + FacingToDirection(newVal));
}

function FacingToDirection(newVal : int) : Vector3
{
	var temp = FacingToDirectionPoint(newVal);
	return new Vector3(temp.X, 0, temp.Y);
}

function FacingToDirectionPoint(newVal : int) : Point
{
	var temp : Point;
	switch (newVal)
	{
		case 0:
			temp = new Point(0,1);
			break;
		case 1:
			temp = new Point(1,0);
			break;
		case 2:
			temp = new Point(0,-1);
			break;
		case 3:
			temp = new Point(-1,0);
			break;
		default:
			Debug.Log("error: somehow facing is wrong");
			temp = new Point(0,1); 
			break;
	}
	return temp;
}

function GetFacing() : int
{
	return facing;
}

function StartAnim(newVal : String)
{
	//if(!robotModel.animation.IsPlaying(newVal))
			//robotModel.animation.Play(newVal);
}

function ErrorOut(newVal : String)
{
	errorText = newVal;
	Stop();
}

function GetErrorText() : String
{
	return errorText;
}

function HasError() : boolean
{
	return !(errorText == "");
}

function ResetError()
{
	errorText = "";
}
