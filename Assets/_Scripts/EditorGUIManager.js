//#pragma strict

//Statics
public static final var MODE_WINDOW_WIDTH = 192;
public static final var MODE_WINDOW_HEIGHT = 144;

var dm : DataManager;

//GUI Styles
var containerStyle : GUIStyle;
var buttonStyle : GUIStyle;
var buttonSelectedStyle : GUIStyle;
var listStyle : GUIStyle;
var carryObjStyle : GUIStyle;
var infoStyle : GUIStyle;
var textBoxStyle : GUIStyle;
var textAreaStyle : GUIStyle;
var scrollSkin : GUISkin;

public var prevIcon : Texture2D;
public var nextIcon : Texture2D;
public var undoIcon : Texture2D;
public var popUpButton : GUIStyle;

//GUI Rectangles
private var modeWindowPos : Rect;
private var addModePos : Rect;
private var programWindowPos : Rect;
private var eraseModePos : Rect;
private var objWindowPos : Rect;
private var blocksWindowPos : Rect;
private var skinWindowPos : Rect;
private var saveWindowPos : Rect;
private var savePos : Rect;
private var quitPos : Rect;
private var popUpPos : Rect;
private var popUpButtonLPos : Rect;
private var popUpButtonRPos : Rect;
private var saveNamePos : Rect;
private var saveDescriptionPos : Rect;

private var botPos : Vector3 = Vector3.zero;

//Lists
var movableObjects : String[];
var availableSkins : String[];
private var movableList : EditorList;
private var skinsList : EditorList;

//References
public static var muteGUI : boolean = true;
var editor : EditorManager;
@HideInInspector var mouseTimer : MouseTimer;

//Pop up windows
enum PopUpWindow { NONE, SAVE, QUIT, TUTORIAL };
private var popUpWindow : PopUpWindow = PopUpWindow.NONE;
private var saveName : String;
private var saveDescription : String;

//Screen resize variables
private var screenSize : Vector2 = Vector2.zero;

//ScrollView Dealies
private var blockScrollPosition : Vector2 = Vector2.zero;
private var progScrollPosition : Vector2 = Vector2.zero;

//List of BuildingBlocks? May want to move this to EditorManager
private var buildingBlocksList : List.<BuildingBlock> = new List.<BuildingBlock>();
private var progString : String = "";
private var progLines : int = 0;
private var progBlocks : int = 0;

//TutorialPopup
var tutorialIndex = 0;
var tutorialNode : XMLNode;
var tutorialInstructionsAll = false;

var highlightRect : Rect = Rect(-1,-1,1,1);
var highlightTargetRect : Rect = Rect(-1,-1,1,1);

public static var blockToggle = false;

function Awake() {
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
	
	if(dm.gameplayMode == "blockEdit")
	{
		SetupTutorialInstructions();
		if(tutorialNode && tutorialNode != null)
		{
			tutorialIndex = 0;
			popUpWindow = PopUpWindow.TUTORIAL;
		}
	}
}

function SetupTutorialInstructions()
{
	var myNode : XMLNode;
	if(dm.gameplayMode == "blockEdit")
	{
		try {myNode = dm.GetBlockEditorNode()["tutorialtext"][0];
		tutorialNode = myNode;}
		catch(e){ tutorialNode = null;}
	}
}

function Start () {
	resizeScreen();
	mouseTimer = MouseTimer.Get();
	mouseTimer.setStyle( infoStyle );
	
	setUpDemoBuildingBlocks();
}

function Update() {

	//Scree resize
	if( screenSize.x != Screen.width || screenSize.y != Screen.height )
		resizeScreen();
		
	//Pop up reposition
	if( popUpWindow == PopUpWindow.NONE ){
		popUpPos.y = Screen.height;
	}else{
		popUpPos.y = Mathf.MoveTowards( popUpPos.y, (Screen.height>>1) - 128, Screen.height*4*Time.deltaTime );
	}
	popUpButtonLPos.y = popUpPos.y+popUpPos.height-64;
	popUpButtonRPos.y = popUpPos.y+popUpPos.height-64;
	saveNamePos.y = popUpPos.y + popUpPos.height/2-92;
	saveDescriptionPos.y = popUpPos.y + popUpPos.height/2-32;
	
}

