//#pragma strict

var dm : DataManager;
//GUIStyles
public var botErrorStyle : GUIStyle;
public var containerStyle : GUIStyle;
public var containerGlowStyle : GUIStyle;
public var containerLabelStyle : GUIStyle;
public var containerHeadingStyle : GUIStyle;
public var highlighterStyle : GUIStyle;
public var codeLabelStyle : GUIStyle;
public var commandElmStyle : GUIStyle;
public var commandTxtStyle : GUIStyle;
public var paramTxtStyle : GUIStyle;
public var infoStyle : GUIStyle;
public var scrollStyle : GUISkin;
public var editFuncStyle : GUIStyle;
public var blackImg : Texture2D;
public var commandElementImg : Texture2D;

//GUI Button styles
public var controlButton : GUIStyle;
public var popUpButton : GUIStyle;
public var screenButton : GUIStyle;
public var winPopUpButton : GUIStyle;
public var resetIcon : Texture2D;
public var playIcon : Texture2D;
public var stepIcon : Texture2D;
public var cameraIcon : Texture2D;
public var cameraUpIcon : Texture2D;
public var cameraRightIcon : Texture2D;
public var cameraDownIcon : Texture2D;
public var cameraLeftIcon : Texture2D;
public var zoomIcon : Texture2D;
public var zoomInIcon : Texture2D;
public var zoomOutIcon : Texture2D;
public var trashCanIcon : Texture2D;
public var exitIcon : Texture2D;
public var prevIcon : Texture2D;
public var nextIcon : Texture2D;
public var helpIcon : Texture2D;

//Param element textures
public var paramVarSlotImg : Texture2D;
public var paramValSlotImg : Texture2D;
public var paramCndSlotImg : Texture2D;
public var paramBotSlotImg : Texture2D;
public var paramVarImg : Texture2D;
public var paramCndImg : Texture2D;
public var paramBotImg : Texture2D;

//Screen variables
public var toolboxWidth : int;
public var codeWidth : int;
private var screenX : int;
private var screenY : int;

//Screen positions
private var toolboxRect : Rect;
private var codeRect : Rect;
private var cornerRect : Rect;
private var resetButtonRect : Rect;
private var playButtonRect : Rect;
private var stepButtonRect : Rect;
private var commandCountRect : Rect;
private var commandCountMedalRect : Rect;
private var medalRect : Rect;
private var codeLabelRect : Rect;
private var popUpRect : Rect;
private var defaultPopUpRect : Rect;
private var lowPopUpRect : Rect;
private var varStatusRect : Rect;

//Mouse
static var mousePos : Vector2;
@HideInInspector public var mouseElement : CodeElement;
@HideInInspector public var mouseOnElement : CommandElement;
@HideInInspector public var mouseOnParamIndex : int;
static var mouseOnCamera : boolean;
private var newCodePos : int;
private var oldMouseElement : CodeElement;
private var doubleClickTimer : float;
private var oldCodePos : int;
private var clickedOnButton : boolean = false;

//Bot selected
@HideInInspector public var botObj : GameObject;
@HideInInspector public var botVar : Bot;
@HideInInspector public var botPointer : Texture2D;
private var glowColor : Color;
private var codeTitle : String;
private var isPlaying : boolean;
private var isQuitting : boolean = false;
private var isQuittingTut : boolean = false;
private var isSubmitting : boolean = false;
public var botFlag : Texture2D;
public var botExclaimation : Texture2D;

//Code and scrollbar
@HideInInspector var codeScrollPosF : float;
@HideInInspector var codeInWindow : int;

//Toolboxes
public static final var TAB_WIDTH : int = 112;
public static final var TAB_HEIGHT : int = 32;
private var toolboxTab : List.<TabElement>;
private var toolboxCmd : CodeElement[];
public var actionCmd : CommandElement[];
public var controlCmd : CommandElement[];
public var variableCmd : ParamElement[];
public var parameterCmd : ParamElement[];
public var functionCmd : CommandElement[];

//Code
@HideInInspector public var tabIndex : int;
@HideInInspector public var codeIndentList : List.<int>;
@HideInInspector public var maxCodeWidth : int;
@HideInInspector public var mouseOnCode : boolean;    //To be set by code elements
@HideInInspector public var canEditCode : boolean;
@HideInInspector public var muteGUI : boolean;
@HideInInspector public var maxProgramLength : int;
@HideInInspector public var commandCount : int = 0;
public var codePointer : Texture2D;
public var codeErrorPointer : Texture2D;
public var codeWinPointer : Texture2D;
private var lockScrollToPointer : boolean;

//Function effects
public var functionBot : GameObject;
public var editFuncWires : Texture2D;
public var funcPointer : Texture2D;
private var funcYPos : float;
private var oldFuncElm : CommandElement;


//Popup
enum PopUpType { WIN, DESTROY_CODE, EXIT, CANT_EDIT, TUTORIAL, PROG_EDIT_SAVE, PROG_EDIT_NAME }
public var winImg : Texture2D;

public var bronzeImg : Texture2D;
public var silverImg : Texture2D;
public var goldImg : Texture2D;
public var platImg : Texture2D;

private var popUpActive : boolean = false;
private var popUpType : PopUpType;
private var popUpRat : float;

//TutorialPopup
var tutorialIndex = 0;
var tutorialNode : XMLNode;
var tutorialInstructionsAll = false;

var highlightRect : Rect = Rect(-1,-1,1,1);
var highlightTargetRect : Rect = Rect(-1,-1,1,1);


//Other classes
private var timer : WorldTimer;
private var mouseTimer : MouseTimer;


//Code Annotation 
public var codeAnnotationActive : boolean = false;
public var annotationStep : int = 0;
private var annotationList : List.<CodeAnnotation>;
public var firstMouseClickValue : int;
public var secondMouseClickValue : int;
public var diagramName : String = "a";
public var listOfDiagramNames = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
public var listOfDiagrams : List.<CodeAnnotation>;
public var numOfDiagrams : int = -1;
public var targetDiagram : int = -1;
public var startEndDone : boolean = false;
public var scrollCAM : Vector2 = Vector2.zero;

//Stupid Disorganized Level Editor Stuff
var levelname = "My New Level";

//Essentially a singleton get
static var instance : GUIManager;
static function Get () : GUIManager{
	if( instance == null )
		try{
			instance = GameObject.Find("GameManager").GetComponent(GUIManager);
		}catch(error){
			Debug.LogError("Cound not find GameManagers object with GUIManager Component");
		}
	return instance;
}
function Awake () {
	Debug.Log("I have awoken");
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
	instance = this;
}




