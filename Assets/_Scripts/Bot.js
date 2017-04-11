#pragma strict
import System.Collections.Generic;

//The program to run
@HideInInspector public var program : List.<CommandElement>;      //This is the code specific for this bot
@HideInInspector public var pointer : int = 0;                    //Pointer to the line of code currently being executed at any time
@HideInInspector public var mainPointer : int = -1;                //Pointer to the last executed line in the bot's MAIN program
@HideInInspector public var subProgram : List.<CommandElement>;   //This is the actual list of commands that's getting run at any given time (useful for functions)
@HideInInspector public var functionStack : List.<FunctionReference>;
@HideInInspector public var currentCmd : CommandElement;
private var flag : boolean;
private var numberOfLoops : int = 0;

//Positions within blocks
private var xBlockPos : int = 0;
private var yBlockPos : int = 0;
private var zBlockPos : int = 0;

//Animation
public var animating : boolean = false;
private var timer : WorldTimer;
public var limbHead : GameObject;
public var limbBody : GameObject;
public var limbArmR : GameObject;
public var limbArmL : GameObject;

//Movable carrying
@HideInInspector public var carryObj : GameObject = null;
private var progCarry : boolean = false;

//GUI
private var styles : GUIManager;
public var color : Color;
public var botName : String;
private var botPointerAngle : float;

//Error
private var nextBlockPos : Vector3 = Vector3(-1,-1,-1);
private var worldCam : Camera;
private var errorFlag : boolean;
private var errorString : String;

//Face Materials
var faceGood : Material;
var faceError : Material;

//Expressions
private var raisingFlag : boolean;
private var flagRat : float;
private var raisingExc : boolean;
private var excRat : float;

//Is this the function bot
public var isFunctionBot : boolean = false;

//
private var lastIndexChanged : int = 100;

private var path : String = "";


/**
* LIST OF BOT ACTION COMMANDS
*    MoveForward
*    MoveBackward
*    TurnRight
*    TurnLeft
*    ClimbUp
*    ClimbDown
*	 PickUp
*    PutDown
*    Wait
*/

function GetLastIndexChanged()
{
	return lastIndexChanged;
}

function FastMode()
{
	return pointer < lastIndexChanged;
}

function ChangeIndex(index_c : int)
{
	if(index_c < lastIndexChanged)
		lastIndexChanged = index_c;
}

function ResetIndex()
{
	lastIndexChanged = 100;
}

function AddToPath(line : String){
	//Debug.Log("path line: " + line);
	path += '\n' + line;
}

function GetPath()
{
	var my_string = botName + " PATH:" + path;
	path = "";
	return my_string;
}

function Awake () {

	//Find the timer to use
	timer = WorldTimer.GetInstance();
	
}

function Start () {
	GUI.depth = 0;

	//Find the world camera
	try{
		worldCam = GameObject.Find("WorldCamera").camera;
	}catch(error){
		Debug.LogError("Camera called 'WorldCamera' must exist");
	}
	
	//Find the GUI
	styles = GUIManager.Get();
	
	//Setup subprogram stack functionality
	subProgram = program;
	functionStack = new List.<FunctionReference>();
	
}

//Function for testing if the bot has been clicked on
static function BotClicked() : GameObject{

	if ( Input.GetMouseButtonDown(0)){
		var hit : RaycastHit;
		var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		if (Physics.Raycast (ray, hit, 100.0)){
			if( hit.collider.GetComponent(Bot) != null ){
				return hit.collider.transform.gameObject;
			}
		}
	}
	return null;
	
}
static function BotAt( pos : Vector2 ) : GameObject{

	var hit : RaycastHit;
	var ray : Ray = Camera.main.ScreenPointToRay (Vector2(pos.x,Screen.height-pos.y));
	if (Physics.Raycast (ray, hit, 100.0)){
		if( hit.collider.GetComponent(Bot) != null ){
			return hit.collider.transform.gameObject;
		}
	}
	return null;
	
}

//something?
function ProgramSlideUpToIndex( index : int )
{
	for(var i = index + 1; i < program.Count; i++)
	{
		program[i].slideUp();
	}
}

//something else?
function ProgramSlideDownFromIndex( index : int )
{
	for(var i = index + 1; i < program.Count; i++)
	{
		program[i].slideDown();
	}
}

//Function for counting the number of written commands
static function GetCommandCount() : int{
	
	var count = 0;
	
	for( var b in WorldManager.botsList )
		for( var c : CommandElement in b.obj.GetComponent(Bot).program )
			if( c.stackOp != StackOp.PULL )
				count++;
	
	for( var i in GUIManager.Get().functionCmd )
		for( var j in i.funcProgram )
			if( j.stackOp != StackOp.PULL )
				count++;
	
	
	return count;
}

//GUI Stuff
function OnGUI () {

	//Bot position on screen
	var manager = GUIManager.Get();
	var screenPos = worldCam.WorldToScreenPoint( Vector3(limbHead.transform.position.x,limbHead.transform.position.y+0.2,limbHead.transform.position.z) );
	screenPos.y = Screen.height - screenPos.y;
	
	//Make sure the GUI isn't locked
	if( !manager.muteGUI && !isFunctionBot ){
	
		//Draw the bot pointer
		if( manager.botVar == this ){
//			Debug.Log(gameObject.name);
			if( manager.canEditCode ){
				GUI.color = color;
				botPointerAngle += 2.5*Time.deltaTime;
			}else{
				GUI.color = Color.white;
				botPointerAngle = 0;
			}
			GUI.DrawTexture( Rect( screenPos.x-24, screenPos.y-30-6*Mathf.Sin(botPointerAngle), 48, 24 ), manager.botPointer, ScaleMode.ScaleToFit );
			GUI.color = Color.white;
		}

		//Draw error message if necessary
		if( errorFlag && limbHead.renderer.isVisible ){
			GUI.Box( Rect( screenPos.x-160, screenPos.y-80, 320, 80 ), errorString, styles.botErrorStyle );
		}
		
		//Draw flag if necessary
		if( raisingFlag ){
			GUILayout.BeginArea(Rect(screenPos.x-48,screenPos.y-96,96,96));
			GUI.color = color;
			GUI.DrawTexture( Rect(0,96-96*flagRat,96,96), manager.botFlag );
			GUILayout.EndArea();
			GUI.color = Color.white;
		}
		
		//Draw flag if necessary
		if( raisingExc ){
			GUILayout.BeginArea(Rect(screenPos.x-48,screenPos.y-96,96,96));
			GUI.color = color;
			GUI.color.a = excRat;
			GUI.DrawTexture( Rect(0,0,96,96), manager.botExclaimation );
			GUILayout.EndArea();
			GUI.color = Color.white;
		}
		
	}
	

}