function OnGUI () {

	if( !Camera.main.pixelRect.Contains(new Vector2( Input.mousePosition.x, Screen.height-Input.mousePosition.y) ) )
		editor.canRaycast = false;

	if( dm.gameplayMode != "blockEdit")
	{
	drawModeWindow();
	drawObjWindow();
	drawSkinWindow();
	//drawSaveWindow();
	}
	else if (dm.gameplayMode == "blockEdit")
	{
	drawBlocksWindow();
	//drawProgramWindow();
	}
	
	drawSaveWindow();
	mouseTimer.Draw();
	drawCarryObj();
	drawPopUpWindow();

}




/**
* This funcition is to be called whenever the screen gets resized
*/
function resizeScreen(){

	if( Screen.width != screenSize.x || Screen.height != screenSize.y ){
		
		//Positions
		Camera.main.pixelRect = new Rect( MODE_WINDOW_WIDTH, 0, Screen.width - MODE_WINDOW_WIDTH, Screen.height );
		if(dm.gameplayMode == "blockEdit")
			Camera.main.pixelRect = new Rect( MODE_WINDOW_WIDTH, 0, Screen.width - MODE_WINDOW_WIDTH, Screen.height );
		modeWindowPos = new Rect( 0, 0, MODE_WINDOW_WIDTH, MODE_WINDOW_HEIGHT );
		addModePos = new Rect( modeWindowPos.x + MODE_WINDOW_WIDTH*0.2, modeWindowPos.y + MODE_WINDOW_HEIGHT*0.25, MODE_WINDOW_WIDTH*0.6, 44 );
		eraseModePos = new Rect( modeWindowPos.x + MODE_WINDOW_WIDTH*0.2, modeWindowPos.y + MODE_WINDOW_HEIGHT*0.6, MODE_WINDOW_WIDTH*0.6, 44 );
		programWindowPos = new Rect(Screen.width - (0.75 * MODE_WINDOW_WIDTH), 0, (0.75 * MODE_WINDOW_WIDTH), Screen.height );
		objWindowPos = new Rect( 0, modeWindowPos.height-1, MODE_WINDOW_WIDTH, (Screen.height - modeWindowPos.height*2)*0.5 + 1 );
		skinWindowPos = new Rect( 0, objWindowPos.yMax-1, MODE_WINDOW_WIDTH, objWindowPos.height );
		blocksWindowPos = new Rect(0, 0, MODE_WINDOW_WIDTH, Screen.height); //TODO: Get a reasonable height here
		saveWindowPos = new Rect( 0, Screen.height-MODE_WINDOW_HEIGHT, MODE_WINDOW_WIDTH, MODE_WINDOW_HEIGHT );
		savePos = new Rect( saveWindowPos.x + MODE_WINDOW_WIDTH*0.2, saveWindowPos.y + MODE_WINDOW_HEIGHT*0.25, MODE_WINDOW_WIDTH*0.6, 44 );
		quitPos = new Rect( saveWindowPos.x + MODE_WINDOW_WIDTH*0.2, saveWindowPos.y + MODE_WINDOW_HEIGHT*0.6, MODE_WINDOW_WIDTH*0.6, 44 );
		popUpPos = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 128, 400, 256 );
		popUpButtonLPos = Rect(popUpPos.x + popUpPos.width/2 - 160, popUpPos.y+popUpPos.height-64, 128, 48);
		popUpButtonRPos = Rect(popUpPos.x + popUpPos.width/2 + 32, popUpPos.y+popUpPos.height-64, 128, 48);
		saveNamePos = Rect( (Screen.width)*0.5 - 160, Screen.height*0.5-22, 320, 44 );
		saveDescriptionPos = Rect( (Screen.width)*0.5 - 160, Screen.height*0.5-22, 320, 80 );
		
		//Lists
		movableList = new EditorList( movableObjects, Rect( objWindowPos.x, objWindowPos.y + 36, objWindowPos.width - 4, objWindowPos.height - 48), listStyle, scrollSkin );
		skinsList = new EditorList( availableSkins, Rect( skinWindowPos.x, skinWindowPos.y + 36, skinWindowPos.width - 4, skinWindowPos.height - 48), listStyle, scrollSkin );

		
		screenSize = Vector2( Screen.width, Screen.height );
	}

}