//Setup
function Start () {
	Debug.Log("I have started");
	ResizeScreen();
	timer = WorldTimer().GetInstance();
	timer.Reset(null);
	mouseTimer = MouseTimer.Get();
	mouseTimer.setStyle( infoStyle );
	oldCodePos = -1;
	canEditCode = true;
	muteGUI = false;
	
	//setup code annotation widget
	getDiagramCount(); //for now - later will be incrementNumOfDiagram();
	listOfDiagrams = new List.<CodeAnnotation>();
	for(var anno_i = 0; anno_i < listOfDiagramNames.length; anno_i++)
	{
		var new_diagram = new CodeAnnotation(-1, -1, listOfDiagramNames[anno_i]);
		listOfDiagrams.Add(new_diagram);
	}
	Debug.Log("setting up list of diagrams");
	
	//Color the command elements
	for( e in actionCmd )
		if( e && e.color.Equals(Color(0,0,0,0)) )
			e.ColorSet( Color(0,1,1,1) );
	for( e in controlCmd )
		if( e && e.color.Equals(Color(0,0,0,0)) )
			e.ColorSet( Color(0,1,0,1) );
	for( e in variableCmd )
		if( e && e.color.Equals(Color(0,0,0,0)) )
			e.ColorSet( Color(1,0,0,1) );
	for( e in parameterCmd )
		if( e && e.color.Equals(Color(0,0,0,0)) )
			e.ColorSet( Color(1,1,0,1) );
	for( e in functionCmd )
		if( e && e.color.Equals(Color(0,0,0,0)) )
			e.ColorSet( Color(1,0.6,0.2,1) );
			
	//Set up the toolbox tabs
	tabIndex = 0;
	toolboxTab = new List.<TabElement>();
	var actionTab = new TabElement(actionCmd,"Action");
	actionTab.description = "Action commands will make the bot physically do something such as move around, rotate, or interact with the environment.";
	toolboxTab.Add( actionTab );
	var controlTab = new TabElement(controlCmd,"Control");
	controlTab.description = "Control commands change the way your code is run using logic, variables, and flags.";
	toolboxTab.Add( controlTab );
	var functionsTab = new TabElement(functionCmd,"Functions");
	functionsTab.description = "Function commands will call a set series of other commands. Use functions when you have code that you want to repeat in different places. Functions can also call themselves or other functions.";
	toolboxTab.Add( functionsTab );
	var variableTab = new TabElement(variableCmd,"Variables");
	variableTab.description = "Variables represent changeable values. Use variables in your code to make logic work. Variables start with a value of 0, but you can use control commands to change the values stored in variables.";
	toolboxTab.Add( variableTab );
	var paramTab = new TabElement(parameterCmd,"Parameters");
	paramTab.description = "Parameters tell commands to do specific things. Match parameters to the slots in control commands to form logic and specifics.";
	toolboxTab.Add( paramTab );
	
	//Set up the toolbox
	toolboxCmd = toolboxTab[0].cmd;
	var temp : Vector2;
	
	Variables.Get().reset();
	
	botObj = WorldManager.botsList[0].obj;
	botVar = botObj.GetComponent( Bot );
	indentCode();
	
	//show the tutorial box
	if(dm.gameplayMode == "campaign" && true) //TODO: check for real tut instructions
	{
		SetupTutorialInstructions();
		if(tutorialNode && tutorialNode != null)
		{
			tutorialIndex = 0;
			ActivatePopUp(PopUpType.TUTORIAL);
		}
	}
	
	if(dm.gameplayMode == "progEdit" && true) //TODO: add dm.needsTutorial
	{
		SetupTutorialInstructions();
		if(tutorialNode && tutorialNode != null)
		{
			tutorialIndex = 0;
			ActivatePopUp(PopUpType.TUTORIAL);
		}
	}
}

function SetupTutorialInstructions()
{
	var myNode : XMLNode;
	if(dm.gameplayMode == "progEdit")
	{
		try {myNode = dm.GetProgEditorNode()["tutorialtext"][0];
		tutorialNode = myNode;}
		catch(e){ Debug.Log(e); tutorialNode = null;}
	}
	else
	{
		try {myNode = dm.GetLevelNode()["tutorialtext"][0];
		tutorialNode = myNode;}
		catch(e){ tutorialNode = null;
		}
	}
}

//function to deal with quitting b/c coroutines
function Quit() {
//quit?
		if(!dm.IsBusy() && isSubmitting)
		{
			var XML = WorldManager.worldToString(true);
			Debug.Log(XML);
			
			//so we only do this once or everything gets all stupid
			if(dm.WordFilter(levelname))
					levelname = "My New Level!";
					
			dm.SubmitLevel(levelname, "Made in program editor", XML); // calls the data manager
			isSubmitting = false;
		}
		
		if(!dm.IsBusy() && isQuitting)
		{
			if(dm.gameplayMode != "campaign" || isQuittingTut)
				Application.LoadLevel("_NewFreePlayMenu");
				//Application.LoadLevel("Start");
			else
				Application.LoadLevel("Tutorial");
		}
}

//Run the GUI Manager
function Update () {

	//Update cursor position
	mousePos = Vector2( Input.mousePosition.x, Screen.height-Input.mousePosition.y );
	
	//Check if the mouse is over the camera
	mouseOnCamera = ( mousePos.x > codeWidth && mousePos.y > toolboxWidth+TAB_HEIGHT );
	

	//Resize the screen if needs be
	if( screenX != Screen.width || screenY != Screen.height )
		ResizeScreen();
		
	if(isQuitting)
		Quit();
		
	return;	
}