//Getter function for animation
function IsAnimating() : boolean{
	return animating;
}
function HasError() : boolean{
	return errorFlag;
}

//Getter function for next block position
function getNextBlockPos() : Vector3{
	return nextBlockPos;
}

//Function for checking if the flag has been raised
function flagRaised(){
	return flag;
}

//Function for running the next command
function RunCommand () {

	//Debug.Log("Run a command!");
	
	if( !animating )
		if( subProgram && pointer < subProgram.Count ){
		
			//main pointer position
			if( functionStack.Count == 0 )
				mainPointer = pointer;
			currentCmd = subProgram[pointer];
		
			//Get new block position
			animating = true;
			xBlockPos = Mathf.Floor(transform.position.x + (WorldManager.worldMaxX>>1));
			yBlockPos = Mathf.Floor(transform.position.y + (WorldManager.worldMaxY>>1));
			zBlockPos = Mathf.Floor(transform.position.z + (WorldManager.worldMaxX>>1));
			nextBlockPos = Vector3(xBlockPos,yBlockPos,zBlockPos);
			
			//Check if the parameters are filled
			if( subProgram[pointer].paramSlot.Length > 0 ){
				var validParams = true;
				for( var paramI : int = 0; paramI < subProgram[pointer].paramSlot.Length; paramI++ )
					if( subProgram[pointer].paramSlot[paramI].type != ParameterType.VALUE )
						if( subProgram[pointer].paramList[paramI] == null ){
							validParams = false;
						}else if( subProgram[pointer].paramList[paramI].name == null ){
							validParams = false;
						}
				if( !validParams ){
					ThrowError( "This command does not have all of its parameters filled! Drag parameters or variables from the toolbox to fill it in!" );
					return;
				}
			}
			
			
			//Run the function
			try{
				AddToPath( subProgram[pointer].functionName );
				//Debug.Log(subProgram.Count);
				gameObject.SendMessage( subProgram[pointer].functionName );		
		
				//Update the position of the block you're carrying
				if( carryObj != null && !nextBlockPos.Equals(Vector3(xBlockPos,yBlockPos,zBlockPos)) ){
					carryObj.transform.position.y -= 10000;
					WorldManager.UpdatePosition(xBlockPos,yBlockPos+1,zBlockPos);
					carryObj.transform.position.y += 10000;
				}
				
			}catch(error){
				Debug.Log(error);
				Debug.Log("Invalid Bot Command: "+subProgram[pointer].functionName);
				UpdateTimer();
			}
			
			
		}else{
			
			//If there's something on the function stack, jump to that point
			if( functionStack.Count > 0 ){
				subProgram = functionStack[0].program;
				pointer = functionStack[0].pointer + 1;
				functionStack.RemoveAt(0);
				RunCommand();
				return;
			}
			else
			{
				if(WorldManager.dm.gameplayMode == "progEdit")
				{
					//if i'm done put a switch where i'm standing
					if(!WorldManager.PlaceSwitch(xBlockPos, yBlockPos, zBlockPos))
					{
						ThrowError("I can't end my program here, I'd cover up my own path!");
					}
					
					//then try and put a switch wherever a box is?
					var mov : MovableObject;
					var placements = new List.<Vector3>();
					for( obj in WorldManager.movableList )
					{
						mov = obj.obj.GetComponent("MovableObject");
						var pos : Vector3 = WorldManager.WorldToBlocks(obj.obj.transform.position);
						if( mov.canBeLifted ){
							placements.Add(pos);
						}
					}
					
					for (pos in placements)
					{
						if(!WorldManager.PlaceSwitch(pos.x, pos.y, pos.z))
						{
							ThrowError("I can't end my program here, I'd cover up my own path!");
						}
					}
					
					timer.Save();
				}
				return;
			}
			
		}

}

//Function for upadating the timer
private function UpdateTimer(){

	//Block carrying stuff
	xBlockPos = Mathf.Floor(transform.position.x + (WorldManager.worldMaxX>>1));
	yBlockPos = Mathf.Floor(transform.position.y + (WorldManager.worldMaxY>>1));
	zBlockPos = Mathf.Floor(transform.position.z + (WorldManager.worldMaxX>>1));
	WorldManager.UpdatePosition(xBlockPos,yBlockPos+1,zBlockPos);
	transform.parent = null;
	
	//If you're riding a block, make it your parent
	if( !WorldManager.block[xBlockPos,yBlockPos-1,zBlockPos].hasBlock )
		for( obj in WorldManager.movableList )
			if( obj.obj.GetComponent(MovableObject).canBeWalkedOn ){
				var objPos : Vector3= WorldManager.WorldToBlocks( obj.obj.transform.position );
				if( objPos.Equals(Vector3(xBlockPos,yBlockPos-1,zBlockPos)) )
					transform.parent = obj.obj.transform;
			}
	
	//Check the win condition
	//I now only want to do this when the robot is DONE.
	Debug.Log("Check Win Condition:");
	
	//old code to only check completion at END of code
	//if(!animating && subProgram && subProgram == program)
	if(WorldManager.dm.gameplayMode != "progEdit")
	{
		Debug.Log("Checking...");
		var hasWon : boolean = true;
		for( movable in WorldManager.movableList ){
			if( !movable.obj.GetComponent(MovableObject).CheckWinCondition() )
				hasWon = false;
		}
		if( hasWon ){
			timer.playing = false;
			animating = false;
			pointer += 1;
			timer.Win();
			return;
		}
	}

		
					
	//Animation timing
	animating = false;
	pointer += 1;
	if( timer.playing )
		timer.BotReady();
}