function setUpDemoBuildingBlocks()
{	
	//turnleft and right
	var the_points = new List.<Vector3>();
	var newBlock = new BuildingBlock(the_points, "turnleft", new Vector3(0,0,0), 3);
	newBlock.lines = 1;
	newBlock.program = "TurnLeft\n";
	buildingBlocksList.Add(newBlock);
	
	the_points = new List.<Vector3>();
	newBlock = new BuildingBlock(the_points, "turnright", new Vector3(0,0,0), 1);
	newBlock.lines = 1;
	newBlock.program = "TurnRight\n";
	buildingBlocksList.Add(newBlock);
	
	//move one
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(1,0,0));
	newBlock = new BuildingBlock(the_points, "move1", new Vector3(1,0,0), 0);
	newBlock.lines = 1;
	newBlock.program = "MoveForward\n";
	buildingBlocksList.Add(newBlock);
	
	//move four (minimum for for loops)
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,0,0));
	the_points.Add(new Vector3(3,0,0));
	the_points.Add(new Vector3(4,0,0));
	newBlock = new BuildingBlock(the_points, "move4", new Vector3(4,0,0), 0);
	newBlock.lines = 4;
	newBlock.program = "MoveForward\nMoveForward\nMoveForward\nMoveForward\n";
	buildingBlocksList.Add(newBlock);	
	
	//step 1
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(1,1,0));
	newBlock = new BuildingBlock(the_points, "up1", new Vector3(1,1,0), 0);
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,1,0));
	newBlock.clearance = the_points;
	newBlock.lines = 1;
	newBlock.program = "ClimbUp\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(1,1,0));
	the_points.Add(new Vector3(2,1,0));
	the_points.Add(new Vector3(2,2,0));
	the_points.Add(new Vector3(3,2,0));
	the_points.Add(new Vector3(3,3,0));
	newBlock = new BuildingBlock(the_points, "up3", new Vector3(3,3,0), 0);
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,1,0));
	the_points.Add(new Vector3(1,2,0));
	the_points.Add(new Vector3(2,3,0));
	newBlock.clearance = the_points;
	newBlock.lines = 3;
	newBlock.program = "ClimbUp\nClimbUp\nClimbUp\n";
	buildingBlocksList.Add(newBlock);	
	
	//step 1
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(0,-1,0));
	the_points.Add(new Vector3(1,-1,0));
	newBlock = new BuildingBlock(the_points, "down1", new Vector3(1,-1,0), 0);
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(1,0,0));
	newBlock.clearance = the_points;
	newBlock.lines = 1;
	newBlock.program = "ClimbDown\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(0,-1,0));
	the_points.Add(new Vector3(1,-1,0));
	the_points.Add(new Vector3(1,-2,0));
	the_points.Add(new Vector3(2,-2,0));
	the_points.Add(new Vector3(2,-3,0));
	the_points.Add(new Vector3(3,-3,0));
	newBlock = new BuildingBlock(the_points, "down3", new Vector3(3,-3,0), 0);
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,-1,0));
	the_points.Add(new Vector3(3,-2,0));
	newBlock.clearance = the_points;
	newBlock.lines = 3;
	newBlock.program = "ClimbDown\nClimbDown\nClimbDown\n";
	buildingBlocksList.Add(newBlock);	
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	newBlock = new BuildingBlock(the_points, "beep", new Vector3(0,0,0), 0);
	newBlock.AddItem("Box", Vector3(1,0,0));
	newBlock.lines = 1;
	newBlock.toggle = true;
	newBlock.program = "PickUp\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	newBlock = new BuildingBlock(the_points, "boop", new Vector3(0,0,0), 0);
	newBlock.AddItem("Switch", Vector3(1,0,0));
	newBlock.lines = 1;
	newBlock.toggle = true;
	newBlock.toggleTarget = true;
	newBlock.program = "PutDown\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,0,0));;
	newBlock = new BuildingBlock(the_points, "flip", new Vector3(0,0,0), 0);
	newBlock.AddItem("Box", Vector3(1,0,0));
	newBlock.AddItem("Switch", Vector3(2,0,0));
	newBlock.lines = 4;
	newBlock.program = "PickUp\nMoveForward\nPutDown\nMoveBackward\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,0,0));
	the_points.Add(new Vector3(3,0,0));
	the_points.Add(new Vector3(4,0,0));
	newBlock = new BuildingBlock(the_points, "floop", new Vector3(0,0,0), 0);
	newBlock.AddItem("Box", Vector3(1,0,0));
	newBlock.AddItem("Switch", Vector3(4,0,0));
	newBlock.lines = 8;
	newBlock.program = "PickUp\nMoveForward\nMoveForward\nMoveForward\nPutDown\nMoveBackward\nMoveBackward\nMoveBackward\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,0,0));
	newBlock = new BuildingBlock(the_points, "skip", new Vector3(0,0,0), 0);
	newBlock.AddItem("Box", Vector3(2,0,0));
	newBlock.AddItem("Switch", Vector3(1,0,0));
	newBlock.lines = 4;
	newBlock.program = "MoveForward\nPickUp\nMoveBackward\nPutDown\n";
	buildingBlocksList.Add(newBlock);
	
	//step 4
	the_points = new List.<Vector3>();
	the_points.Add(new Vector3(0,0,0));
	the_points.Add(new Vector3(1,0,0));
	the_points.Add(new Vector3(2,0,0));
	the_points.Add(new Vector3(3,0,0));
	the_points.Add(new Vector3(4,0,0));
	newBlock = new BuildingBlock(the_points, "scoop", new Vector3(0,0,0), 0);
	newBlock.AddItem("Box", Vector3(4,0,0));
	newBlock.AddItem("Switch", Vector3(1,0,0));
	newBlock.lines = 8;
	newBlock.program = "MoveForward\nMoveForward\nMoveForward\nPickUp\nMoveBackward\nMoveBackward\nMoveBackward\nPutDown\n";
	buildingBlocksList.Add(newBlock);	
}