//Draw the GUI
function OnGUI () {
	//Debug.Log(dm.interactionLogContents);
	GUI.depth = 1;
	
	//quit?
	if(isQuitting)
	{
		//Application.LoadLevel("_NewFreePlayMenu");
		dm.DrawLoadingScreen();
		return;
	}
	
	//Selecting a bot
	if( mouseElement == null && !mouseOnCode && !muteGUI && !clickedOnButton )
		if( mouseOnCamera ){
			var botAt = Bot.BotAt(mousePos);
			if( botAt != null ){
				if( botAt.GetComponent(Bot) != null ){
					MouseTimer.ShowInfoString(botAt.GetComponent(Bot).botName );
					if( Input.GetButtonDown("Fire1") ){
						botObj = botAt;
						botVar = botObj.GetComponent( Bot );
						indentCode();
					}
				}
			}else{
				if( Input.GetButtonDown("Fire1") && mousePos.x > maxCodeWidth )
					Debug.Log("open nothing");
					//botVar = null;
					//TODO: Can close a robot's program, but I don't know why that would be good...
			}
		}
	if( !Input.GetButtonDown("Fire1") )
		clickedOnButton = false;
	
	
	//Draw the toolbar tabs
	for( var tabI : int = 0; tabI < toolboxTab.Count; tabI++ )
		DrawToolboxTab(tabI);
		
	//Code BG
	GUI.DrawTexture(Rect(0,0,codeWidth,Screen.height),blackImg);
	
	//If a bot is selected
	if( botVar != null ){
	
	
	
		//Draw the code background
		if( botVar.program.Count == 0 ){
				var emptyCodeString = "Drag a command here to add it to the " + botVar.botName + " program.";
				if( isPlaying )
					emptyCodeString = "Reset the program to edit the " + botVar.botName + " code.";	
				GUI.Box( codeRect, emptyCodeString, containerStyle );
		}else{
			GUI.Box( codeRect, "", containerStyle );
		}
		
		//Draw the scroll bar system
		if( codeInWindow <= botVar.program.Count ){
			GUI.skin = scrollStyle;
			var oldScrollPos = codeScrollPosF;
			codeScrollPosF = GUI.VerticalScrollbar( Rect(0,toolboxWidth+32,24,Screen.height-toolboxWidth-64), codeScrollPosF, codeInWindow, botVar.program.Count, 0-0.5 );
			
			//Mouse wheel scrolling
			
			if( !mouseOnCamera ){
				codeScrollPosF += Input.GetAxis( "Mouse ScrollWheel" );
			}
			if( codeScrollPosF != oldScrollPos )
				lockScrollToPointer = false;
				
		}
		
		//Adjust the color glow
		if( glowColor.a == 0 ){
			glowColor.r = botVar.color.r;
			glowColor.g = botVar.color.g;
			glowColor.b = botVar.color.b;
		}else{
			glowColor.r += (botVar.color.r-glowColor.r)*0.05;
			glowColor.g += (botVar.color.g-glowColor.g)*0.05;
			glowColor.b += (botVar.color.b-glowColor.b)*0.05;
		}
		glowColor.a = Mathf.MoveTowards( glowColor.a, 1, 2*Time.deltaTime );
		codeTitle = botVar.botName;
		
		
		
		
		
		
	}else{
		GUI.Box( codeRect, "Click on a bot in the scene to program it.", containerStyle );
		glowColor.a = Mathf.MoveTowards( glowColor.a, 0, 2*Time.deltaTime );
	}
	
	//Draw the code glow
	GUI.color = glowColor;
	GUI.Box( codeRect, "", containerGlowStyle );
	GUI.color = Color.white;
	
	//Draw the code
	mouseOnCode = false;
	mouseOnElement = null;
	mouseOnParamIndex = -1;
	if( botVar != null && !codeAnnotationActive)
	{
		DrawCode();
	}
	else if (botVar != null)
	{
		drawCodeAnnotation ();
	}
	
	//Draw the toolbox
	GUI.DrawTexture(Rect(0,0,Screen.width,toolboxWidth),blackImg);
	GUI.Box( toolboxRect, "", containerStyle );
	for( e in toolboxCmd ){
		if( e && e.Draw() ){
			if( doubleClickTimer <= 0 ){
				mouseElement = e.Clone();
				doubleClickTimer = 0.5;
			}else{
				if( canEditCode ){
					if( botVar != null && e.getCodeType() == CodeType.COMMAND ){
					 	var ee : CodeElement = e.Clone();
					 	//dm.CreateLog("ADD CODE " + botVar.botName + ", " + ee.getName() + ", " + botVar.program.Count);
					 	//ee.setIndex(botVar.program.Count);
					 	AddCodeElement(ee,botVar.program.Count);
					 	//log here
					 	ee.setPos( e.getPos() );
					 	if( codeInWindow < botVar.program.Count )
							codeScrollPosF = 0;
					}
					doubleClickTimer = 0;
				}else{
					ActivatePopUp( PopUpType.CANT_EDIT );
				}
			}
		}
	}
	if( doubleClickTimer > 0 )
		doubleClickTimer -= Time.deltaTime;
		
	//Play button
	GUI.Box( cornerRect, "", containerStyle  );
	if( !timer.hasWon && !timer.playing ){
		if( Button( playButtonRect, "", controlButton, playIcon, "Run all bot programs until they are finished." ) && maxProgramLength > 0  && !codeAnnotationActive){
			timer.Play();
			dm.CreateLog("PLAY");
			canEditCode = false;
			isPlaying = true;
			lockScrollToPointer = true;
			ColorAllCode( CodeColorType.GRAY );
		}
	}else{
		GUI.DrawTexture( playButtonRect, controlButton.active.background );
		GUI.DrawTexture( playButtonRect, playIcon );
	}
	
	//Step button
	if( !timer.hasWon && !timer.playing){
		if( Button( stepButtonRect, "", controlButton, stepIcon, "Step all bot programs forward by one command." ) && maxProgramLength > 0  && !codeAnnotationActive){
			timer.Step();
			dm.CreateLog("STEP");
			canEditCode = false;
			isPlaying = true;
			lockScrollToPointer = true;
			ColorAllCode( CodeColorType.GRAY );
		}
	}else{
		GUI.DrawTexture( stepButtonRect, controlButton.active.background );
		GUI.DrawTexture( stepButtonRect, stepIcon );
	}
	
	//Reset button
	if( isPlaying && ! codeAnnotationActive){
		if( Button( resetButtonRect, "", controlButton, resetIcon, "Reset all bot programs to their beginning for editing." ) ){
		    dm.CreateLog("RESET");
		    Debug.Log("Logged");
		    Debug.Log("Submitted");
			ResetProgram();
			Debug.Log("Resetted");		
		}
	}else{
		GUI.DrawTexture( resetButtonRect, controlButton.active.background );
		GUI.DrawTexture( resetButtonRect, resetIcon );
	}
	
	
	//Camera buttons
	GUI.DrawTexture( Rect(Screen.width-80,Screen.height-80,32,32), cameraIcon );
	if( Button( Rect(Screen.width-80,Screen.height-112,32,32), "", screenButton, cameraUpIcon, "Move the camera up." ) )
		WorldCamera.targAngleX = Mathf.Floor((WorldCamera.targAngleX - 20)/20)*20;
	if( Button( Rect(Screen.width-48,Screen.height-80,32,32), "", screenButton, cameraRightIcon, "Move the camera right." ) )
		WorldCamera.targAngleY = Mathf.Floor((WorldCamera.targAngleY - 45)/45)*45;
	if( Button( Rect(Screen.width-80,Screen.height-48,32,32), "", screenButton, cameraDownIcon, "Move the camera down." ) )
		WorldCamera.targAngleX = Mathf.Floor((WorldCamera.targAngleX + 20)/20)*20;
	if( Button( Rect(Screen.width-112,Screen.height-80,32,32), "", screenButton, cameraLeftIcon, "Move the camera left." ) )
		WorldCamera.targAngleY = Mathf.Floor((WorldCamera.targAngleY + 45)/45)*45;
		
	//Zoom buttons
	GUI.DrawTexture( Rect(Screen.width-48,Screen.height-208,32,32), zoomIcon );
	if( Button( Rect(Screen.width-48,Screen.height-240,32,32), "", screenButton, zoomInIcon, "Zoom in." ) )
		WorldCamera.targDistance -= 4;
	if( Button( Rect(Screen.width-48,Screen.height-176,32,32), "", screenButton, zoomOutIcon, "Zoom out." ) )
		WorldCamera.targDistance += 4;
					
	//Exit button
	if( Button( Rect(Screen.width-48,16,32,32), "", screenButton, exitIcon, "Quit to the main menu." ) )
	{
		dm.CreateLog("QUIT");
		ActivatePopUp( PopUpType.EXIT );
	}
	

	//Help button
	if( dm.gameplayMode == "campaign" && tutorialNode != null && Button( Rect(Screen.width-48,toolboxWidth+16,32,32), "", screenButton, helpIcon, "Open the tutorial." ) )
	{
		ActivatePopUp( PopUpType.TUTORIAL );
	}

	//Code Annotation Mode Button 
	//Check if Admin, playing
	if(dm.user.isAdmin == 1 && !isPlaying) {
		var annotationToggle : String = "Annotation Off";
		if(codeAnnotationActive){
			annotationToggle = "Annotation On";

			canEditCode = false;
			
			//adding buttons for the diagrams with the respectable start and end values	
			//adding the button for the first diagrams
			//if both start and end have changed, then a new label is necessary
			//creating scrollview
			scrollCAM = GUI.BeginScrollView (Rect (Screen.width-140, toolboxWidth + 90, 120, 200), scrollCAM, Rect (0, 0, 100, 32 * 26));
			
			//loop to create the correct amount of buttons for the diagrams that were made - default = 3 diagrams.
			for(var a = 0; a < listOfDiagrams.Count; a++){	
				
				var my_diagram = listOfDiagrams[a];
				//if I have set the annotation, draw a button which show the appropriate lines
				//otherwise, draw a button which shows ? - ?
				if (my_diagram.start != -1)
				{
					if (GUI.Button (Rect (0, 0 + (35 * a), 60 ,32), my_diagram.diagram + ": " + my_diagram.start + " - " + my_diagram.end, popUpButton))
					{
						annotationStep = 1;
						targetDiagram = a;
					}
				}
				else if (annotationStep == 0 && GUI.Button (Rect (0, 0 + (35 * a), 60 ,32), my_diagram.diagram + ": ? - ?", popUpButton))
				{
					annotationStep = 1;
					targetDiagram = a;
				}
				else if (annotationStep != 0)
				{
					if (my_diagram.start != -1)
						GUI.Label (Rect (0, 0 + (35 * a), 60 ,32), my_diagram.diagram + ": " + my_diagram.start + " - " + my_diagram.end, popUpButton);
					else
						GUI.Label (Rect (0, 0 + (35 * a), 60 ,32), my_diagram.diagram + ": ? - ?", popUpButton);
				}
			}
			
			//wnding the scrollview
			GUI.EndScrollView();
		}
		
		if (!codeAnnotationActive)
			startEndDone = false;
		
		//Code Annotation Mode button
		//TODO: Complete this feature
		if( false && GUI.Button (Rect (Screen.width-170, toolboxWidth+55, 167,32), annotationToggle, popUpButton)) {
		
			//Disable the function of being able to drag or click the code blocks - toggles
			codeAnnotationActive = !codeAnnotationActive;
			//annotationStep = 1; // will need to do this when a DIAGRAM is clicked instead, once you add those in
			firstMouseClickValue = -1;
			secondMouseClickValue = -1;
			if(!codeAnnotationActive && !canEditCode){
				canEditCode = true;	
			}
			
		}
	}
	

	//Command count
	GUI.Box( commandCountRect, "", containerStyle );
	if(dm.gameplayMode != "progEdit")
	{
		var scoreString = "Commands Used: " + commandCount;
		if (dm.selectedLevel.hiscore && dm.selectedLevel.hiscore > 0)
		{
			if((dm.selectedLevel.hiscore * 2) < commandCount)
			{
				scoreString = "Commands: " + commandCount;// + '\n' + "Bronze: Solve";
				GUI.DrawTexture( medalRect, bronzeImg );
				GUI.Box( medalRect, dm.selectedLevel.hiscore * 2 + "+", containerLabelStyle);
			}
			
			if ((dm.selectedLevel.hiscore * 2) >= commandCount)
			{
				scoreString = "Commands: " + commandCount;// + '\n' + "Silver:" + dm.selectedLevel.hiscore; ; //silver
				
				GUI.DrawTexture( medalRect, silverImg );
				GUI.Box( medalRect, dm.selectedLevel.hiscore * 2 + "", containerLabelStyle);
			}
			
			if ((dm.selectedLevel.hiscore * 1.5) >= commandCount)
			{
				scoreString = "Commands: " + commandCount;// + '\n' + "Gold:" + dm.selectedLevel.hiscore * 1.5; ; //gold
				
				GUI.DrawTexture( medalRect, goldImg );
				GUI.Box( medalRect, Mathf.FloorToInt(dm.selectedLevel.hiscore * 1.5) + "", containerLabelStyle);
			}
			
			if (commandCount <= dm.selectedLevel.hiscore)
			{
				scoreString = "Commands: " + commandCount;// + '\n' + "Platinum:" + dm.selectedLevel.hiscore;
				
				GUI.DrawTexture( medalRect, platImg );
				GUI.Box( medalRect, dm.selectedLevel.hiscore + "", containerLabelStyle); 
			}
		}
		
		GUI.Box( commandCountMedalRect, scoreString, containerLabelStyle );
		
		
		if( commandCountMedalRect.Contains( mousePos ) )
		MouseTimer.ShowInfoString( "This is the total number of commands that you have written to solve this level. The lower this number is, the more efficient you are as a programmer. \n\n Use functions, flags, and variables to lower your command count." );

	}
	else
	{
		GUI.Box( commandCountRect, "Commands Left:  " + (25 - commandCount), containerLabelStyle );
		if( commandCountRect.Contains( mousePos ) )
		MouseTimer.ShowInfoString( "This is the total number of commands that you have remaining to build the level. Use functions, flags, and variables to lower your command count." );

	}
		
	//Variable status?
	var label = "";
	var lines = 0;
	for( e in variableCmd )
	{
		if(Variables.Get().getVal(e.name) == 0) 
			continue;
		if(lines > 0)
			label += '\n';
		label += e.name + ": " + Variables.Get().getVal(e.name);
		lines += 1;
	}
	if (lines > 0)
	{
		//varStatusRect = Rect( codeWidth + 4, toolboxWidth + 36, 48, 48 + (16 * (lines - 1)));
	    //mobile version
	    var varBoxX = botVar.program[botVar.mainPointer].getPos().x + 104;
	    var varBoxY = botVar.program[botVar.mainPointer].getPos().y - 24;;
	    varStatusRect = Rect(varBoxX, varBoxY, 48, 48 + (16 * (lines - 1)));

		GUI.Box( varStatusRect, "", containerStyle );
		GUI.Box( varStatusRect, label, containerLabelStyle );
		if( varStatusRect.Contains( mousePos ) )
			MouseTimer.ShowInfoString( "This window shows the current value of all the variables being used by your robots. These values will reset to zero when the program is restarted." );
	}
	
		
	//Add a title label to the code
	GUILayout.BeginArea(codeLabelRect);
		GUI.Box( Rect(0,0,codeLabelRect.width,codeLabelRect.height), "No code selected", containerLabelStyle );
		GUI.Box( Rect(0,codeLabelRect.height-codeLabelRect.height*glowColor.a,codeLabelRect.width,Screen.height), "", containerStyle );
		GUI.Box( Rect(0,codeLabelRect.height-codeLabelRect.height*glowColor.a,codeLabelRect.width - 80,codeLabelRect.height), codeTitle, containerLabelStyle );
	GUILayout.EndArea();
	
	//Close and Trash buttons
	if( botVar != null && Button( Rect((codeLabelRect.x + codeLabelRect.width) - 80, codeLabelRect.y + 8, 32, 32), "", screenButton, trashCanIcon, "Destroy this entire piece of code." ) && botVar.program.Count > 0 ){
		dm.CreateLog("TRASH " + botVar.botName );
		PrintProgramString();
		ActivatePopUp( PopUpType.DESTROY_CODE );
	}
	
	if( botVar != null && Button( Rect((codeLabelRect.x + codeLabelRect.width) - 40, codeLabelRect.y + 8, 32, 32), "", screenButton, exitIcon, "Close this program." ))
		botVar = null;

	//Redraw the selected toolbox tab
	DrawToolboxTab(tabIndex);
	
	//Control the mouse element
	newCodePos = -1;
	if( mouseElement != null ){
	
		//Position and draw
		mouseElement.setPos(mousePos);
		mouseElement.Draw();
		
		//Find new position in code (if the mouse if over the code container)
		if( botVar != null ){
			if( canEditCode ){
			
				if( mousePos.x < maxCodeWidth && mousePos.y > toolboxWidth && mouseElement.getCodeType() == CodeType.COMMAND ){
					if( codeInWindow <= botVar.program.Count ){
						newCodePos = (mousePos.y+-toolboxWidth) / ((Screen.height-toolboxWidth) / codeInWindow) + botVar.program.Count - codeScrollPosF - codeInWindow;
					}else{
						newCodePos = (mousePos.y+-toolboxWidth) / ((Screen.height-toolboxWidth) / codeInWindow);
					}
					if( newCodePos > botVar.program.Count || newCodePos < 0 )
						newCodePos = botVar.program.Count;
				}
				
				
				//Scrolling based on the position
				if( codeInWindow <= botVar.program.Count ){
					if( mousePos.y > Screen.height - 48 )
						codeScrollPosF -= Time.deltaTime;
					if( mousePos.y >= toolboxWidth && mousePos.y < toolboxWidth + 48 )
						codeScrollPosF += Time.deltaTime;
				}
			
			}else{
			
				if( !Input.GetButton("Fire1") )
					ActivatePopUp( PopUpType.CANT_EDIT );
					
			}
		
		}
		
		//Place
		if( !Input.GetButton("Fire1") || muteGUI){
			
			//Command Element
			if( mouseElement.getCodeType() == CodeType.COMMAND ){
		
				//If you can add the element to the code
				var ce : CommandElement = mouseElement;
				if( newCodePos >= 0 && !botVar.IsAnimating() ){
					AddCodeElement( ce, newCodePos );
					//botVar.ProgramSlideDownFromIndex(i);
					ce.setIndex(newCodePos);
				}else{
					//Delete the partners of control statements
					if( ce.stackOp == StackOp.PUSH){
						if( ce.partner != null ){
						    var i = botVar.program.IndexOf(ce.partner);
							RemoveCodeElement(i);
							dm.CreateLog("REMOVE PARTNER " + botVar.botName + ", " + i + ", " + ce.partner.name);
							//Update indices of other elements?					
							}
					}
					
					//Return end statments to the code
					if( ce.stackOp == StackOp.PULL && oldCodePos >= 0 ){
						AddCodeElement( ce, oldCodePos );
						dm.CreateLog("ATTEMPT DELETE " + botVar.botName + ", " + oldCodePos + ", " + ce.name);
					}
					//else if (oldCodePos >= 0){
						//dm.CreateLog("REMOVE CODE " + botVar.botName + ", " + ce.name + ", " + oldCodePos);
						//Update indices of other elements?
						//botVar.ProgramSlideUpToIndex(oldCodePos);
						//}
					
				}
				
				
			//Parameter Element
			}else{
			
				//If you can add the element to the code
				var pe : ParamElement = mouseElement;
				if( mouseOnElement != null && pe != null)
				{
					mouseOnElement.paramList[mouseOnParamIndex] = pe;	
					dm.CreateLog("ADD PARAM " + botVar.botName + ", " + mouseOnElement.getIndex() + ", " + pe.name + ", " + mouseOnParamIndex); 
				}
			
			}
			
			oldCodePos = -1;
			mouseElement = null;
			indentCode();
		}
		
	//If the mouse is not carrying anything
	}else{
		
		//Plucking a parameter from a command
		if( mouseOnElement != null ){
			if( Input.GetButtonDown("Fire1") ){
				mouseElement = mouseOnElement.paramList[mouseOnParamIndex];
				mouseOnElement.paramList[mouseOnParamIndex] = null;
				dm.CreateLog("ADD PARAM " + botVar.botName + ", " + mouseOnElement.getIndex() + ", " + mouseElement.getName() + ", " + mouseOnParamIndex); 
			}
		}
		
	}
	
	
	//Pop-Ups
	if( popUpActive ){
		popUpRat = Mathf.MoveTowards( popUpRat, 0, 2*Time.deltaTime );
		GUI.color = Color(1,1,1,(1-popUpRat)*0.25);
		GUI.DrawTexture( Rect(0,0,Screen.width,Screen.height), blackImg, ScaleMode.StretchToFill );
		GUI.color = Color.white;
		var windowRect = Rect(popUpRect.x,popUpRect.y+popUpRat*Screen.height,popUpRect.width,popUpRect.height);
		switch(popUpType){
		
		
			//old Win Pop up
			/*
			case PopUpType.WIN:
				GUI.Box( windowRect, "", containerStyle );
				GUI.Box( windowRect, "Commands Written: "+commandCount, containerLabelStyle );
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Done", winPopUpButton ) ){
					dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
					if(dm.gameplayMode != "campaign")
						{
						//Application.LoadLevel("Start");
							isQuitting = true;
						}
					else
						{
						dm.user.savestate.tutorialLevel++;
							isQuitting = true;
						}
				}
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Review", winPopUpButton ) ){
					dm.CreateLog("Review");
				    dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
					DeactivatePopUp();
				}
				GUI.DrawTexture( windowRect, winImg );
			break;*/
			
			case PopUpType.WIN:
				GUI.Box( windowRect, "", containerStyle );;
				
				//determining current award level
				//BAD CODING ALERT! TODO - don't repeat this chunk of code from above
				var myscorestring = "You beat the level in " + commandCount + " commands!";
				var encouragementString = "Try the next stage!";
				var cantpass = false;
				
				if(dm.gameplayMode == "campaign" && dm.selectedLevel.hiscore && commandCount > (dm.selectedLevel.hiscore * 2))
				{
					myscorestring  = "You earned a Bronze Medal! Use " + (dm.selectedLevel.hiscore * 2) + " or less commands to earn Silver!";
					encouragementString = "Earn at least a Silver Medal to continue.";
					cantpass = true;
				}
				else
				{
					if (commandCount > 0 && dm.selectedLevel.hiscore && dm.selectedLevel.hiscore > 0)
					{
						encouragementString = "You earned a Bronze Medal! Use " + (dm.selectedLevel.hiscore * 2) + " or less commands to earn Silver!";
						if ((dm.selectedLevel.hiscore * 2) >= commandCount)
							encouragementString = "You earned a Silver Medal! Use " + parseInt(dm.selectedLevel.hiscore * 1.5) + " or less commands to earn Gold!"; //silver
						if ((dm.selectedLevel.hiscore * 1.5) >= commandCount)
							encouragementString = "You earned a Gold Medal! Match or beat " + dm.selectedLevel.hiscore + " to earn Platinum!"; //gold
						if (commandCount <= dm.selectedLevel.hiscore)
							encouragementString = "Congratulations! You earned the Platinum Medal!"; 
					}
				}

				
				GUI.Box(windowRect, myscorestring + '\n' + encouragementString, containerLabelStyle);
				
				if(cantpass)
				{
					GUI.Box( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "X", winPopUpButton );
				}
				else if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Done", winPopUpButton ) ){
					dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
					if(dm.gameplayMode != "campaign")
						{
						//Application.LoadLevel("Start");
							isQuitting = true;
						}
					else
						{
						dm.user.savestate++;
							isQuitting = true;
						}
				}
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Review", winPopUpButton ) ){
					dm.CreateLog("Review");
				    dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
					DeactivatePopUp();
				}
				GUI.DrawTexture( windowRect, winImg );
			break;
			
			
			//Destroy Code Pop up
			case PopUpType.DESTROY_CODE:
				GUI.Box( windowRect, "", containerStyle );
				GUI.Box( windowRect, "Are you sure you want to delete all of " + botVar.botName + "'s code? \n \n \n", containerLabelStyle );
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Cancel", popUpButton ) ){
					DeactivatePopUp();
				}
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Delete", popUpButton ) ){
					dm.SubmitScore(0,commandCount,PrintProgramString(),PrintPathString());
					ResetProgram();
					botVar.program.Clear();
					indentCode();
					commandCount = Bot.GetCommandCount();
					DeactivatePopUp();
				}
			break;
			
			//Exit game Pop up
			case PopUpType.EXIT:
				GUI.Box( windowRect, "", containerStyle );
				if(dm.gameplayMode != "campaign")
					GUI.Box( windowRect, "Are you sure you want to exit the level? \n \n \n", containerLabelStyle );
				else
					GUI.Box( windowRect, "Are you sure you want to quit the tutorial? \n Progress will be lost. \n", containerLabelStyle );
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Cancel", popUpButton ) ){
					DeactivatePopUp();
				}
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Exit", popUpButton ) ){
					dm.SubmitScore(0,commandCount,PrintProgramString(),PrintPathString());
					//TODO: seems like I should wait before I exit here?
					isQuitting = true;
					if(dm.gameplayMode == "campaign")
						isQuittingTut = true;
					//Application.LoadLevel("Start");
				}
			break;
			
			case PopUpType.CANT_EDIT:
				GUI.Box( windowRect, "", containerStyle );
				var cantEditString = "You can't edit the code right now... \n \n \n";
				if( isPlaying )
					cantEditString = "You must reset the program in order to edit the code. \n (Click the reset button in the upper-left corner) \n \n";
				GUI.Box( windowRect, cantEditString, containerLabelStyle );
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 64, windowRect.y+windowRect.height-64, 128, 48), "OK", popUpButton ) ){
					DeactivatePopUp();
				}
			break;
			
			case PopUpType.PROG_EDIT_SAVE:
				windowRect = Rect(lowPopUpRect.x,lowPopUpRect.y+popUpRat*Screen.height,lowPopUpRect.width,lowPopUpRect.height);
			
				GUI.Box( windowRect, "", containerStyle );
				if (commandCount <= 25)
				{
					GUI.Box( windowRect, "Are you happy with this level?", containerHeadingStyle );	
					if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Yes, Save", winPopUpButton ) ){
						//dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
						//if(dm.gameplayMode != "campaign")
						//	{
						//	//Application.LoadLevel("Start");
						//		isQuitting = true;
						//	}
						//else
						//	{
						//	dm.user.savestate.tutorialLevel++;
						//		isQuitting = true;
						//	}
						DeactivatePopUp();
						ActivatePopUp( PopUpType.PROG_EDIT_NAME );
					}
					if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Not Yet...", winPopUpButton ) ){
						dm.CreateLog("Review");
					    dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
						DeactivatePopUp();
					}
				}
				else
				{
					GUI.Box( windowRect, "Great Work! But to save your level, you need to use less than 25 commands. Use loops and functions to make your code more efficient!", containerHeadingStyle );
					if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 24, windowRect.y+windowRect.height-64, 128, 48), "Review", winPopUpButton ) ){
						dm.CreateLog("Review");
					    dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
						DeactivatePopUp();	
						}
				}
				//GUI.DrawTexture( windowRect, winImg );
			break;
			
			case PopUpType.PROG_EDIT_NAME:
				windowRect = Rect(lowPopUpRect.x,lowPopUpRect.y+popUpRat*Screen.height,lowPopUpRect.width,lowPopUpRect.height);
			
				GUI.Box( windowRect, "", containerStyle );
				GUI.Box( windowRect, "Name this level:", containerHeadingStyle );
				
				levelname = GUI.TextField(Rect((Screen.width / 2) - 60, windowRect.y + 30, 120, 20), levelname);
					
				//GUI.Box( windowRect, "Commands Written: "+commandCount, containerLabelStyle );
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 128, 48), "Save", winPopUpButton ) ){
					
					DeactivatePopUp();
					isQuitting = true;
					isSubmitting = true;
				}
				if( GUI.Button( Rect(windowRect.x + windowRect.width/2 + 32, windowRect.y+windowRect.height-64, 128, 48), "Never Mind", winPopUpButton ) ){
					dm.CreateLog("Review");
				    dm.SubmitScore(1,commandCount,PrintProgramString(),PrintPathString());
				    levelname = "My New Level!";
					DeactivatePopUp();
				}
				//GUI.DrawTexture( windowRect, winImg );
			break;
			
			case PopUpType.TUTORIAL:
				//draw the highlighter
				DrawHighlighter();
			
				GUI.Box( windowRect, "", containerStyle );
				var tutString = tutorialNode["page"][tutorialIndex]["_text"];
				GUI.Box( windowRect, tutString, containerLabelStyle );
				
				if (tutorialNode["page"].length <= 1)
				{
					tutorialInstructionsAll = true;
				}
				
				if( tutorialInstructionsAll && GUI.Button( Rect(windowRect.x + windowRect.width/2 - 64, windowRect.y+windowRect.height-64, 128, 48), "Close", popUpButton ) )
					DeactivatePopUp();
					
				if( tutorialIndex > 0 && MuteButton( Rect(windowRect.x + windowRect.width/2 - 160, windowRect.y+windowRect.height-64, 64, 48), "", popUpButton, prevIcon, "Previous Page" ) )			
					tutorialIndex--;	
					
				if( tutorialIndex < (tutorialNode["page"].length - 1) && MuteButton( Rect(windowRect.x + windowRect.width/2 + 96, windowRect.y+windowRect.height-64, 64, 48), "", popUpButton, nextIcon, "Next Page" ) )
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
				
				//switch tabs
				try{
					var tabNode = tutorialNode["page"][tutorialIndex]["tab"][0];
					tabIndex = parseInt(tabNode["@id"]);
					toolboxCmd = toolboxTab[tabIndex].cmd;
				}
				catch(e){	
					//Don't Change!
					//tabIndex = 0;
					toolboxCmd = toolboxTab[tabIndex].cmd;
				}
				
			break;
		
	
		}
	}
	
	//Draw mouse timer info
	if( !muteGUI )
		mouseTimer.Draw();
}