//Function for throwing errors
private function ThrowError( errorText : String ){
	timer.Pause();
	errorFlag = true;
	animating = false;
	errorString = errorText;
	var tempMat = limbHead.renderer.materials;
	tempMat[2] = faceError;
	limbHead.renderer.materials = tempMat;
}	



//Function for standard checks/algorithms associated with bot movement
//Returns true if there is an error
function standardChecks() : boolean{

	//Check for bots
	var colDetect = false;
	for( otherBot in WorldManager.botsList )
		if( otherBot.obj != gameObject )
			if( otherBot.obj.GetComponent(Bot).nextBlockPos == nextBlockPos ){
				ThrowError( "I can't move, there's another Bot there!" );
				colDetect = true;
			}
			
	//Make sure the floor doesn't move
	if( !WorldManager.block[ nextBlockPos.x, nextBlockPos.y-1, nextBlockPos.z ] || !WorldManager.block[ nextBlockPos.x, nextBlockPos.y-1, nextBlockPos.z ].canBeWalkedOn ){
		ThrowError( "I can't move, there's nothing to stand on!" );
		colDetect = true;
	}
	
	return colDetect;
}

//Function for a bot to lower his arms if his block gets taken
function LowerArms(){

	var time : float = 0;
	var speed : float = 0;
	while( time < 0.4 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		limbArmR.transform.localPosition = Vector3.MoveTowards( limbArmR.transform.localPosition, Vector3(0.2,0,0), 2*speed );
		limbArmR.transform.localEulerAngles = Vector3.MoveTowards( limbArmR.transform.localEulerAngles, Vector3(0,0,0), 600*speed );
		limbArmL.transform.localPosition = Vector3.MoveTowards( limbArmL.transform.localPosition, Vector3(-0.2,0,0), 2*speed );
		limbArmL.transform.localEulerAngles = Vector3.MoveTowards( limbArmL.transform.localEulerAngles, Vector3(0,0,0), 600*speed );
		time += speed;
		yield;
	}

}









function GenericElement()
{
	Debug.Log("You're using test code! A CodeElement or CodeElementSource was not properly initialized.");
}

//Function to check the truth of a parameter equation
function CheckEquation( element : CommandElement ) : boolean{
	var val1 = element.getParamValue(0);
	var cond = element.getParamName(1);
	var val2 = element.getParamValue(2);
	switch( cond ){
		case "=":
			return (val1 == val2);
		case ">":
			return (val1 > val2);
		case "<":
			return (val1 < val2);
		case ">=":
			return (val1 >= val2);
		case "<=":
			return (val1 <= val2);
		case "!=":
			return (val1 != val2);
	}
	return false;
}


//Function to run a function
function RunFunction(){
	if( subProgram[pointer].isFunction ){
		if( functionStack.Count > 20 )
		{
			ThrowError( "I'm running too many functions... I don't think I'll ever finish this program!" );
			return;
		}
		functionStack.Insert( 0, new FunctionReference(subProgram,pointer) );
		subProgram = subProgram[pointer].funcProgram;
		//Debug.Log(subProgram.Count);
		pointer = -1;
	}
	pointer += 1;
	animating = false;
	RunCommand();
}

class FunctionReference{
	var program : List.<CommandElement>;
	var pointer : int;
	function FunctionReference( program : List.<CommandElement>, pointer : int ){
		this.program = program;
		this.pointer = pointer;
	}
}


//If statement handling functions
function If(){
	if( CheckEquation( subProgram[pointer] ) ){
		pointer += 1;
	}else{
		pointer = subProgram.IndexOf( subProgram[pointer].partner );
	}
	animating = false;
	RunCommand();
}
function EndIf(){
	pointer += 1;
	animating = false;
	RunCommand();
}


//While statement handling functions
function While(){
	if( CheckEquation( subProgram[pointer] ) ){
		numberOfLoops++;
		pointer += 1;
		if( numberOfLoops > 20 )
			ThrowError( "I've looped 20 times... I don't think I'll ever finish this program!" );
	}else{
		pointer = subProgram.IndexOf( subProgram[pointer].partner ) + 1;
		numberOfLoops = 0;
	}
	animating = false;
	RunCommand();
}
function EndWhile(){
	pointer = subProgram.IndexOf( subProgram[pointer].partner );
	animating = false;
	RunCommand();
}

//Variable manipulation handling functions
function SetVariable(){
	var time : float = 0;
	while( time < 1 ){
		time += 2 * Time.deltaTime;
		yield;
	}
	var varName : String = subProgram[pointer].getParamName(0);
	var val : int = subProgram[pointer].getParamValue(1);
	var v : Variables = Variables.Get();
	v.setVal( varName, val );
	UpdateTimer();
}
function IncrementVariable(){
	var time : float = 0;
	while( time < 1 ){
		time += 2 * Time.deltaTime;
		yield;
	}
	var v : Variables = Variables.Get();
	var varName : String = subProgram[pointer].getParamName(0);
	var val : int = v.getVal( varName );
	val += subProgram[pointer].getParamValue(1);
	v.setVal( varName, val );
	UpdateTimer();
}