/**
* This function will draw the window that allows the user to switch between ADD and DELETE modes
*/
var canPlaceBlock : List.<boolean>;
var first = true;
var reset = true;
var bot : BotType;// = WorldManager.botsList[0];

public var BBStyle : GUIStyle;
function drawBlocksWindow(){

	
	if(progBlocks == 0)
	{
		GUI.enabled = false;
	}
	if( button(  Rect(Screen.width-64,16,56,56), GUIContent(undoIcon), buttonStyle))
	{
		progBlocks--;
		editor.undoBuildingBlock();
		reset = true;
	}
	GUI.enabled = true;
	
	
	GUI.Box( blocksWindowPos, "Blocks Left: " + (20 - progBlocks), containerStyle );
	
	
	var buttons = 10;
	var buttonheight = 80;
	var buttonbonus = 20;
	
	blockScrollPosition = GUI.BeginScrollView(new Rect(10, 40, 2 * buttonheight + 30, savePos.y - 40),
						blockScrollPosition,
						new Rect(0, 0, 2 * buttonheight + 20, (buildingBlocksList.Count / 2) * (buttonheight + buttonbonus)));
	
	var index = 0;
	
	if(bot.obj == null)
		bot = WorldManager.botsList[0];
	botPos = WorldManager.WorldToBlocks(bot.obj.transform.position);
	var rot = bot.obj.GetComponent(Bot).GetAngle();	
	
	if(first || reset)
	{
		first = false;
		reset = false;
		WorldManager.CleanupMovList();
		canPlaceBlock = new List.<boolean>();
		for(block in buildingBlocksList)
		{
			canPlaceBlock.Add(editor.canAddBuildingBlock(block, botPos, rot));
		}
	}
	
	index=0;
	for(block in buildingBlocksList)
	{
		if(canPlaceBlock[index]
		&& progBlocks < 20
		 && (!block.toggle || (blockToggle == block.toggleTarget))
		 && button( new Rect(0 + (index%2) * (buttonheight + 10) , (index/2)*(buttonheight+buttonbonus),buttonheight, buttonheight), block.icon, buttonStyle))
		{
			editor.addBuildingBlock(block, botPos, rot);
			reset = true;
			progString = progString + block.program;
			progLines += block.lines;
			progBlocks++;
//			Debug.Log(progLines);
			
			if (block.toggle)
			{
				blockToggle = !blockToggle;
			}
		}
		else
		{
			GUI.enabled = false;
			button( new Rect(0 + (index%2) * (buttonheight + 10) , (index/2)*(buttonheight+buttonbonus),buttonheight, buttonheight), block.icon, buttonStyle);
			GUI.enabled = true;
		}
		index++;
	}
	
	//button( new Rect(0,0,buttonheight, buttonheight), "Blockules", buttonStyle, "Use this mode to remove blocks and objects from your level." );
	//button( new Rect(0,(buttonheight+buttonbonus),buttonheight, buttonheight), "Brickules", buttonStyle, "Use this mode to remove blocks and objects from your level." );
	//button( new Rect(0,2*(buttonheight+buttonbonus),buttonheight, buttonheight), "Blankules", buttonStyle, "Use this mode to remove blocks and objects from your level." );
	
	GUI.EndScrollView();
				
}