//Code to activate a popup
function ActivatePopUp( type : PopUpType ){
	muteGUI = true;
	popUpActive = true;
	popUpType = type;
	popUpRat = 1;
}
function DeactivatePopUp(){
	muteGUI = false;
	popUpActive = false;
}


//Get the mouse code element
function getMouseElement() : CodeElement{
	return mouseElement;
}

//Function for updating the screen
function ResizeScreen(){
	codeInWindow = Screen.height/68;

	//Set screen positions
	Camera.main.pixelRect = Rect( codeWidth, 0, Screen.width-codeWidth, Screen.height-toolboxWidth );
	toolboxRect = Rect( codeWidth-1, 0, Screen.width-codeWidth , toolboxWidth);
	codeRect = Rect( 0, toolboxWidth-1, codeWidth, Screen.height-toolboxWidth);
	cornerRect = Rect( 0, 0, codeWidth, toolboxWidth );
	resetButtonRect = Rect( codeWidth/2-96, 12, 64, 64 );
	playButtonRect = Rect( codeWidth/2-32, 12, 64, 64 );
	stepButtonRect = Rect( codeWidth/2+32, 12, 64, 64 );
	commandCountRect = Rect( codeWidth/2-128, 80, 256, 48 );
	commandCountMedalRect = Rect( codeWidth/2-128, 80, 200, 48 );
	medalRect = Rect( codeWidth/2 + 72, 80, 48, 48 );
	varStatusRect = Rect( codeWidth + 4, toolboxWidth + 36, 256, 48 );
	codeLabelRect = Rect( 32, toolboxWidth-44, codeWidth-64, 44 );
	defaultPopUpRect = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 128, 400, 256 );
	popUpRect = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 128, 400, 256 );
	lowPopUpRect = Rect( (Screen.width)*0.5 - 200, (Screen.height) - 128, 400, 128 );
	
	//Position and set up the toolboxes
	SetUpToolbox( actionCmd, 3, 112, 192, 65 );
	SetUpToolbox( controlCmd, 3, 112, 256, 36 );
	SetUpToolbox( variableCmd, 3, 64, 96, 32 );
	SetUpToolbox( parameterCmd, 3, 64, 64, 16 );
	SetUpToolbox( functionCmd, 3, 112, 320, 65 );
	
	//initialize the stupid goddamn function thing
	for (var el : CommandElement in functionCmd)
	{
		el.funcProgram = new List.<CommandElement>();
	}
	
	//hid un-used bots
	//var newParamCmd : ParamElement[] = new ParamElement[12];
	var multibot = false;
	for (var i = 0 ; i < parameterCmd.Length; i++)
	{
		
		var el = parameterCmd[i];
		var paramBotB = false;
		for( var bt : BotType in WorldManager.botsList ){
			if( bt.obj != null ){
				
				botVar = bt.obj.GetComponent(Bot);
				if(botVar && botVar.color == el.color && WorldManager.botsList.Count > 1)
				{
					multibot = true;
					paramBotB = true;
				}
			
			}
		}
		
		if (el.type != ParameterType.BOT || paramBotB)
		{
			//Debug.Log("Ok on button " + i );
			//newParamCmd[i] = el;
		}
		else
		{
			parameterCmd[i] = null;
		}
	}
	//parameterCmd = newParamCmd;
	
	//hid un-used commands
	if(!multibot)
	{
		for (var j = 0 ; j < controlCmd.Length; j++)
		{
			if (controlCmd[j].getName().Contains("Flag"))
				controlCmd[j] = null;
			else
				Debug.Log(controlCmd[j].getName());
		}
	}
	
	screenX = Screen.width;
	screenY = Screen.height;
}