//Flag handling functions
function WaitForFlag(){

	var waitBot : Bot = subProgram[pointer].getParamBot(0);
	
	if( waitBot == null ){
		ThrowError("I can't wait for a flag from that bot, it isn't here!");
		return;
	}
	
	if( waitBot.color == this.color ){
		ThrowError("I cant wait for a flag from myself! I'll be waiting forever!");
		return;
	}
	

	var time : float = 0;
	var flagSeen : boolean = false;
	while( time < 1 ){
		time += 2 * Time.deltaTime;
		if( waitBot.flagRaised() ){
			flagSeen = true;
			break;
		}
		yield;
	}
	
	if( flagSeen ){
		pointer += 1;
		animating = false;
		RaiseExclaimation();
		RunCommand();
	}else{
		pointer -= 1;
		UpdateTimer();
	}
}
function RaiseFlag(){
	raisingFlag = true;
	flagRat = 0;

	var time : float = 0;
	while( time < 0.5 ){
		time += 2 * Time.deltaTime;
		flagRat = Mathf.MoveTowards(flagRat,1,2*Time.deltaTime);
		yield;
	}
	flag = true;
	while( time < 1 ){
		time += 2 * Time.deltaTime;
		yield;
	}
	while( time < 1.5 ){
		time += 2 * Time.deltaTime;
		flagRat = Mathf.MoveTowards(flagRat,0,2*Time.deltaTime);
		yield;
	}
	flag = false;
	
	raisingFlag = false;
	flagRat = 0;
	UpdateTimer();

}
function RaiseExclaimation(){
	raisingExc = true;
	var time : float = 0;
	while( time < 0.5 ){
		time += 2 * Time.deltaTime;
		excRat = Mathf.MoveTowards(excRat,1,6*Time.deltaTime);
		yield;
	}
	while( time < 1 ){
		time += 2 * Time.deltaTime;
		excRat = Mathf.MoveTowards(excRat,0,6*Time.deltaTime);
		yield;
	}
	raisingExc = false;
}

function GetAngle() : int{
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	return angle;
}

function SetAngle(rot : int)
{
	transform.eulerAngles.y = 90 * rot;
}

function MoveForward () {
	
	Debug.Log("Moving Forward");
	
	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var xMove : int = 0;
	var zMove : int = 0;
	
	//Figure out how the bot will move
	switch( angle ){
		case 0:
			zMove = 1;
		break;
		case 1:
			xMove = 1;
		break;
		case 2:
			zMove = -1;
		break;
		case 3:
			xMove = -1;
		break;
	}
	nextBlockPos = Vector3( xBlockPos + xMove, yBlockPos, zBlockPos + zMove );
	
	//Out-of-bounds error detection
	if( (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "I can't move forward! I'll fall off the edge!" );
		return;
	}
	
	//Collision error detection
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos + zMove ].hasCollision ){
		ThrowError( "I can't move forward! There's something in front of me!" );
		return;
	}
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos + zMove ].hasCollision && carryObj != null ){
		ThrowError( "I can't move forward! There's something in front of me!" );
		return;
	}
	
	//Pit detection
	if( !WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].hasCollision ){
		if(WorldManager.dm.gameplayMode == "progEdit")
		{
			if(!WorldManager.PlaceBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove))
			{
				if(WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].hasBeenWalkedOn
				|| WorldManager.block[ xBlockPos + xMove, yBlockPos - 2, zBlockPos + zMove ].hasBeenWalkedOn)
					ThrowError("I can't move forward, I'd cover up my own path!");
				else
					ThrowError("I can't move forward, the level would be too big!");
					
				return;
			}
			Debug.Log("EDITOR: Placing a new Block");
		}
		else
		{
			ThrowError( "I can't move forward! There's a drop in front of me!" );
			return;
		}
		
	}
	
	//mark the block as "stepped on" (for editor modes)
	WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove);
	if (progCarry) WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos, zBlockPos + zMove);
	 
	//Move the bot
	var rat : float;
	while( time < 0.8 ){
		if( standardChecks() )
			return;
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		transform.position.x += xMove * speed * 1.25;
		transform.position.z += zMove * speed * 1.25;
		
		//Animation
		rat = (time/0.8)*Mathf.PI;
		limbBody.transform.localEulerAngles.x = -10*Mathf.Sin(rat);
		limbHead.transform.localEulerAngles.x = 10*Mathf.Sin(rat);
		
		yield;
	}
	transform.position = WorldManager.BlocksToWorld( Vector3(xBlockPos+xMove,yBlockPos,zBlockPos+zMove) );
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	
	UpdateTimer();
	
}
function MoveBackward () {
	
	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var xMove : int = 0;
	var zMove : int = 0;
	
	//Figure out how the bot will move
	switch( angle ){
		case 0:
			zMove = -1;
		break;
		case 1:
			xMove = -1;
		break;
		case 2:
			zMove = 1;
		break;
		case 3:
			xMove = 1;
		break;
	}
	nextBlockPos = Vector3( xBlockPos + xMove, yBlockPos, zBlockPos + zMove );
	
	//Out-of-bounds error detection
	if( (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "I can't move backward! I'll fall off the edge!" );
		return;
	}
	
	//Collision error detection
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos + zMove ].hasCollision ){
		ThrowError( "I can't move backward! There's something behind me!" );
		return;
	}
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos + zMove ].hasCollision && carryObj != null){
		ThrowError( "I can't move backward! There's something behind me!" );
		return;
	}
	
	//Pit error detection
	if( !WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].canBeWalkedOn ){
		if(WorldManager.dm.gameplayMode == "progEdit")
		{
			if(!WorldManager.PlaceBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove))
			{
				if(WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].hasBeenWalkedOn
				|| WorldManager.block[ xBlockPos + xMove, yBlockPos - 2, zBlockPos + zMove ].hasBeenWalkedOn)
					ThrowError("I can't move backward, I'd cover up my own path!");
				else
					ThrowError("I can't move backwards, the level would be too big!");
					
				return;
			}
			Debug.Log("EDITOR: Placing a new Block");
		}
		else
		{
			ThrowError( "I can't move backward! There's a drop in front of me!" );
			return;
		}
	}
	
	//mark the block as "stepped on" (for editor modes)
	WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove);
	if (progCarry) WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos, zBlockPos + zMove);
	
	//Move the bot
	var rat : float;
	while( time < 0.8 ){
		if( standardChecks() )
			return;
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		transform.position.x += xMove * speed * 1.25;
		transform.position.z += zMove * speed * 1.25;
		
		//Animation
		rat = (time/0.8)*Mathf.PI;
		limbBody.transform.localEulerAngles.x = 10*Mathf.Sin(rat);
		limbHead.transform.localEulerAngles.x = -10*Mathf.Sin(rat);
		
		yield;
	}
	transform.position = WorldManager.BlocksToWorld( Vector3(xBlockPos+xMove,yBlockPos,zBlockPos+zMove) );
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	
	
	UpdateTimer();
	
}




