function drawProgramWindow(){

	GUI.Box( programWindowPos, "Commands: " + progLines + "\nBlocks: " + progBlocks, containerStyle );
	progScrollPosition = GUI.BeginScrollView(
						new Rect(programWindowPos.x,programWindowPos.y + 80 ,programWindowPos.width,programWindowPos.height - 80),
						progScrollPosition,
						new Rect(0, 0, programWindowPos.width, Screen.height * (1 + (progLines % 41))), false, true);
	GUI.Label(new Rect(0, 0, programWindowPos.width, Screen.height * (1 + (progLines % 41))), progString);
	GUI.EndScrollView();
}

function drawModeWindow(){

	GUI.Box( modeWindowPos, "Edit Mode", containerStyle );
	
	if( dm.gameplayMode != "blockEdit")
	{
		if( editor.mode == EditModes.ADD ){
		
			GUI.Label( addModePos, "Add", buttonSelectedStyle );
			if( button( eraseModePos, "Erase", buttonStyle, "Use this mode to remove blocks and objects from your level." ) )
				editor.mode = EditModes.ERASE;
				
		}else{
			
			GUI.Label( eraseModePos, "Erase", buttonSelectedStyle );
			if( button( addModePos, "Add", buttonStyle, "Use this mode to add blocks and edit objects in your level." ) )
				editor.mode = EditModes.ADD;

		}
	}	
}





/**
* This function will draw the window that the user uses to place objects in the scene
*/
function drawObjWindow(){

	GUI.Box( objWindowPos, "Drag in objects", containerStyle );
	var objStr : String = movableList.draw();
	
	//Adding a bot
	if( objStr != null ){
		if( objStr.Equals("Bot") ){
			if( WorldManager.botsList.Count < 6 ){
				var newBot = new BotType( Vector3(0,-10000,0), 0 );
				WorldManager.botsList.Add(newBot);
				editor.carryBot = newBot;
			}else{
				Debug.Log("There's already 6 bots!");
			}
		
	//Addubg a movable object
		}else{
			var newMov = new MovableType( objStr, Vector3(0,-10000,0), 0 );
			WorldManager.movableList.Add(newMov);
			editor.carryMov = newMov;
		}
	}

}




/**
* This function will draw the window that changes the level's Skin
*/
function drawSkinWindow(){

	GUI.Box( skinWindowPos, "Change the level's skin", containerStyle );
	var newSkin : String = skinsList.draw();
	if( newSkin != null ){
		WorldManager.skinName = newSkin;
		for( var x = 0; x < WorldManager.worldMaxX; x++ )
			for( var y = 0; y < WorldManager.worldMaxY; y++ )
				for( var z = 0; z < WorldManager.worldMaxZ; z++ )
					if( WorldManager.block[x,y,z].getObject() != null ){
						DestroyObject(WorldManager.block[x,y,z].getObject());
						WorldManager.block[x,y,z].setObject(null);
					}
		WorldManager.BuildWorld();
	}

}