//Function for setting up a toolbox list of code elements
function SetUpToolbox( toolbox : CodeElement[], vertLayoutNum : float, startX : float, startXDist : float, incXDist : float ) {
	
	startX += codeWidth;
	var startY : float = 8 + ((toolboxWidth-16) / vertLayoutNum)/2.0;
	var incYDist : float = ((toolboxWidth-16) / vertLayoutNum);
	var pos : Vector2 = Vector2( startX, startY );
	
	for( var i : int = 0; i < toolbox.Length; i++ ){
		if(!toolbox[i])
			continue;
		toolbox[i].SetUp();
		toolbox[i].setPos(pos);
		pos.x += incXDist;
		pos.y += incYDist;
		if( pos.y > toolboxWidth ){
			pos.y = startY;
			startX += startXDist;
			pos.x = startX;
		}
	}
	
}


//Function for drawing the toolbar tabs
function DrawToolboxTab( i : int ){
	
	//Setup positions
	var areaPos : Rect = new Rect( 32+codeWidth + i*TAB_WIDTH, toolboxWidth-1, TAB_WIDTH, TAB_HEIGHT ); 
	var contPos : Rect = new Rect( 0, 0-toolboxWidth, TAB_WIDTH, toolboxWidth+TAB_HEIGHT ); 
	
	//Color based on mouse position
	GUI.color = Color( 0.7, 0.7, 0.7 );
	if( tabIndex == i )
		GUI.color = Color.white;
	if( areaPos.Contains(mousePos) && !muteGUI){
		MouseTimer.ShowInfoString(toolboxTab[i].description);
		GUI.color = Color.white;
		if( Input.GetButtonDown("Fire1") ){
			tabIndex = i;
			toolboxCmd = toolboxTab[i].cmd;
		}
	}
	
	//Draw
	GUILayout.BeginArea(areaPos);
		GUI.Box( contPos, "", containerStyle );
	GUILayout.EndArea();
	GUI.Box( areaPos, toolboxTab[i].name, containerLabelStyle );
	GUI.color = Color.white;
	
}