function TurnRight () {
	
	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.localEulerAngles.y / 90.0 );
	var newAngle : int = 0;
	
	
	//Figure out how the bot will move
	switch( angle ){
		case 0:
			newAngle = 90;
		break;
		case 1:
			newAngle = 180;
		break;
		case 2:
			newAngle = 270;
		break;
		case 3:
			newAngle = 0;
		break;
	}
	angle *= 90;
	
	//Move the bot
	while( time < 0.8 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		transform.localEulerAngles.y += speed*108;
		yield;
	}
	transform.localEulerAngles.y = newAngle;
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	
	
	UpdateTimer();
	
}

function TurnLeft () {
	
	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.localEulerAngles.y / 90.0 );
	var newAngle : int = 0;
	
	
	//Figure out how the bot will move
	switch( angle ){
		case 0:
			newAngle = 270;
		break;
		case 1:
			newAngle = 0;
		break;
		case 2:
			newAngle = 90;
		break;
		case 3:
			newAngle = 180;
		break;
	}
	angle *= 90;
	
	//Move the bot
	while( time < 0.8 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		transform.localEulerAngles.y -= speed*108;
		yield;
	}
	transform.localEulerAngles.y = newAngle;
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	
	
	UpdateTimer();
	
}














function ClimbUp () {

	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var oldY : float = transform.position.y;
	var xMove : int = 0;
	var zMove : int = 0;
	
	//Find the movement
	switch( angle ){
		case 0:
			zMove = 1;
		break;
		case 1:
			xMove = 1;
		break;
		case 2:
			zMove = -1;
		break;
		case 3:
			xMove = -1;
		break;
	}
	nextBlockPos = Vector3( xBlockPos + xMove, yBlockPos + 1, zBlockPos + zMove );

	//Out-of-bounds error detection
	if( (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "I can't climb up here! There's nothing I can climb on!" );
		return;
	}

	//No platform error detection
	if( !WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos + zMove ].canBeWalkedOn || WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos + zMove ].hasCollision ){		
		if(WorldManager.dm.gameplayMode == "progEdit")
		{
			if(!WorldManager.PlaceBlock(xBlockPos + xMove, yBlockPos, zBlockPos + zMove))
			{
				if(WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].hasBeenWalkedOn)
					ThrowError("I can't climb up, I'd cover up my own path!");
				else
					ThrowError("I can't climb up, the level would be too big!");
					
				return;
			}
			Debug.Log("EDITOR: Placing a new Box");
		}
		else
		{
			ThrowError( "I can't climb up here! There's nothing I can climb on!" );
			return;
		}
	}
	if(//WorldManager.block[ xBlockPos, yBlockPos+1, zBlockPos ].hasCollision ||
	WorldManager.block[  xBlockPos, yBlockPos+1, zBlockPos ].hasBlock ||
	WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos+zMove ].hasCollision ||
	(WorldManager.block[ xBlockPos, yBlockPos+2, zBlockPos ].hasCollision && carryObj != null ) ||
	(WorldManager.block[ xBlockPos + xMove, yBlockPos+2, zBlockPos + zMove ].hasCollision && carryObj != null ))
	{
		ThrowError( "I can't climb up here! There's not enough room!" );
		return;
	}
	else
	{
		Debug.Log("Above Me Is " + WorldManager.block[xBlockPos, yBlockPos+1, zBlockPos].hasCollision);
	}
	
	//Heavy block error detection
	if( carryObj != null )
		if( carryObj.GetComponent(MovableObject).isHeavy ){
			ThrowError( "I can't climb! This thing I'm carrying is too heavy!" );
			return;
		}

	//mark the block as "stepped on" (for editor modes)
	WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos, zBlockPos + zMove);
	WorldManager.StepOnBlock(xBlockPos, yBlockPos, zBlockPos);
	if (progCarry) WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos + 1, zBlockPos + zMove);
	
	//Move the bot
	var vel : float = 5;
	var accel : float = (2*(1-vel*0.8))/0.64;
	var trueTime : float = 0;
	var rat : float = 0;
	while( time < 0.1 ){
		if( standardChecks() )
			return;
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		//Animation
		//rat = time/0.1;
		//limbBody.transform.localEulerAngles.x = 10*rat;
		//limbHead.transform.localEulerAngles.x = -20*rat;
		
		yield;
	}
	while( time < 0.9 ){
		speed = timer.animSpeed * Time.deltaTime;
		trueTime = time-0.1;
		time += speed;
		transform.position.x += xMove * speed * 1.25;
		transform.position.y = oldY + vel*trueTime + 0.5*accel*trueTime*trueTime;
		transform.position.z += zMove * speed * 1.25;
		
		//Animation
		//rat = ((time-0.1)/0.8)*Mathf.PI;
		//limbBody.transform.localEulerAngles.x = 10 - 30*Mathf.Sin(rat);
		//limbHead.transform.localEulerAngles.x = -20 + 50*Mathf.Sin(rat);
		
		yield;
	}
	transform.position = WorldManager.BlocksToWorld( Vector3(xBlockPos+xMove,yBlockPos+1,zBlockPos+zMove) );
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		//Animation
		//rat = (time-0.9)/0.1;
		//limbBody.transform.localEulerAngles.x = 10-10*rat;
		//limbHead.transform.localEulerAngles.x = -20+20*rat;
		
		yield;
	}
	//limbBody.transform.localEulerAngles.x = 0;
	//limbHead.transform.localEulerAngles.x = -0;


	UpdateTimer();


}
function ClimbDown () {

	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var oldX : float = transform.position.x;
	var oldY : float = transform.position.y;
	var oldZ : float = transform.position.z;
	var xMove : int = 0;
	var zMove : int = 0;
	
	//Find the movement
	switch( angle ){
		case 0:
			zMove = 1;
		break;
		case 1:
			xMove = 1;
		break;
		case 2:
			zMove = -1;
		break;
		case 3:
			xMove = -1;
		break;
	}
	nextBlockPos = Vector3( xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove );

	//Out-of-bounds error detection
	if( (yBlockPos - 2 < 0) || (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "I cant climb down here! There's nothing I can land on!" );
		return;
	}

	//collision error detection
	if( !WorldManager.block[ xBlockPos + xMove, yBlockPos-2, zBlockPos + zMove ].canBeWalkedOn ){ //TODO: I changed this from 1 to 2
		if(WorldManager.dm.gameplayMode == "progEdit")
		{
			if(!WorldManager.PlaceBlock(xBlockPos + xMove, yBlockPos-2, zBlockPos + zMove))
			{
				if(yBlockPos - 3 >= 0 && WorldManager.block[ xBlockPos + xMove, yBlockPos - 3, zBlockPos + zMove ].hasBeenWalkedOn)
					ThrowError("I can't climb down, I'd cover up my own path!");
				else
					ThrowError("I can't climb down, the level would be too big!");
					
				return;
			}
			Debug.Log("EDITOR: Placing a new Box");
		}
	}
	else if (WorldManager.block[ xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove ].hasCollision) //TODO: I added the if part
	{
		ThrowError( "I can't climb down here! The floor is here!" );
		return;
	}
	
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos + zMove ].hasCollision || WorldManager.block[ xBlockPos + xMove, yBlockPos-1, zBlockPos + zMove ].hasCollision ){
		ThrowError( "I cant climb down here! There's something in the way!" );
		return;
	}
	if(WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos+zMove ].hasBlock ||
	(WorldManager.block[ xBlockPos, yBlockPos+1, zBlockPos].hasBlock && carryObj != null ) ||
	(WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos + zMove ].hasCollision && carryObj != null) ){
		ThrowError( "I cant climb down here! There's not enough room!" );
		return;
	}
	
	//Platform error detection
	//if( !WorldManager.block[ xBlockPos + xMove, yBlockPos-2, zBlockPos + zMove ].canBeWalkedOn ){
	//	ThrowError( "I cant climb down here! It's too far of a drop!" );
	//	return;
	//}
	
	//Heavy block error detection
	if( carryObj != null )
		if( carryObj.GetComponent(MovableObject).isHeavy ){
			ThrowError( "I cant climb! This thing I'm carrying is too heavy!" );
			return;
		}
		
	//find the new position
    //TODO: find the real new position (iterate down)
	var yBlockNewPos = yBlockPos;
	while (yBlockNewPos > 0 && !WorldManager.block[xBlockPos+xMove,yBlockNewPos-1,zBlockPos+zMove].canBeWalkedOn)
	{
		yBlockNewPos--;
		//Debug.Log("Drop " + yBlockNewPos);
	}
	nextBlockPos = Vector3(xBlockPos+xMove,yBlockNewPos,zBlockPos+zMove); 
	var nextWorldPos = WorldManager.BlocksToWorld(nextBlockPos); 
	var diff = yBlockPos - yBlockNewPos - 1;
	//nextWorldPos.y += heightBoost;
	
	//mark the block as "stepped on" (for editor modes)
	WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos - 2, zBlockPos + zMove);
	WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove);
	if (progCarry) WorldManager.StepOnBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove);

	//Move the bot
	var vel : float = 2;
	var accel : float = (2*(0-1-vel*0.8))/0.64;
	var trueTime : float = 0;
	while( time < 0.1 ){
		if( standardChecks() )
			return;
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	while( time < 0.9 + 0.2 * diff && transform.position.y > nextWorldPos.y){
		var rat = time / (0.9 + 0.2 * diff);
		speed = timer.animSpeed * Time.deltaTime;
		trueTime = time-0.1;
		time += speed;
		transform.position.x = oldX + rat*(xMove);
		transform.position.y = oldY + (vel*trueTime + 0.5*accel*trueTime*trueTime);
		transform.position.z = oldZ + rat*(zMove);
		yield;
	}
	transform.position = nextWorldPos;
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}


	UpdateTimer();
}