/**
* This function will draw the window that allows the user to save and quit
*/
function drawSaveWindow(){

	GUI.Box( saveWindowPos, "Options", containerStyle );
	
	if( button( savePos, "Save", buttonStyle, "Click this to save your new level." ) ){
		popUpWindow = PopUpWindow.SAVE;
		saveName = WorldManager.levelName;
		saveDescription = WorldManager.levelDescription;
	}
	if( button( quitPos, "Quit", buttonStyle, "Click this to return to the main menu." ) )
		popUpWindow = PopUpWindow.QUIT;

}




/**
* This function will draw the name of the carried object at the position of the mouse
*/
function drawCarryObj(){

	var carryLabelPos = Rect(Input.mousePosition.x-2,Screen.height-Input.mousePosition.y-32-2,movableList.textPos.width,32);
	if( editor.carryMov != null ){
		GUI.Box( carryLabelPos, editor.carryMov.name, carryObjStyle );
	} else if( editor.carryBot != null ){ 
		GUI.Box( carryLabelPos, "Bot", carryObjStyle );
	}

}


/**
* This function will draw the current popup Window
*/
function drawPopUpWindow(){
	switch(popUpWindow){
	
		case PopUpWindow.NONE:
			muteGUI = false;
		break;
		
		
		//Save pop up window
		case PopUpWindow.SAVE:
			muteGUI = true;
			GUI.Box( popUpPos, "Save Level as...", containerStyle );
			
			//Input the level name string
			var oldNameString : String = saveName;
			saveName = GUI.TextField( saveNamePos, saveName, 32, textBoxStyle);
			var oldDescriptionString : String = saveDescription;
			saveDescription = GUI.TextArea( saveDescriptionPos, saveDescription, 256, textAreaStyle);
			
			//Name Security
			var chars : char[] = saveName.ToCharArray();
			var c : char;
			for( var i : int = 0; i < chars.Length; i++ ){
				c = chars[i];
				var validChar : boolean = false;
				if( c >= "0"[0] && c <= "9"[0] )
					validChar = true;
				if( c >= "A"[0] && c <= "Z"[0] )
					validChar = true;
				if( c >= "a"[0] && c <= "z"[0] )
					validChar = true;
				if( c == " "[0] || c == "-"[0] || c == "_"[0] )
					validChar = true;
				if( !validChar ){
					saveName = oldNameString;
					break;
				}
			}
			
			
			//Name Security
			chars = saveDescription.ToCharArray();
			for( i = 0; i < chars.Length; i++ ){
				c = chars[i];
				validChar = false;
				if( c >= "0"[0] && c <= "9"[0] )
					validChar = true;
				if( c >= "A"[0] && c <= "Z"[0] )
					validChar = true;
				if( c >= "a"[0] && c <= "z"[0] )
					validChar = true;
				if( c == " "[0] || c == "-"[0] || c == "_"[0] )
					validChar = true;
				if( c == "."[0] || c == ","[0] || c == "/"[0] || c == "?"[0] ||  c == "'"[0] || c == ":"[0] || c == "!"[0] || c == "("[0] || c == ")"[0] )
					validChar = true;
				if( !validChar ){
					saveDescription = oldDescriptionString;
					break;
				}
			}
			
			//Buttons
			if( GUI.Button( popUpButtonLPos, "Cancel", buttonStyle ) )
				popUpWindow = PopUpWindow.NONE;
			if( GUI.Button( popUpButtonRPos, "Save", buttonStyle ) ){
				//SAVE THE WORLD STATE HERE!!!!!!!!!                   <------------------------------
				//Add a block under the robot
				WorldManager.PlaceSwitch(botPos.x, botPos.y, botPos.z);
				
				WorldManager.levelName = saveName;
				WorldManager.levelDescription = saveDescription;
				
				WorldManager.CleanupMovList(); //call here for safekeeping
				
				var XML = WorldManager.worldToString(true);
				yield dm.SubmitLevel(saveName, saveDescription, XML); // calls the data manager
				popUpWindow = PopUpWindow.NONE;
				//Application.LoadLevel("Start");
				Application.LoadLevel("_NewFreePlayMenu");
			}
			
		break;
		
		
		//Quit pop up window
		case PopUpWindow.QUIT:
			muteGUI = true;
			GUI.Box( popUpPos, "\n\nAre you sure you want to quit? \n\n ( All unsaved changes will be lost )", containerStyle );
			if( GUI.Button( popUpButtonLPos, "Cancel", buttonStyle ) )
				popUpWindow = PopUpWindow.NONE;
			if( GUI.Button( popUpButtonRPos, "Quit", buttonStyle ) )
				Application.LoadLevel("_NewFreePlayMenu");
		break;

		//Tutorial
		case PopUpWindow.TUTORIAL:
				muteGUI = true;
			
				GUI.Box( popUpPos, "", containerStyle );
				var tutString = tutorialNode["page"][tutorialIndex]["_text"];
				GUI.Box( popUpPos, tutString, containerStyle );
				
				if (tutorialNode["page"].length <= 1)
				{
					tutorialInstructionsAll = true;
				}
				
				if( tutorialInstructionsAll && GUI.Button( Rect(popUpPos.x + popUpPos.width/2 - 64, popUpPos.y+popUpPos.height-64, 128, 48), "Close", buttonStyle ) )
					popUpWindow = PopUpWindow.NONE;
					
				if( tutorialIndex > 0 && MuteButton( Rect(popUpPos.x + popUpPos.width/2 - 160, popUpPos.y+popUpPos.height-64, 64, 48), "", buttonStyle, prevIcon, "Previous Page" ) )			
					tutorialIndex--;	
					
				if( tutorialIndex < (tutorialNode["page"].length - 1) && MuteButton( Rect(popUpPos.x + popUpPos.width/2 + 96, popUpPos.y+popUpPos.height-64, 64, 48), "", buttonStyle, nextIcon, "Next Page" ) )
				{			
					tutorialIndex++;
					if(tutorialIndex == tutorialNode["page"].length - 1)
						tutorialInstructionsAll = true;
				}
				
				//move the highlighter
				try
				{
					var rectNode = tutorialNode["page"][tutorialIndex]["rect"][0];
					highlightTargetRect = Rect(parseInt(rectNode["@x"]),parseInt(rectNode["@y"]),parseInt(rectNode["@w"]),parseInt(rectNode["@h"]));
				}
				catch(e) //otherwise hide the highlighter
				{
					//Debug.Log(e);
					highlightTargetRect = Rect(-1,-1,1,1);
				}
				
			break;
	}
}




/**
* This function draws a button in a way suitable for the editor GUI
*/
function button( pos : Rect, str : String, style : GUIStyle, info : String ){
	
	if( !muteGUI ){
		if( pos.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y)) )
			mouseTimer.ShowInfoString( info );
		return GUI.Button( pos, str, style );
	}else{
		GUI.Label( pos, str, style );
		return false;
	}
	
}

function button( pos : Rect, con : GUIContent, style : GUIStyle){
	
	if( !muteGUI ){
		if( pos.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y)) )
			mouseTimer.ShowInfoString( "" );
		return GUI.Button( pos, con, style );
	}else{
		GUI.Label( pos, con, style );
		return false;
	}
	
}

function MuteButton( pos : Rect, text : String, style : GUIStyle, image : Texture2D, info : String ){

	if( true ){
		if( pos.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y)) )
			mouseTimer.ShowInfoString( info );
		var r = GUI.Button( pos, text, style );
		if( image != null )
			GUI.DrawTexture( pos, image, ScaleMode.ScaleToFit );
		return r;
	}else{
		GUI.Label( pos, text, style );
		if( image != null )
			GUI.DrawTexture( pos, image, ScaleMode.ScaleToFit );
		return false;
	}
}