function ResetProgram(){

	botObj = timer.Reset(botObj);
	if( botObj != null ){
		botVar = botObj.GetComponent(Bot);
	}
	canEditCode = true;
	isPlaying = false;
	lockScrollToPointer = false;
	Variables.Get().reset();
	ColorAllCode( CodeColorType.COLOR );
	
}



//Function for drawing a bot's program in the code window
function DrawCode(){

	var x = 144;
	var targetPos : Vector2 = Vector2(0,0);
	var dist = (Screen.height-toolboxWidth) / codeInWindow;
	var startPos = toolboxWidth + 32 - (botVar.program.Count-codeInWindow)*dist;
	var i :  int = 0;
	var stack : int;
	GUILayout.BeginArea( Rect(0,0,Screen.width,Screen.height-2) );
	for( i = 0; i < botVar.program.Count; i++ ){
	
		//Calculate position
		if( codeInWindow <= botVar.program.Count ){
			targetPos = Vector2( x, startPos + i*dist + codeScrollPosF*dist );
		}else{
			targetPos = Vector2( x, toolboxWidth + 32 + i*dist );
		}
		
		//Stack stuff
		if( i < codeIndentList.Count )
			targetPos += Vector2(codeIndentList[i],0);
		
		//If the player is adding code
		if( i >= newCodePos && newCodePos >= 0 )
			targetPos += Vector2(0,dist);
			
		//Draw the code element
		botVar.program[i].setTargetPos(targetPos);
		if( botVar.program[i].Draw() && canEditCode && mousePos.y > toolboxWidth ){
			mouseElement = botVar.program[i];
			dm.CreateLog("REMOVE CODE " + botVar.botName + ", " + i + ", " + mouseElement.getName());
			//Update indices of other elements?
			oldCodePos = i;
			RemoveCodeElement(i);
		}
		
		//Draw code pointer
		if( botVar.mainPointer == i && isPlaying && botObj != functionBot ){
			GUI.color = Color.white;
			var pPos : Rect = Rect( botVar.program[i].getPos().x-128, botVar.program[i].getPos().y-24, 48, 48 );
			if( codeInWindow < botVar.program.Count && lockScrollToPointer ){
				codeScrollPosF = (botVar.program.Count - codeInWindow - i) + (codeInWindow/2.0);
				if( codeScrollPosF < 0 )
					codeScrollPosF = 0;
				if( codeScrollPosF > botVar.program.Count - codeInWindow )
					codeScrollPosF = botVar.program.Count - codeInWindow;
			}
			var pointerImg = codePointer;
			if( timer.hasWon )
				pointerImg = codeWinPointer;
			if( botVar.HasError() )
				pointerImg = codeErrorPointer;
			GUI.DrawTexture( pPos, pointerImg, ScaleMode.StretchToFill );
			
			//Drawing the current command being executed (if the pointer is on a function)
			if( botVar.program[botVar.mainPointer].isFunction ){
					GUILayout.BeginArea( Rect(botVar.program[botVar.mainPointer].getPos().x+152,botVar.program[botVar.mainPointer].getPos().y-24,48,48) );
					if( oldFuncElm != botVar.currentCmd){
						funcYPos = 72;
					}
					botVar.currentCmd.DrawIcon( Vector2(24,funcYPos) );
					if( botVar.pointer > 0 ){
						botVar.subProgram[botVar.pointer-1].DrawIcon( Vector2(24,funcYPos-48) );
					}
					funcYPos = Mathf.MoveTowards(funcYPos,24,100*Time.deltaTime);
					oldFuncElm = botVar.currentCmd;
					GUILayout.EndArea();
			}

		}
		
	}
	GUILayout.EndArea();


}