function PickUp (){

	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var xMove : int = 0;
	var zMove : int = 0;
	var objWidth : float = 0;
	var mov : MovableObject;
	var newCarryObj : GameObject;
	
	//Find the movement
	switch( angle ){
		case 0:
			zMove = 1;
		break;
		case 1:
			xMove = 1;
		break;
		case 2:
			zMove = -1;
		break;
		case 3:
			xMove = -1;
		break;
	}


	//Already carrying error detection
	if( carryObj != null ){
		ThrowError("I'm already carrying Something! I can't carry anything else!");
		return;
	}
	
	//Out-of-bounds error detection
	if( (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "There's nothing here that I can pick up!" );
		return;
	}
	
	//Find a block to pick up
	for( obj in WorldManager.movableList ){
		var pos : Vector3 = WorldManager.WorldToBlocks(obj.obj.transform.position);
		if( pos.x == xBlockPos + xMove )
			if( pos.y == yBlockPos )
				if( pos.z == zBlockPos + zMove ){
					mov = obj.obj.GetComponent(MovableObject);
					if( mov != null ){
						if( mov.canBeLifted ){
							newCarryObj = obj.obj;
							break;
						}
					}
				}	
	}
	
	//Do stuff to prepare the block
	if( newCarryObj != null ){
	
		//If it needs to be taken from another bot
		for( obj in WorldManager.botsList ){
			var otherBot = obj.obj.GetComponent(Bot);
			if( otherBot != null && otherBot != this ){
				if( otherBot.carryObj == newCarryObj ){
					otherBot.carryObj = null;
					otherBot.LowerArms();
				}
			}
		}
		
		objWidth = mov.liftWidth;
		
		
	}else{
		//put a block and ghost block if that's needed
		if(WorldManager.dm.gameplayMode.Contains("Edit"))
			{
				if(WorldManager.botsList[0].startPos.x == xBlockPos + xMove &&
					WorldManager.botsList[0].startPos.y == yBlockPos &&
					WorldManager.botsList[0].startPos.z == zBlockPos + zMove)
					{
						ThrowError("I can't put a box there, I'd cover up my own path!");
						return;
					}
				
				if(WorldManager.PlaceBox(xBlockPos + xMove, yBlockPos, zBlockPos + zMove, true))
				{
					WorldManager.PlaceBox(xBlockPos + xMove, yBlockPos, zBlockPos + zMove, false);
					
					//TODO: Pasted from above. Fix this. Find a block to pick up
					for( obj in WorldManager.movableList ){
						pos = WorldManager.WorldToBlocks(obj.obj.transform.position);
						if( pos.x == xBlockPos + xMove )
							if( pos.y == yBlockPos )
								if( pos.z == zBlockPos + zMove ){
									mov = obj.obj.GetComponent(MovableObject);
									if( mov != null ){
										if( mov.canBeLifted ){
											newCarryObj = obj.obj;
											break;
										}
									}
								}	
					}
					
					progCarry = true;
					Debug.Log("EDITOR: Placing a new Box");
					//UpdateTimer(); TODO: Messing with this
					//return;
				}
				else
				{
					ThrowError("I can't put a box there, I'd cover up my own path!");
					return;
				}
			}
			else{
				ThrowError( "There's nothing here that I can pick up!" );
				return;
			}
	}

	//Room above the bot
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos+1, zBlockPos + zMove ].hasCollision ){
		ThrowError("There is not enough room above me to pick this up!");
		return;
	}
	
	//Timing
	var rat : float;
	var angRat : float;
	while( time < 0.4 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		//Animation
		rat = (time/0.4);
		angRat = rat * Mathf.PI;
		limbArmR.transform.localPosition = Vector3( 0.2+(objWidth/2-0.14)*Mathf.Pow(rat,0.2), -0.182*rat, 0.822*rat );
		limbArmR.transform.localEulerAngles = Vector3( -90*rat, 0, 0 );
		limbArmL.transform.localPosition = Vector3( -0.2-(objWidth/2-0.14)*Mathf.Pow(rat,0.2), -0.182*rat, 0.822*rat );
		limbArmL.transform.localEulerAngles = Vector3( -90*rat, 0, 0 );
		limbBody.transform.localPosition.z = 0.2*Mathf.Sin(angRat);
		limbBody.transform.eulerAngles.x = -10*Mathf.Sin(angRat);
		
		yield;
	}
	var carryOld : Vector3 = WorldManager.BlocksToWorld(Vector3(xBlockPos+xMove,yBlockPos,zBlockPos+zMove));
	var carryNew : Vector3 = WorldManager.BlocksToWorld(Vector3(xBlockPos,yBlockPos+1,zBlockPos));
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		//Animation
		rat = Mathf.Pow((time-0.4)/0.6,2);
		angRat = rat * Mathf.PI;
		limbArmR.transform.localPosition = Vector3( 0.2+(objWidth/2-0.14), -0.182+.806*rat, 0.822-0.822*rat );
		limbArmR.transform.localEulerAngles = Vector3( -90-90*rat, 0, 0 );
		limbArmL.transform.localPosition = Vector3( -0.2-(objWidth/2-0.14), -0.182+.806*rat, 0.822-0.822*rat );
		limbArmL.transform.localEulerAngles = Vector3( -90-90*rat, 0, 0 );
		limbBody.transform.localPosition.z = -0.2*Mathf.Sin(angRat);
		limbBody.transform.eulerAngles.x = 30*Mathf.Sin(angRat);
		
		//Carry object animation
		newCarryObj.transform.position.x = carryOld.x + (carryNew.x-carryOld.x)*rat;
		newCarryObj.transform.position.y = carryOld.y + (carryNew.y-carryOld.y)*rat;
		newCarryObj.transform.position.z = carryOld.z + (carryNew.z-carryOld.z)*rat;
		
		yield;
	}
	carryObj = newCarryObj;
	carryObj.transform.position = WorldManager.BlocksToWorld(Vector3(xBlockPos,yBlockPos+1,zBlockPos));
	carryObj.transform.parent = gameObject.transform;
	WorldManager.UpdatePosition( xBlockPos+xMove, yBlockPos, zBlockPos+zMove );
	limbBody.transform.localPosition.z = 0;
	limbBody.transform.eulerAngles.x = 0;
	while( time < 1.2 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		yield;
	}



	UpdateTimer();

}
function PutDown(){

	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int = Mathf.RoundToInt( transform.eulerAngles.y / 90.0 );
	var xMove : int = 0;
	var zMove : int = 0;
	var objWidth : float = 0;
	var mov : MovableObject;
	var newCarryObj : GameObject;
	
	//Find the movement
	switch( angle ){
		case 0:
			zMove = 1;
		break;
		case 1:
			xMove = 1;
		break;
		case 2:
			zMove = -1;
		break;
		case 3:
			xMove = -1;
		break;
	}
	
	
	
	if( carryObj == null ){
		if(WorldManager.dm.gameplayMode != "progEdit" || !progCarry)
		{
			ThrowError("I'm not carrying anything to put down!");
		}
		else
		{
			
		}
		return;
	}
	
	//editor shenanigans
	if(WorldManager.dm.gameplayMode.Contains("Edit"))
	{
		//Used to place switches here... actually, I don't want to place a switch until the end. 
		if(WorldManager.PlaceBlock(xBlockPos + xMove, yBlockPos - 1, zBlockPos + zMove))
		{
			progCarry = false;
			//UpdateTimer();
		}
		else
		{
			ThrowError( "I can't put the box there, I'd cover up my own path!");
		}
	}
	
	//Out-of-bounds error detection
	if( (xBlockPos+xMove<0) || (xBlockPos+xMove>WorldManager.worldMaxX) || (zBlockPos+zMove<0) || (zBlockPos+zMove>WorldManager.worldMaxZ) ){
		ThrowError( "I cant set this down here! There's nowhere to put it!" );
		return;
	}
	
	//Collision error detection
	if( WorldManager.block[ xBlockPos + xMove, yBlockPos, zBlockPos + zMove ].hasCollision ){
		ThrowError("I cant set this down here! There's something in the way!");
		return;
	}
	
	//No platform error detection
	//if( !WorldManager.block[ xBlockPos + xMove, yBlockPos-1, zBlockPos + zMove ].canBeWalkedOn ){
	//	ThrowError("I cant set this down here! There's nowhere to put it!");
	//	return;
	//}
	
	//iterative check downward until a "full" spot is found
	//Do the world manager stuff here?
	
	
	
	//Bot detection
	for( var bType in WorldManager.botsList ){
		var b = bType.obj.GetComponent(Bot);
		if( b.nextBlockPos.Equals(Vector3(xBlockPos + xMove, yBlockPos, zBlockPos + zMove)) ){
			ThrowError("I cant set this down here! There's another Bot here!");
			return;
		}
	}
	
	//Place the object
	objWidth = carryObj.GetComponent(MovableObject).liftWidth;
	var rat : float;
	var ratPow : float;
	var carryOld : Vector3 = WorldManager.BlocksToWorld(Vector3(xBlockPos,yBlockPos+1,zBlockPos));
	var carryNew : Vector3 = WorldManager.BlocksToWorld(Vector3(xBlockPos+xMove,yBlockPos+1,zBlockPos+zMove));
	var armWidth = 0.2+(objWidth/2-0.14);
	var heightBoost = WorldManager.GetHeightBoost(Vector3(xBlockPos+xMove,yBlockPos,zBlockPos+zMove));
	while( time < 0.4 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		
		//Animation
		rat = time/0.4;
		ratPow = Mathf.Pow(rat,0.2);
		limbArmR.transform.localPosition = Vector3( armWidth, 0.624+0.046*rat, 0.859*rat );
		limbArmR.transform.localEulerAngles = Vector3( -180+45*rat, 0, 0 );
		limbArmL.transform.localPosition = Vector3( 0-armWidth, 0.624+0.046*rat, 0.859*rat );
		limbArmL.transform.localEulerAngles = Vector3( -180+45*rat, 0, 0 );
		limbBody.transform.localPosition.z = 0.1*ratPow;
		limbBody.transform.localEulerAngles.x = -10*ratPow;
		
		//Carry object animation
		carryObj.transform.position.x = carryOld.x + (carryNew.x-carryOld.x)*rat;
		carryObj.transform.position.y = carryOld.y + (carryNew.y-carryOld.y)*rat;
		carryObj.transform.position.z = carryOld.z + (carryNew.z-carryOld.z)*rat;
		
		yield;
	}
	
	//TODO: find the real new position (iterate down)
	//Debug.Log("important debug " + carryNew.y);
	var yBlockNewPos = yBlockPos;
	while (!WorldManager.block[xBlockPos+xMove,yBlockNewPos-1,zBlockPos+zMove].canBeWalkedOn)
	{
		yBlockNewPos--;
		Debug.Log("Drop");
	}
	carryNew = WorldManager.BlocksToWorld( Vector3(xBlockPos+xMove,yBlockNewPos,zBlockPos+zMove) ); 
	carryNew.y += heightBoost;
	
	//animate dropping
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		time = time>1 ? 1 : time;
		
		
		//Animation
		rat = (time-0.4)/0.6;
		ratPow = rat*rat*rat;
		limbArmR.transform.localPosition = Vector3( 0.2+(objWidth/2-0.14)*(1-ratPow), 0.67-0.67*rat, 0.859-0.859*rat );
		limbArmR.transform.localEulerAngles = Vector3( -135+135*ratPow, 0, 0 );
		limbArmL.transform.localPosition = Vector3( -0.2-(objWidth/2-0.14)*(1-ratPow), 0.67-0.67*rat, 0.859-0.859*rat);
		limbArmL.transform.localEulerAngles = Vector3( -135+135*ratPow, 0, 0 );
		limbBody.transform.localPosition.z = 0.1-0.1*ratPow;
		limbBody.transform.localEulerAngles.x = -10+10*ratPow;
		
		//Carry object animation
		//carryObj.transform.position.x = carryNew.x;
		//carryObj.transform.position.y = carryNew.y - ratPow;
		//if( carryObj.transform.position.y < carryNew.y + heightBoost - 1 )
		//	carryObj.transform.position.y = carryNew.y + heightBoost - 1;
		//carryObj.transform.position.z = carryNew.z;
		
		//anim
		//Carry object animation
		carryObj.transform.position.x = carryNew.x;
		carryObj.transform.position.y = carryOld.y - ratPow * (carryOld.y - carryNew.y);
		if( carryObj.transform.position.y < carryNew.y)
			carryObj.transform.position.y = carryNew.y;
		carryObj.transform.position.z = carryNew.z;
		
		yield;
	}
	limbArmR.transform.localPosition = Vector3( 0.2, 0, 0 );
	limbArmR.transform.localEulerAngles = Vector3( -0, 0, 0 );
	limbArmL.transform.localPosition = Vector3( -0.2, 0, 0 );
	limbArmL.transform.localEulerAngles = Vector3( 0, 0, 0 );	
	
	carryObj.transform.position = carryNew;
	carryObj.transform.parent = null;
	carryObj = null;
	WorldManager.UpdatePosition( xBlockPos+xMove, yBlockNewPos, zBlockPos+zMove );
	
	UpdateTimer();


}









function Wait(){

	//Setup time and original position/angles
	var time : float = 0;
	var speed : float = 0;
	var angle : int;

	
	//Move the bot
	while( time < 1 ){
		speed = timer.animSpeed * Time.deltaTime;
		time += speed;
		yield;
	}
	
	
	UpdateTimer();

}