//Function for adding a code element to the bot's code
function AddCodeElement( ce : CommandElement, index : int) : boolean{
	var opSuccess : boolean = true;
	var i : int = 0;
	var stack : int = 0;
	
	
	//Count the number of commands already in the program
	var cmdCount : int = 0;
	for( var cci : CommandElement in botVar.program ){
		if( cci.stackOp != StackOp.PULL )
			cmdCount++;
	}
	if( cmdCount >= 100 && ce.stackOp != StackOp.PULL )
		return false;
	
	//If the code already has a partner
	if( ce.partner != null ){
	
		//Begining of a block
		if( ce.stackOp == StackOp.PUSH ){
		
			//Check if it's below its partner
			if( index > botVar.program.IndexOf(ce.partner) ){
				index = oldCodePos;
				
			//Check if it in the middle of another block
			}else{
				i = index;
				stack = 0;
				while( botVar.program[i] != ce.partner ){
					switch( botVar.program[i].stackOp ){
						case StackOp.PUSH:
							stack++;
						break;
						case StackOp.PULL:
							stack --;
						break;
					}
					i++;
				}
				if( stack != 0 )
					index = oldCodePos;
			}
			
		//End of a block
		}else if( ce.stackOp == StackOp.PULL ){
		
			//Check if it's above its partner
			if( index <= botVar.program.IndexOf(ce.partner) ){
				index = oldCodePos;
			
			//Check if it in the middle of another block
			}else{
				i = index-1;
				stack = 0;
				while( botVar.program[i] != ce.partner ){
					switch( botVar.program[i].stackOp ){
						case StackOp.PUSH:
							stack++;
						break;
						case StackOp.PULL:
							stack --;
						break;
					}
					i--;
				}
				if( stack != 0 )
					index = oldCodePos;
			}
			
		}
	}
		
	ce.setIndex(index);
	botVar.program.Insert(index,ce);
	botVar.ProgramSlideDownFromIndex(index);			
	dm.CreateLog("ADD CODE " + botVar.botName + ", " + index + ", " + ce.name);
	//If the new command requires an end
	if( ce.stackOp == StackOp.PUSH )
		if( ce.partner == null ){
			var eb = CommandElement.EndBlock(ce);
			eb.setPos( ce.getPos() );
			eb.setIndex(index + 1);
			AddCodeElement( eb, index+1 );
			botVar.ProgramSlideDownFromIndex(index+1);
			//dm.CreateLog("ADD CODE " + botVar.botName + ", " + ce.partner.name + ", " + index+1);
		}
		
	//Generate the indentation
	indentCode();
			
	//Move the scroller
	if( codeInWindow < botVar.program.Count )
		codeScrollPosF += 1;
		
	
	commandCount = Bot.GetCommandCount();	
	FindMaxProgramLength();
	if(opSuccess)
		botVar.ChangeIndex(index);
	return opSuccess;

}

//Function for removing a code element from a bot's code
function RemoveCodeElement( index : int ){
	botVar.ProgramSlideUpToIndex(index);
	botVar.program.RemoveAt(index);
	codeIndentList.RemoveAt(index);
	commandCount = Bot.GetCommandCount();
	FindMaxProgramLength();
}


//Function for finding the maximum bot program length
function FindMaxProgramLength(){
	maxProgramLength = 0;
	for( bot in WorldManager.botsList ){
		var botSc = bot.obj.GetComponent(Bot);
		if( botSc.program.Count > maxProgramLength )
			maxProgramLength = botSc.program.Count;
	}
}



//Function to generate code indention based on the current bot program
function indentCode(){
	maxCodeWidth = codeWidth;
	codeIndentList.Clear();
	var stack : int = 0;
	
	//Generate the indentions
	if( botVar != null )
		for( var i : int = 0; i < botVar.program.Count; i++ ){
		
			//Position
			if( botVar.program[i].stackOp == StackOp.PULL )
				stack -= 32;
			codeIndentList.Add(stack);
			if( botVar.program[i].stackOp == StackOp.PUSH )
				stack += 32;
				
			//New max code width
			if( stack + 320 > maxCodeWidth )
				maxCodeWidth = stack + 320;
			}
	
		

}


//Function to color all code differently
enum CodeColorType { COLOR, GRAY }
function ColorAllCode( c : CodeColorType ){

	for( bot in WorldManager.botsList ){
		var botSc = bot.obj.GetComponent(Bot);
			for( var ce : CodeElement in botSc.program )
				if( c == CodeColorType.COLOR ){
					ce.ColorReset();
				}else{
					ce.ColorGray();
				}
	}
	for( var element : CommandElement in functionCmd )
		for( var command : CommandElement in element.funcProgram )
			if( c == CodeColorType.COLOR ){
					command.ColorReset();
				}else{
					command.ColorGray();
				}
}

//print path
function PrintPathString() : String{
	var total_string = "";
	for(var my_bot_obj in WorldManager.botsList)
		{
			var my_bot = my_bot_obj.obj.GetComponent(Bot);
			Debug.Log(my_bot);
			total_string += my_bot.GetPath() + '\n';
		}
		return total_string;
	}
	
//print program
function PrintProgramString() : String{
	
	var total_string = "";
	for(var my_bot_obj in WorldManager.botsList)
	{
		var my_bot = my_bot_obj.obj.GetComponent(Bot);
		var functionsToPrint = new List.<CommandElement>();
		if(my_bot)
		{
			var my_string = "";
			my_string = my_bot.botName + " PROGRAM:" + '\n';
			for (var el in my_bot.program)
			{
				my_string += el.toPrettyString();
				my_string += '\n';
				
				if (el.isFunction && !functionsToPrint.Contains(el));
				{
					functionsToPrint.Add(el);
				}
			}
			total_string += my_string;
		}
	}
	
	var i = 0;
	for(i = 0; i < functionsToPrint.Count; i++)
	{
		if (i>20)
		{
			total_string += "ERROR: Too Many Recursions";
			break;
		}
	
		var my_el = functionsToPrint[i];
		
		
		if(my_el.funcProgram)
		{
			my_string = my_el.getName() + " PROGRAM:" + '\n';
			for (var el in my_el.funcProgram)
			{
				my_string += el.toPrettyString();
				my_string += '\n';
				
				if (el.isFunction && !functionsToPrint.Contains(el) && el.getName() != my_el.getName());
				{
					functionsToPrint.Add(el);
				}
			}
			total_string += my_string;
		}
	}
	
	Debug.Log(total_string);
	return total_string;
}

//Function for choosing code per diagram for code annotation mode
function drawCodeAnnotation () {
	
	//Check if in Code Annotation Mode
	for (var i = 0; i < botVar.program.Count; i++)
	{
		
		if( codeAnnotationActive && botVar.program[i].Draw()){
			
			//user clicks on first command for diagram - start, last command for diagram - end;
			if (annotationStep == 1){
				firstMouseClickValue = i;
				listOfDiagrams[targetDiagram].start = firstMouseClickValue;
				annotationStep = 2;
			} else if(annotationStep == 2){
				secondMouseClickValue = i;
				annotationStep = 0;
				startEndDone = true;
				listOfDiagrams[targetDiagram].end = secondMouseClickValue;
				firstMouseClickValue = -1;
				secondMouseClickValue = -1;
			}
		}
	}
}

/*Incrementing the Diagram Count - called when a new diagram has been created
function incrementNumOfDiagram() {
	
	//limit to 26 diagrams right now
	if (numOfDiagrams < 26) {
		
		//increasing the number of diagrams made by one.
		numOfDiagrams = numOfDiagrams + 1;
		
	} else {
		
		//pop up window that says you are using too many diagrams
		
	}
}*/

//while not incrementing the diagram count...default for my own testing
function getDiagramCount() {
	numOfDiagrams = 5;
}


//setting the diagram name
function setDiagramName() { 

	//incrementing through listOfDiagramNames to set the current one = diagramName
	for (var i = 0; i <= numOfDiagrams; i++){
		diagramName = listOfDiagramNames[i];
	}
}

function DrawHighlighter()
{
	Debug.Log("drawing highlighter");
	
	highlightRect = new Rect(Mathf.Lerp(highlightRect.x, highlightTargetRect.x, 3 * Time.deltaTime),
				 Mathf.Lerp(highlightRect.y, highlightTargetRect.y, 3 * Time.deltaTime),
				 Mathf.Lerp(highlightRect.width, highlightTargetRect.width, 3 * Time.deltaTime),
				 Mathf.Lerp(highlightRect.height, highlightTargetRect.height, 3 * Time.deltaTime));
				 		
	GUI.Box(highlightRect, "", highlighterStyle);
	
	//dodge the popUp (either to a new place or to the default place)
	if(highlightTargetRect.Overlaps(popUpRect)) //if colliding
	{
		//dodge left/right
			if(highlightTargetRect.center.x > (Screen.width / 2)){ //dodge left
				popUpRect.x = highlightTargetRect.x - (popUpRect.width + 12);
			}
			else{ //dodge right
				popUpRect.x = highlightTargetRect.x + highlightTargetRect.width + 12;
			}
		//dodge top/bot
			if(highlightTargetRect.center.y > (Screen.width / 2)){ //dodge top
				popUpRect.y = highlightTargetRect.y - (popUpRect.height + 12);
			}
			else{ //dodge bot
				popUpRect.y = highlightTargetRect.y + highlightTargetRect.height + 12;
			}
	}
	else{
		popUpRect = defaultPopUpRect;
	}		
}


//My own version of the button function
static function Button( pos : Rect, text : String, style : GUIStyle, image : Texture2D, info : String ){

	var manager = GUIManager.Get();
	if( !manager.muteGUI ){
		var r = GUI.Button( pos, text, style );
	}else{
		GUI.Label( pos, text, style );
	}
		
	if( pos.Contains(mousePos) ){
		MouseTimer.ShowInfoString( info );
		manager.clickedOnButton = true;	
	}
	if( image != null )
		GUI.DrawTexture( pos, image, ScaleMode.ScaleToFit );
	return r;
}

static function MuteButton( pos : Rect, text : String, style : GUIStyle, image : Texture2D, info : String ){

	var manager = GUIManager.Get();
	var r = GUI.Button( pos, text, style );
		
	if( pos.Contains(mousePos) ){
		MouseTimer.ShowInfoString( info );
		manager.clickedOnButton = true;	
	}
	if( image != null )
		GUI.DrawTexture( pos, image, ScaleMode.ScaleToFit );
	return r;
}


//Class for toolbox tab information
public class TabElement{
	public var cmd : CodeElement[];
	public var name : String;
	public var description : String;
	function TabElement( cmd : CodeElement[], name : String ){
		this.cmd = cmd;
		this.name = name;
	}
}


//Class for Code Annotation information
public class CodeAnnotation{
	public var start : int;
	public var end : int;
	public var annotationDescription : String;			//not currently included but for later use, a description available.
	public var diagram : String;
	function CodeAnnotation (start : int, end : int, diagram : String){
		this.start = start;
		this.end = end;
		this.diagram = diagram;
	}
}