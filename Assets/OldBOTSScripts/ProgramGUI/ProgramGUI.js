//ProgramGUI
//Displays the main gui for programming a robotisCampaignMode
//Last Modified June 5 2012 - Andrew Hicks

public var loadingScreen : Texture2D;
var solutionLoaded = false;

//****************************************************
//Campaign Mode Variables
//****************************************************
var buttonControl:int =0;
var buttonSot:int =0;
var isTutorialLevel = false;
var buttonCount:int=0;
var levelNumber :int =0;
var levelInstructions : TutorialInstructions;
var TutorialIsLoaded : boolean = false;
var programAreaNumbered: Texture2D;
var programArea: Texture2D;
var worldPreview: Texture2D;
var switchPic: Texture2D;
var weightPic: Texture2D;
var playButtonPic: Texture2D;
var commandAreaPic: Texture2D;
var turnLeftButtonPic: Texture2D;
var turnRightButtonPic: Texture2D;
var forLoopPic: Texture2D;
var stopButtonPic: Texture2D;
var stepButtonPic: Texture2D;
var trashButtonPic: Texture2D;
var functionButtonPic: Texture2D;
var functionWindowPic: Texture2D;
var forLoopWithBracketsPic: Texture2D;
var forwardPic: Texture2D;
var backwardPic: Texture2D;
var pickupActionPic: Texture2D;
var heavyBlockPic: Texture2D;
var lightBlockPic: Texture2D;
var jumpActionPic: Texture2D;
var variableExamplesPic: Texture2D;
var operatorExamplesPic: Texture2D;
var controlsExamplesPic: Texture2D;
var actionsExamplesPic: Texture2D;
var functionsExamplesPic: Texture2D;
var gameButtons: Texture2D;
var levelDisplayWindow: Texture2D;
var jumpOnHeavyBlock: Texture2D;
var numberOfCommandsPic: Texture2D;

var level1Step1: Texture2D;
var level1Step2: Texture2D;
var level1Step3: Texture2D;

var level2Step1: Texture2D;
var level2Step2: Texture2D;
var level2Step3: Texture2D;

var level3Step1: Texture2D;
var level3Step2: Texture2D;
var level3Step3: Texture2D;
var level3Step4: Texture2D;
var level3Step5: Texture2D;
var level3Step6: Texture2D;
var level3Step7: Texture2D;
var level3Step8: Texture2D;
var level3Step9: Texture2D;

var level4Step1: Texture2D;
var level4Step2: Texture2D;
var level4Step3: Texture2D;
var level4Step4: Texture2D;
var level4Step5: Texture2D;
var level4Step6: Texture2D;
var level4Step7: Texture2D;
var level4Step8: Texture2D;
var level4Step9: Texture2D;

var level5Step1: Texture2D;
var level5Step2: Texture2D;
var level5Step3: Texture2D;
var level5Step4: Texture2D;
var level5Step5: Texture2D;
var level5Step6: Texture2D;
var level5Step7: Texture2D;
var level5Step8: Texture2D;
var level5Step9: Texture2D;

var level6Step1: Texture2D;
var level6Step2: Texture2D;
var level6Step3: Texture2D;
var level6Step4: Texture2D;
var level6Step5: Texture2D;

//var level7AnswerKey: Texture2D;
//var level10AnswerKey: Texture2D;
//var level13AnswerKey: Texture2D;
//var level16AnswerKey: Texture2D;

var level9Step1: Texture2D;
var level9Step2: Texture2D;
var level9Step3: Texture2D;
var level9Step4: Texture2D;
var level9Step5: Texture2D;
var level9Step6: Texture2D;

var level12Step1: Texture2D;
var level12Step2: Texture2D;
var level12Step3: Texture2D;
var level12Step4: Texture2D;
var level12Step5: Texture2D;
var level12Step6: Texture2D;
var level12Step7: Texture2D;
var level12Step8: Texture2D;
var level12Step9: Texture2D;
var level12Step10: Texture2D;
var level12Step11: Texture2D;
var level12Step12: Texture2D;
var level12Step13: Texture2D;
var level12Step14: Texture2D;
var level12Step15: Texture2D;
var level12Step16: Texture2D;
var level12Step17: Texture2D;
var level12Step18: Texture2D;

var level15Step1: Texture2D;
var level15Step2: Texture2D;
var level15Step3: Texture2D;
var level15Step4: Texture2D;
var level15Step5: Texture2D;
var level15Step6: Texture2D;
var level15Step7: Texture2D;
var level15Step8: Texture2D;
var level15Step9: Texture2D;
var level15Step10: Texture2D;


var tutorialPicture: Texture2D;
/*static var commandArea: Texture2D;
static var programArea: Texture2D;
static var worldPreview: Texture2D;
static var switchPic: Texture2D;
static var weightPic: Texture2D;
static var playButtonPic: Texture2D;
static var commandAreaPic: Texture2D;
static var turnLeftButtonPic: Texture2D;
static var turnRightButtonPic: Texture2D;
static var forLoopPic: Texture2D;
static var stopButtonPic: Texture2D;
static var stepButtonPic: Texture2D;
static var trashButtonPic: Texture2D;
static var functionButtonPic: Texture2D;
static var functionWindowPic: Texture2D;
static var forLoopWindowPic: Texture2D;
static var forwardPic: Texture2D;
static var backwardPic: Texture2D;
static var pickupActionPic: Texture2D;
static var heavyBlockPic: Texture2D;
static var lightBlockPic: Texture2D;
static var jumpActionPic: Texture2D;
static var variableExamplesPic: Texture2D;
static var operatorExamplesPic: Texture2D;
static var controlsExamplesPic: Texture2D;
static var actionsExamplesPic: Texture2D;
static var functionsExamplesPic: Texture2D;*/



var tutorialNumber=0;
var storySectionPassed : boolean[]= new boolean[5];

var buttonPic: Texture2D;

//****************************************************
//StoryMode Variables
//var storyModeDimensionsToTrack = 2;

static var score1 = 0;
static var score2 = 0;

static var storyModeState = new ArrayList();

//0 = mission completion boolean; 1 = high score.
//var mission1: Array[storyModeDimensionsToTrack];
//var mission2: Array[storyModeDimensionsToTrack];
//var mission3: Array[storyModeDimensionsToTrack];
//var mission4: Array[storyModeDimensionsToTrack];
//var mission5: Array[storyModeDimensionsToTrack];

static var missionCompletedArray: boolean[] = new boolean[StoryMode.numOfMaps];
static var highScoreArray: int[] = new int[StoryMode.numOfMaps];

var missionCompleted = 0;//See statesMonitored.
var highScore = 1;//See statesMonitored.

static var statesMonitored = 2;//Corresponds to the number of states we're keeping track of. missionCompleted is one, highScore is one as well, total is 2 at the moment. Increase this number by one for each of the new states you add in and want to save/load.

//****************************************************



//GameState should control which GUI elements display/are active and when
//if we need to show/hide/enable/disable any part of the GUI, that should depend on GameState
//if an appropriate GameState doesn't exist, then we should create a new GameState

enum GameState {
	idle = 0,
	running = 1, //user's program is running
	submitting = 2, //submitting a level
	exiting = 3, //going back to the screen
	loading = 4, //loading the game content
	resetting = 5, //resetting the robot to his original position
	displaying = 6, //displaying a window
	stepping = 7, //robot is in the middle of a debug/step-through run
	finished = 8, //robot has reached last step and cannot run anymore
	scoring = 9 //we are submitting the level score to the server
	};

var gameState : GameState = GameState.loading;

var scrollViewVector : Vector2 = Vector2.zero;
var act0: Texture2D;  var act1: Texture2D;
var act2: Texture2D;  var act3: Texture2D;
var act4: Texture2D;  var act5: Texture2D;
var act6: Texture2D;  var act7: Texture2D;
var act8: Texture2D;  var act9: Texture2D;
var act10: Texture2D; var act11: Texture2D;
var act12: Texture2D; var act13: Texture2D;
var test: Texture2D;
var plus: Texture2D;  var minus: Texture2D;
var compGT: Texture2D;  var compLT: Texture2D;
var compEQ: Texture2D;  var plusEQ: Texture2D;
var minusEQ: Texture2D;  var equal: Texture2D;

var monitorPic: Texture2D;
var buttonSize: Vector2 = new Vector2(35, 35);
var buttonOffset : int = 865;

var ShowHighlightedStep : boolean = false;
var lastStepCompleted : boolean = true;

var helpUsedOnce : boolean = false;

// Window Indexes
var ADD_VAR  : int = 0;
var ADD_FUNC : int = 1;
var EDIT_VAR : int = 2;
var EDIT_OP  : int = 3;
var EDIT_LOOP : int = 4;
var EDIT_FUNC : int = 5;
var SHOW_INFO : int = 6;
var uniqueIDmaker : int = 0;

var actionIcon  : Texture2D;
var functionIcon: Texture2D;
var variableIcon: Texture2D;
var controlIcon : Texture2D;
var operatorIcon: Texture2D;

var winSound : AudioClip;
var errorSound : AudioClip;

var mySkin : GUISkin;
var piecesSkin: GUISkin;

var toolbarInt = 0;

var toolbarContent : GUIContent[] = new GUIContent[5];

//this is happenning
var buttons : Array;
var actionButtons = 0;
var controlButtons = 1;
var functionButtons = 2;
var variableButtons = 3;
var operatorButtons = 4;

var heldButton;// : DraggableButton; (somehow everything breaks if this is declared as such)

var mySpace : Workspace;
var funcSpaces : Array; // Workspace
var opSpaces : Array; // OperatorSpace
var loopSpaces : Array; //LoopSpace

var varValues  : Array; // Strings
var holdingVals : Array; // Strings;
var windowList : Array; // your list of window wrapper deallies

var VARIABLE_LIMIT : int;
var FUNCTION_LIMIT : int;
var funcCount : int;
var varCount  : int;

var setFuncSpace : boolean = false;
var addingVariable : boolean = false;
static var playonce : boolean = false;

public var messageContent : GUIContent;
public var messageType : String = "";

var style : String   = "actions";
var newVariableName  = "name";
var newVariableValue = "value";
var newFunctionName  = "name";
static var directions : String = "";

var showUploadWindow : boolean = false;
var showNameSameWindow : boolean = false;
var showNotSubmittableWindow : boolean = false;
var showWallpaper : boolean = false;
var levelIsSubmittable : boolean = false;
var submit : boolean = false;
var goBack : boolean = false;
var resetLevel : boolean = false;
var levelName : String = "My New Level";
var levelDescription : String = "A level made by me!";
var puzzleID : String;
var newFacing = 0;
private var pickCol : int = 0;
var myLevelNames = new Array();

var m : Material;

//materials for the space blocks
var space : Material;
var planet1 : Material;
var planet2 : Material;
var star : Material;

//materials for under sea blocks
var water : Material;
var fish : Material;
var turtle :Material;
var jellyfish : Material;

var fall : Material;
var winter : Material;
var spring : Material;
var summer : Material;
var red : Material;
var orange : Material;
var yellow : Material;
var green : Material;
var blue : Material;
var purple : Material;
private var colorArray : Array;
private var spaceArray : Array;
private var seaArray : Array;
private var seasonsArray: Array;

var tabs_group : Rect = new Rect(Screen.width*325/910,Screen.height*10/700,Screen.width*530/910,Screen.height*180/700);

//variables for mini-map camera
var levelSelect : int;

var isMaximized : boolean = false;
var cameraMM : GameObject;
var myLevel : GameObject;
var cameraSmallRect : Rect = new Rect(.01,.01,.325,.325);
var cameraBigRect : Rect = new Rect(.01,.01,.98,.98);

var myRobot : GameObject;
var levelLoaded : boolean = false;
var showLogButton : boolean = true;

//var log : String;
//var log_attempts : int;

//variables for the wallpaper
private var redL : Texture2D;
private var orangeL : Texture2D;
private var yellowL : Texture2D;
private var greenL : Texture2D;
private var blueL : Texture2D;
private var purpleL : Texture2D;

var shader : Shader;

//doubleclick timer
//used because Unity has different gui behavior between Mac and PC otherwise
var preClick: double;
var curClick: double;
var elapsedClickTime : double;
var doubleClick : boolean = false;

var postcard : boolean = false;
var pcQuestion : boolean = false;

var stickerspace = new Workspace("StickerSpace" , (Screen.width/6)+225, Screen.height/5+75, 2, 3, 150, this);

var stickers : Array = new Array();
var dragArry : Array;

var bracketsToFix :Array = new Array();
static var setNewSpawnPoint : boolean = false;
var skipLevel : boolean = false;
var iNeedTeaching : boolean = true;
static var displayInfo = true;
static var text;
static var currentPage = 0;
var usedFunction = false;
var usedForLoop = false;
//static var tutorialPictureArray = []
static var tutorialTextArray1 = ["First, Notice the buttons under the following sections of the 'Command Area': Actions, Variables, Operators, Controls, and Functions."
				,"Actions" + "\n" + "These buttons are used to position the robot. They are also used to interact with light boxes and heavy boxes."
				,"Variables" + "\n" + "These buttons are used together with Operators and Controls to complete more complex operations. Don't worry about these for now."
				,"Operators" + "\n" + "These buttons are used together with Operators and Controls to complete more complex operations. Don't worry about these for now."
				,"Controls" + "\n" + "These buttons are used together with Operators and Controls to complete more complex operations. The for loop is the only button we'll use here today."
				,"Functions" + "\n" + "Functions are named portions of code. Creating and using these will allow you to run a large number of commands multiple times without using much grid space."
				,"These buttons can be placed on the grid of the Program Area in order to control the robot, starting at the top left corner of the grid. Commands are read from left to right."
				,"The buttons in the top right corner of the screen manage the robot as well as the state of the game."
				,"The Play button" + "\n" +" This button makes the robot carry out the instructions you've given him after you've placed them all into the grid."
				,"The Step button" + "\n" +" This button makes the robot carry out one of the instructions that you've given him each time you click it, after you've placed them all into the grid."
				,"The Stop button" + "\n" +" This button stops the robot from carrying out the instructions you've given him, so you can change his instructions."
				,"The Trash button" + "\n" +" This button resets all of the instructions that you've placed onto the grid."
				,"Zooming & Panning" + "\n" + "Also note that if you scroll your mouse over the 'Level Display Window' and then slide the mouse wheel, you can zoom in and out. Clicking and dragging anywhere in this window will change your viewpoint as well."
				,"Switches" + "\n" + "The goal of each level is to place some kind of weighted object onto each switch you find on the level."
				,"Your final score is determined by the number of commands you use to solve the level. The smaller the number of commands used, the better your score! \n \n Example: A score of 17 is better than a score of 20."
				,"This level will teach you how to properly use the 'Forward' action. Follow the instructions to solve the level!"
				,"Click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the top left square on the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid, to the right of the button you placed previously."
				,"Continue to do this 7 more times, for a total of 9 times. You need to place the 'Forward' button 9 times because you need to move forward 9 spaces to reach the switch that opens the path to the next level."
				,"If you make any mistakes, click the trash button and start over. Once you're done, click the 'Play' button so the robot will carry out your instructions."
				];
				//tutorialTextArray1 = 19 lines/pages.

static var tutorialTextArray2 = ["This level will teach you how to properly use the 'Backward' action. Follow the instructions to solve the level!"
				,"Click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the top left square on the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid, to the right of the button you placed previously."
				,"Continue to do this 7 more times, for a total of 9 times. You need to place the 'Backward' button 9 times because you need to move backwards 9 spaces to reach the switch that opens the path to the next level."
				,"If you make any mistakes, click the trash button and start over. Once you're done, click the 'Play' button so the robot will carry out your instructions."
				];
				//tutorialTextArray2 = 5 lines/pages.
static var tutorialTextArray3 = ["This level will teach you how to properly use the 'Turn Left' and 'Turn Right' actions. Follow the instructions to solve the level!"
				,"Click the Actions tab in the 'Command Area' and drag 4 'Forward' buttons onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid, then click play."
				];
				//tutorialTextArray3 = 10 lines/pages.
static var tutorialTextArray4 = ["This level will teach you how to properly use the 'Jump' action. Follow the instructions to solve the level!"
				,"Click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Jump' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Jump' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag 3 'Jump' buttons onto the grid, then click play."
				];
				//tutorialTextArray4 = 10 lines/pages.
static var tutorialTextArray5 = ["This level will demonstrate how to properly use the 'PickUp/PutDown' action. Click the play button to watch the robot solve the level! When the robot is finished, click the review, then play button if you want to watch the robot solve the level again."
				/*,"Light Blocks" + "\n" + "Light blocks are blocks that you can pick up, move around, jump with, and put down in other locations. They can be used as weights to hold down the switches that you'll find placed around the level."
				,"In order to complete this level, you must pick up the light blocks and move them onto the switches on the ground. Keep in mind, the robot itself can also be used to hold down one switch."
				,"Click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Backward' buttons onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid, then click play."*/
				];
				//tutorialTextArray5 = 12 lines/pages.
static var tutorialTextArray6 = ["This level will offer you more training with the 'PickUp/PutDown' action. Follow the instructions to solve the level!"
				,"Light Blocks" + "\n" + "Light blocks are blocks that you can pick up, move around, jump with, and put down in other locations. They can be used as weights to hold down the switches that you'll find placed around the level."
				,"In order to complete this level, you must pick up the light blocks and move them onto the switches on the ground. Keep in mind, the robot itself can also be used to hold down one switch."
				,"Click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid, then click play."
				];
				//tutorialTextArray6 = 6 lines/pages.
static var tutorialTextArray7 = ["This level is your first challenge level! Attempt to solve the level on your own using everything you've learned so far!"//Challenge level, consider answer key in the form of "help" button.
				/*,"Click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid in the 'Program Area', starting at the top left corner."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Backward' buttons onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid, then click play."*/
				];
				//tutorialTextArray7 = 10 lines/pages.
static var tutorialTextArray8 = ["This level will demonstrate how to properly use the 'PickUp/PutDown' action in order to interact with 'Heavy Blocks'. Click the play button to watch the robot solve the level! When the robot is finished, click the review, then play button if you want to watch the robot solve the level again."
				/*,"Heavy Blocks" + "\n" + "Heavy blocks are blocks that you can pick up, move around, and put down in other locations. They can also be used as weights to hold down the switches that you'll find placed around the level."
				,"Heavy Blocks" + "\n" + "Heavy blocks are different though because you cannot jump with Heavy Blocks. Instead of jumping 'with' Heavy Blocks, you are allowed you to jump 'ontop' of them."
				,"In order to complete this level, you must pick up the Heavy Blocks either position them so that you can jump ontop of them to reach areas you couldn't reach before, move them onto the switches on the ground, or in some instances both. Keep in mind, the robot itself can also be used to hold down one switch."
				,"Click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 5 'Jump' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid, then click play."*/
				];
				//tutorialTextArray8 = 17 lines/pages.
static var tutorialTextArray9 = ["This level will offer you more training with the 'PickUp/PutDown' action, while interacting with 'Heavy Blocks'. Follow the instructions to solve the level!"
				,"Heavy Blocks" + "\n" + "Heavy blocks are blocks that you can pick up, move around, and put down in other locations. They can also be used as weights to hold down the switches that you'll find placed around the level."
				,"Heavy Blocks" + "\n" + "Heavy blocks are different though because you cannot jump with Heavy Blocks. Instead of jumping 'with' Heavy Blocks, you are allowed you to jump 'ontop' of them."
				,"In order to complete this level, you must pick up the Heavy Blocks either position them so that you can jump ontop of them to reach areas you couldn't reach before, move them onto the switches on the ground, or in some instances both. Keep in mind, the robot itself can also be used to hold down one switch."
				,"Click the Actions tab in the 'Command Area' and drag 5 'Forward' buttons onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 4 'Jump' buttons onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid, then click play."
				];
				//tutorialTextArray9 = 7 lines/pages.
static var tutorialTextArray10 = ["I hope you're ready for your next challenge level! Attempt to solve the level on your own using everything you've learned so far!"//Challenge level, consider answer key in the form of "help" button.
				/*,"Click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the 'Program Area', starting at the top left corner."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid, then click play."*/
				];
				//tutorialTextArray10 = 14 lines/pages.
static var tutorialTextArray11 = ["This level will demonstrate how to properly use the 'For Loop' control. Click the play button to watch the robot solve the level! When the robot is finished, click the review, then play button if you want to watch the robot solve the level again."
				/*,"Click the Controls tab in the 'Command Area' and drag the 'for' button, which represents the 'For Loop' Declaration, onto the grid in the 'Program Area'."
				,"You will notice that when you use the For Loop control, an open and close bracket surround the next grid position. This happens because the for loop control's function is to repeat the commands that come after the 'For Loop' Declaration."
				,"So, any time you want to repeat a set of Actions, you must first use the 'for' Control."
				,"By default, you can only place one action inside of a 'For Loop', but by dragging the right bracket of the for loop to the right of any square on the grid, you can increase the number of Actions that will be included in the loop. All actions that lie between the 2 brackets after the 'For Loop' Declaration will be included in the loop."
				,"For this level, you only need to place one action inside of each set of 'For Loop' brackets."
				,"Additionally, each 'For Loop' Declaration must have various options set so that the robot knows how many times to repeat the actions between the brackets."
				,"To edit these options, double click the 'for' button that you've already placed on the grid. A window will appear that is titled 'Edit For Loop', and there are 3 Statements under the title."
				,"In the first statement, 'var = 0', 'var' stands for Variable; '=' stands for Equal to; and 0 is an Integer."
				,"'var = 0' refers to the number that the robot will start counting 'from'. So, if var = 0, then the Variable that the bot will start counting from is set Equal To the Integer 0."
				,"The second statement, 'var < 6', is very similar to the first, but it differs in one aspect. This statement refers to the number that the robot will be counting 'to'."
				,"So in this example, the bot will start counting at 0, and continue counting as long as the number he's currently on is less than 6. When the robot's current number changes from 5 to 6 the second condition is no longer true because 6 is not less than 6. Therefore, the robot will stop counting and the loop will be finished."
				,"The third statement, 'var ++', refers to the whether the robot will count upwards by 1 or count backwards by 1. So, if 'var ++', the robot will count from 1 to 2, then 2 to 3, for example. But, if 'var --', the robot will count from 3 to 2, then 2 to 1, for example."
				,"It is possible to change the operators (ex. '=', '<', '++') by clicking the Operators tab in the 'Command Area' and dragging the operator you want into the correct position within the 'For Loop' Declaration."
				,"Once you've changed all of the settings you want, click the play button on the Edit For Loop window to save your changes."
				,"Go ahead and click on the Actions tab in the 'Command Area' and drag the 'Jump' button between the brackets of the 'For Loop' Declaration that you placed before."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn right' button onto the grid. Make sure that this button is NOT between the previous 'For Loop' Declaration's brackets."
				,"Next, click the Controls tab in the 'Command Area' and drag the 'for' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid, between the 'For Loop' Declaration's brackets."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Controls tab in the 'Command Area' and drag the 'for' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'Jump' button onto the grid, between the 'For Loop' Declaration's brackets, then click play."*/
				];
				//tutorialTextArray11 = 22 lines/pages.
static var tutorialTextArray12 = ["This level will offer you more training with the 'For Loop' control. Follow the instructions to solve the level!"
				,"Click the Controls tab in the 'Command Area' and drag the 'for' button, which represents the 'For Loop' Declaration, onto the grid in the 'Program Area'."
				,"You will notice that when you use the For Loop control, an open and close bracket surround the next grid position. This happens because the for loop control's function is to repeat the commands that come after the 'For Loop' Declaration."
				,"So, any time you want to repeat a set of Actions, you must first use the 'for' Control."
				,"By default, you can only place one action inside of a 'For Loop', but by dragging the right bracket of the for loop to the right of any square on the grid, you can increase the number of Actions that will be included in the loop. All actions that lie between the 2 brackets after the 'For Loop' Declaration will be included in the loop."
				,"For this level, you only need to place one action inside of each set of 'For Loop' brackets."
				,"Additionally, each 'For Loop' Declaration must have various options set so that the robot knows how many times to repeat the actions between the brackets."
				,"To edit these options, double click the 'for' button that you've already placed on the grid. A window will appear that is titled 'Edit For Loop', and there are 3 Statements under the title."
				,"In the first statement, 'var = 0', 'var' stands for Variable; '=' stands for Equal to; and 0 is an Integer."
				,"'var = 0' refers to the number that the robot will start counting 'from'. So, if var = 0, then the Variable that the bot will start counting from is set Equal To the Integer 0."
				,"The second statement, 'var < 6', is very similar to the first, but it differs in one aspect. This statement refers to the number that the robot will be counting 'to'."
				,"So in this example, the bot will start counting at 0, and continue counting as long as the number he's currently on is less than 6. When the robot's current number changes from 5 to 6 the second condition is no longer true because 6 is not less than 6. Therefore, the robot will stop counting and the loop will be finished."
				,"The third statement, 'var ++', refers to the whether the robot will count upwards by 1 or count backwards by 1. So, if 'var ++', the robot will count from 1 to 2, then 2 to 3, for example. But, if 'var --', the robot will count from 3 to 2, then 2 to 1, for example."
				,"It is possible to change the operators (ex. '=', '<', '++') by clicking the Operators tab in the 'Command Area' and dragging the operator you want into the correct position within the 'For Loop' Declaration."
				,"Once you've changed all of the settings you want, click the play button on the Edit For Loop window to save your changes."
				,"Go ahead and click the Actions tab in the 'Command Area' and drag the 'Forward' button between the brackets of the 'For Loop' Declaration that you placed before."
				,"Next, double click the 'For Loop' Declaration that you just placed onto the grid. A window titled 'Edit For Loop' will appear.In that window, notice the expression that says 'var < 1'. Click the circle that has the 1 inside of it, delete the 1, and replace it with 6."
				,"Next, click the play button to save the changes to this 'For Loop' Declaration."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Controls tab in the 'Command Area' and drag the 'for' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button between the brackets of the second 'For Loop' Declaration that you placed."
				,"Next, double click the second 'For Loop' Declaration that you placed onto the grid. In the 'Edit For Loop' window, notice the expression that says 'var < 1'. Click the circle that has the 1 inside of it, delete the 1, and replace it with 6."
				,"Next, click the play button to save the changes to this 'For Loop' Declaration."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Controls tab in the 'Command Area' and drag the 'for' button onto the grid in the 'Program Area'."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button between the brackets of the third 'For Loop' Declaration that you placed."
				,"Next, double click the third 'For Loop' Declaration that you placed onto the grid. In the 'Edit For Loop' window, notice the expression that says 'var < 1'. Click the circle that has the 1 inside of it, delete the 1, and replace it with 6."
				,"Next, click the play button to save the changes to this 'For Loop' Declaration."
				,"Finally, click the Actions tab in the 'Command Area' and drag 2 'PickUp/PutDown' buttons onto the grid, then click play."
				];
				//tutorialTextArray12 = 19 lines/pages.
static var tutorialTextArray13 = ["I hope you're ready for your next challenge level! Attempt to solve the level on your own using everything you've learned so far!"//Challenge level, consider answer key in the form of "help" button.
				/*,"Click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the 'Program Area', starting at the top left corner."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid, then click play."*/
				];
				//tutorialTextArray13 = 1 lines/pages.
static var tutorialTextArray14 = ["This level will demonstrate how to properly use the 'Functions'. Click the play button to watch the robot solve the level! When the robot is finished, click the review, then play button if you want to watch the robot solve the level again."
				/*,"Click the Functions tab in the 'Command Area' and then click the '+' button in the bottom left corner of the 'Command Area'."
				,"A window will appear that is titled New Function. You can drag Actions, Controls, and even other Functions into this window to create a section of code that you can name and then use later, as often as you like."
				,"Take a moment to name this function 'myFunction1' by typing the name into the text box in the New Function window. Once you have entered the name, click the play button on the new function window, for now."
				,"The benefit of this is that each Action, Control, or Function that you place inside of a Function will be treated as one instruction to the robot. This allows you to create instruction sets of commands greater than the 20 command limit on the grid in the 'Program Area'."
				,"Typically, functions are used to group actions that are frequently used together in various places throughout a level solution."
				,"As you can see in this level, the robot will be required to lift 5 similarly placed boxes onto 5 similarly placed switches. A function can be used to group the instructions that the robot will need to perform each of the 5 times and treat that group as one command that he will execute 5 times."
				,"Lets get started with this level, first click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and double click 'myFunction1' to open the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag 3 'Forward' buttons onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag 4 'Backward' button onto the grid in the Edit Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid in the Edit Function window."
				,"Next, click the play button on the Edit Function window to save your function."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction1' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and then click the '+' button in the bottom left corner of the 'Command Area'."
				,"Name this function 'myFunction2' and then click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid in the New Function window."
				,"Next, click the play button on the New Function window to save your function."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction2' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction1' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction2' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction1' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction2' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction1' button onto the grid in the 'Program Area'."
				,"Next, click the Functions tab in the 'Command Area' and drag the 'myFunction2' button onto the grid in the 'Program Area'."
				,"Finally, click the Functions tab in the 'Command Area' and drag the 'myFunction1' button onto the grid in the 'Program Area', then click play."*/
				];
				//tutorialTextArray14 = 29 lines/pages.
static var tutorialTextArray15 = ["This level will offer you more training with the 'Functions'. Follow the instructions to solve the level!"
				,"A window will appear that is titled New Function. You can drag Actions, Controls, and even other Functions into this window to create a section of code that you can name and then use later, as often as you like."
				,"Take a moment to name this function 'myFunction1' by typing the name into the text box in the New Function window. Once you have entered the name, click the play button on the new function window, for now."
				,"The benefit of this is that each Action, Control, or Function that you place inside of a Function will be treated as one instruction to the robot. This allows you to create instruction sets of commands greater than the 20 command limit on the grid in the 'Program Area'."
				,"Typically, functions are used to group actions that are frequently used together in various places throughout a level solution."
				,"As you can see in this level, the robot will be required to lift 4 similarly placed boxes onto 4 similarly placed switches. A function can be used to group the instructions that the robot will need to complete the task of moving one box to it's destination and treat that group of actions as one command. Then you can execute that command 4 times."
				,"Lets get started with this level, first click the Functions tab in the 'Command Area' and then click the '+' button in the bottom left corner of the 'Command Area'."
				,"Name the function 'myFunction1', and then click the Actions tab and drag 2 'Forward' buttons onto the grid in the New Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid in the New Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the New Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 2 'Turn Right' buttons onto the grid in the New Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the New Function window."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid in the New Function window."
				,"Next, click the play button on the New Function window to save your function."
				,"Next, click the Functions tab in the 'Command Area' and drag 4 'myFunction1' buttons onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid, then click play."
				];
				//tutorialTextArray15 = 11 lines/pages.
static var tutorialTextArray16 = ["I hope you're ready for your next challenge level! Attempt to solve the level on your own using everything you've learned so far!"//Challenge level, consider answer key in the form of "help" button.
				/*,"Click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid in the 'Program Area', starting at the top left corner."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Left' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Forward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Backward' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'Turn Right' button onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid."
				,"Next, click the Actions tab in the 'Command Area' and drag the 'PickUp/PutDown' button onto the grid."
				,"Finally, click the Actions tab in the 'Command Area' and drag 2 'Forward' buttons onto the grid, then click play."*/
				];
				//tutorialTextArray16 = 1 lines/pages.
static var tutorialTextArray17 = ["This level is a bonus level that will allow you to get a little more practice with the previous concepts. Attempt to solve this level!"];
var dm : DataManager;

function Awake() {
	dm = GameObject.Find("DataManager").GetComponent(DataManager);

	//Initialize the player logging
	dm.ClearLog();
	dm.ClearAttempts();

	//********************************************************
	//Call Campaign Mode Functions to intialize arrays
	//********************************************************
	if(dm.gameplayMode == "campaign")
	{
		/*if(dm.level == 1 ||dm.level == 2 || dm.level == 5 || dm.level == 8 || dm.level == 11 || dm.level == 14 || dm.level == 17 || dm.level == 20 || dm.level == 23)
		{
			//is this a guided tutorial level? If so, enable checking of tutorial instructions*/
			isTutorialLevel=true;
		/*}
		else
			isTutorialLevel=false;*/
	}

	storyModeState.Add(missionCompletedArray);
	storyModeState.Add(highScoreArray);
	//storyModeState[missionCompleted][0] = true;
	//Debug.Log(storyModeState[missionCompleted][0]);
}

function InitButtonDescriptions()
{
	//At some point it would be wonderful to store all of this in a file or something.
	//For now, this is where we initialize all the descriptions/tooltips for GUI elements.

	buttons[actionButtons][0].SetContentDescription("Move CuteBot one step backward");
	buttons[actionButtons][1].SetContentDescription("Move CuteBot one step forward");
	buttons[actionButtons][2].SetContentDescription("Rotate CuteBot 90 degrees to the left");
	buttons[actionButtons][3].SetContentDescription("Rotate CuteBot 90 degrees to the right");
	buttons[actionButtons][4].SetContentDescription("CuteBot will pick up the object from the ground, or place the carried object on the ground");
	buttons[actionButtons][5].SetContentDescription("CuteBot will Jump up/forward one square");

	buttons[actionButtons][0].SetContentName("Backward");
	buttons[actionButtons][1].SetContentName("Forward");
	buttons[actionButtons][2].SetContentName("Turn Left");
	buttons[actionButtons][3].SetContentName("Turn Right");
	buttons[actionButtons][4].SetContentName("Pick Up/Put Down");
	buttons[actionButtons][5].SetContentName("Jump");

	buttons[actionButtons][0].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	buttons[actionButtons][1].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	buttons[actionButtons][2].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	buttons[actionButtons][3].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	buttons[actionButtons][4].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	buttons[actionButtons][5].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
	/*
	if (GLOBALS.EDIT) {
		// Walking during edit mode takes the place of the set step action
		//Places a step in front of him
		buttons[actionButtons][6].SetContentDescription("CuteBot places a step in front of himself");
		buttons[actionButtons][6].SetContentName("Set Step");
		buttons[actionButtons][6].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

		//Places a switch in front of him
		buttons[actionButtons][6].SetContentDescription("CuteBot places a switch in front of himself");
		buttons[actionButtons][6].SetContentName("Place Switch");
		buttons[actionButtons][6].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

		//Places a box in front of him
		buttons[actionButtons][7].SetContentDescription("CuteBot places a box in front of himself");
		buttons[actionButtons][7].SetContentName("Place Box");
		buttons[actionButtons][7].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

		//Sets the current position as the starting location
		buttons[actionButtons][8].SetContentDescription("CuteBot sets his current location to the starting location");
		buttons[actionButtons][8].SetContentName("Set Spawn");
		buttons[actionButtons][8].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);
		buttons[actionButtons][8].SetMax(1);

		//Places a box below of him
		buttons[actionButtons][9].SetContentDescription("CuteBot places a box below himself");
		buttons[actionButtons][9].SetContentName("Raise Ground");
		buttons[actionButtons][9].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

		//Removes a box below of him
		buttons[actionButtons][10].SetContentDescription("CuteBot removes a box below himself");
		buttons[actionButtons][10].SetContentName("Lower Ground");
		buttons[actionButtons][10].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

		//Places a HeavyBox infront of him
		buttons[actionButtons][11].SetContentDescription("CuteBot places a HeavyBox in front of himself");
		buttons[actionButtons][11].SetContentName("HeavyBox");
		buttons[actionButtons][11].moreInfo.SetInstructionType(INSTRUCTION_TYPE.ROBOT_ACTION);

	}
	*/
	buttons[controlButtons][0].moreInfo.SetInstructionType(INSTRUCTION_TYPE.LOOP_STRUCT);
	buttons[controlButtons][1].moreInfo.SetInstructionType(INSTRUCTION_TYPE.LOOP_STRUCT);
	buttons[controlButtons][2].moreInfo.SetInstructionType(INSTRUCTION_TYPE.BRANCH_STRUCT);
	buttons[controlButtons][3].moreInfo.SetInstructionType(INSTRUCTION_TYPE.VARIABLE_ACTION);

	buttons[controlButtons][0].SetContentName("While Loop");
	buttons[controlButtons][1].SetContentName("For Loop");
	buttons[controlButtons][2].SetContentName("If");
	buttons[controlButtons][3].SetContentName("Assignment");

	buttons[controlButtons][0].moreInfo.SetOperatorType(OPERATOR_TYPE.COMP_EQ);
	buttons[controlButtons][2].moreInfo.SetOperatorType(OPERATOR_TYPE.COMP_EQ);
	buttons[controlButtons][3].moreInfo.SetOperatorType(OPERATOR_TYPE.ASSIGN_EQ);

	buttons[controlButtons][0].SetContentDescription("Double Click to open a while loop and set the loops test condition.  The loop will execute until the test condition becomes false.");
	buttons[controlButtons][1].SetContentDescription("Double Click to open a for loop.  The initializer, test condition, and counter must be set to work correctly. The loop will execute until the test condition becomes false.");
	buttons[controlButtons][2].SetContentDescription("Double Click to open a if statement and set the test condition.  Instructions between the \"if\" brackets will execute if the test condition is true.");
	buttons[controlButtons][3].SetContentDescription("Double Click to open an assignment statement.");

	buttons[variableButtons][0].SetContentDescription("Stores a value that can be used and manipulated by other instructions.");
	buttons[variableButtons][1].SetContentDescription("Stores a value that can be used and manipulated by other instructions.");
	buttons[variableButtons][2].SetContentDescription("Stores a value that can be used and manipulated by other instructions.");
	buttons[variableButtons][3].SetContentDescription("Stores a value that can be used and manipulated by other instructions.");

	buttons[operatorButtons][0].SetContentDescription("Add one to the respective variable. Double Click to open.");
	buttons[operatorButtons][1].SetContentDescription("Subtract one from the respective variable. Double Click to open.");
	buttons[operatorButtons][2].SetContentDescription("Sets the respective variable to a certain value. Double Click to open. Value can be a number or variable.");
	buttons[operatorButtons][3].SetContentDescription("Adds a value to the respective variable.  Double Click to open.  Value can be a number or variable.");
	buttons[operatorButtons][4].SetContentDescription("Subtracts a value from the respective variable.  Double Click to open.  Value can be a number or variable.");
	buttons[operatorButtons][5].SetContentDescription("Compares a variable and a value to see if they are equal. Double Click to open.  Value can be a number or variable.");
	buttons[operatorButtons][6].SetContentDescription("Compares a variable and a value to see if the first is greater. Double Click to open.  Value can be a number or variable.");
	buttons[operatorButtons][7].SetContentDescription("Compares a variable and a value to see if the first is smaller. Double Click to open.  Value can be a number or variable.");

	buttons[operatorButtons][0].SetContentName("++");
	buttons[operatorButtons][1].SetContentName("--");
	buttons[operatorButtons][2].SetContentName("=");
	buttons[operatorButtons][3].SetContentName("+=");
	buttons[operatorButtons][4].SetContentName("-=");
	buttons[operatorButtons][5].SetContentName("==");
	buttons[operatorButtons][6].SetContentName(">");
	buttons[operatorButtons][7].SetContentName("<");

	buttons[operatorButtons][0].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][1].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][2].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][3].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][4].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][5].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][6].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
	buttons[operatorButtons][7].moreInfo.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);

	buttons[operatorButtons][0].moreInfo.SetOperatorType(OPERATOR_TYPE.PLUS);
	buttons[operatorButtons][1].moreInfo.SetOperatorType(OPERATOR_TYPE.MINUS);
	buttons[operatorButtons][2].moreInfo.SetOperatorType(OPERATOR_TYPE.ASSIGN_EQ);
	buttons[operatorButtons][3].moreInfo.SetOperatorType(OPERATOR_TYPE.ASSIGN_PLUSEQ);
	buttons[operatorButtons][4].moreInfo.SetOperatorType(OPERATOR_TYPE.ASSIGN_MINUSEQ);
	buttons[operatorButtons][5].moreInfo.SetOperatorType(OPERATOR_TYPE.COMP_EQ);
	buttons[operatorButtons][6].moreInfo.SetOperatorType(OPERATOR_TYPE.COMP_GT);
	buttons[operatorButtons][7].moreInfo.SetOperatorType(OPERATOR_TYPE.COMP_LT);
}

function Start(){
	//Default variable and function creation limits;
	//These are chosen arbitrarily.
	VARIABLE_LIMIT = 9;
 	FUNCTION_LIMIT = 5;

 	//Current numbers of functions and variables.
 	funcCount = 0;
 	varCount  = 4;

 	//imitialize variables
 	varValues  = new Array();
 	varValues[0] = "0";
	varValues[1] = "0";
	varValues[2] = "0";
	varValues[3] = "0";
	varValues[9] = "0";

	//Primary Workspace
	mySpace = new Workspace("main",445, 320, 4, 5, 65, this);

	//Initializing the tutorial icons.
	/*(commandArea = Resources.Load("MyButtonTexture");
	programArea = Resources.Load("MyButtonTexture");
	worldPreview = Resources.Load("MyButtonTexture");
	switchPic = Resources.Load("MyButtonTexture");
	weightPic = Resources.Load("MyButtonTexture");
	//playButtonPic = Resources.Load("playButton.png");
	commandAreaPic = Resources.Load("MyButtonTexture");
	turnLeftButtonPic = Resources.Load("MyButtonTexture");
	turnRightButtonPic = Resources.Load("MyButtonTexture");
	forLoopPic = Resources.Load("MyButtonTexture");
	stopButtonPic = Resources.Load("MyButtonTexture");
	stepButtonPic = Resources.Load("MyButtonTexture");
	trashButtonPic = Resources.Load("MyButtonTexture");
	functionButtonPic = Resources.Load("MyButtonTexture");
	functionWindowPic = Resources.Load("MyButtonTexture");
	forLoopWindowPic = Resources.Load("MyButtonTexture");
	forwardPic = Resources.Load("MyButtonTexture");
	backwardPic = Resources.Load("MyButtonTexture");
	pickupActionPic = Resources.Load("MyButtonTexture");
	heavyBlockPic = Resources.Load("MyButtonTexture");
	lightBlockPic = Resources.Load("MyButtonTexture");
	jumpActionPic = Resources.Load("MyButtonTexture");
	variableExamplesPic = Resources.Load("MyButtonTexture");
	operatorExamplesPic = Resources.Load("MyButtonTexture");
	controlsExamplesPic = Resources.Load("MyButtonTexture");
	actionsExamplesPic = Resources.Load("MyButtonTexture");
	functionsExamplesPic = Resources.Load("MyButtonTexture");
	icon = Resources.Load("MyButtonTexture");*/

	//Initializing the button sources.
	buttons = new Array(6);
	for (var xi=0; xi<5; xi++)
	{
		buttons[xi] = new ButtonSource[12];
	}

	//set proper number of actions for gameplay or editor mode
	var actions = 6;
	if(dm.gameplayMode == "edit")
	{
	actions = 14;
	}

	buttons[actionButtons] = new ButtonSource[actions];
	buttons[operatorButtons] = new ButtonSource[8];
	buttons[controlButtons] = new ButtonSource[4];

	funcSpaces = new Array();
	opSpaces = new Array();
	loopSpaces = new Array();

	holdingVals = new Array();
	windowList = new Array();

	var length : int =100;
	var width : int = 100;
	var offset : int = 110;

	colorArray = [red, orange, yellow, green, blue, purple];
	spaceArray = [space, planet1, planet2, star];
	seaArray = [water, fish, turtle, jellyfish];
	seasonsArray = [fall, winter, spring, summer];

	startFlag = false;
	endFlag = false;
	pickUpFlag = false;

	Application.LoadLevelAdditive("RobotWorld");

	if(dm.gameplayMode == "edit")
	{
		var parsedID = parseInt(dm.levelToLoad+"");
		puzzleID = parsedID+"";
		puzzleID = puzzleID.Trim() +".xml";
		Debug.Log(puzzleID);
	}

	//Actions
	buttons[actionButtons][0] = new ButtonSource(new Point(10,40),55,55, mySpace, act0, 0, "button");
	buttons[actionButtons][1] = new ButtonSource(new Point(10+65,40),55,55, mySpace, act1, 1, "button");
	buttons[actionButtons][2] = new ButtonSource(new Point(10+65*2,40),55,55, mySpace, act2, 2, "button");
	buttons[actionButtons][3] = new ButtonSource(new Point(10+65*3,40),55,55, mySpace, act3, 3, "button");
	buttons[actionButtons][4] = new ButtonSource(new Point(10+65*4,40),55,55, mySpace, act4, 4, "button");
	buttons[actionButtons][5] = new ButtonSource(new Point(10+65*5,40),55,55, mySpace, act5, 5, "button");

	if (dm.gameplayMode == "edit") {
		//Step
		//buttons[actionButtons][6] = new ButtonSource(new Point(10+65*6,40),55,55, mySpace, act6, 6, "button");
		//Switch
		buttons[actionButtons][6] = new ButtonSource(new Point(10+65*6,40),55,55, mySpace, act7, 6, "button");
		//Box
		buttons[actionButtons][7] = new ButtonSource(new Point(10+65*7,40),55,55, mySpace, act8, 7, "button");
		//Spawn
		buttons[actionButtons][8] = new ButtonSource(new Point(10,40+65),55,55, mySpace, act9, 8, "button");
		//RaiseGround
		buttons[actionButtons][9] = new ButtonSource(new Point(10+65,40+65),55,55, mySpace, act6, 9, "button");
		//LowerGround
		buttons[actionButtons][10] = new ButtonSource(new Point(10+65*2,40+65),55,55, mySpace, act10, 10, "button");
		//HeavyBox
		buttons[actionButtons][11] = new ButtonSource(new Point(10+65*3,40+65),55,55, mySpace, act11, 11, "button");
	}

	//Variables (initial 4)
	buttons[variableButtons][0] = new ButtonSource(new Point(10,40),55,55,mySpace,"x", 0, "blueCircle");
	buttons[variableButtons][1] = new ButtonSource(new Point(10+65,40),55,55,mySpace,"y", 1, "blueCircle");
	buttons[variableButtons][2] = new ButtonSource(new Point(10+65*2,40),55,55,mySpace,"i", 2, "blueCircle");
	buttons[variableButtons][3] = new ButtonSource(new Point(10+65*3,40),55,55,mySpace,"j", 3, "blueCircle");

	var i : int = 0;
	for(var piece : ButtonSource in buttons[variableButtons])
	{
		if(piece && piece.moreInfo)
		{
			piece.moreInfo.SetInstructionType(INSTRUCTION_TYPE.VARIABLE);
			piece.moreInfo.SetTargetIndex(i++);
		}
	}



	//Controls
	buttons[controlButtons][0] = new ButtonSource(new Point(10,40),55,55,mySpace,"while", 0, "pinkSquare");
	buttons[controlButtons][1] = new ButtonSource(new Point(10+65,40),55,55,mySpace,"for", 1, "pinkSquare");
	buttons[controlButtons][2] = new ButtonSource(new Point(10+65*2,40),55,55,mySpace,"if", 2, "pinkSquare");
	buttons[controlButtons][3] = new ButtonSource(new Point(10+65*3,40),55,55,mySpace,"set", 3, "pinkSquare");

	//Operators
	buttons[operatorButtons][0] = new ButtonSource(new Point(10,40),55,55,mySpace,plus, 0, "greenTriangle");
	buttons[operatorButtons][1] = new ButtonSource(new Point(10+65,40),55,55,mySpace,minus, 1, "greenTriangle");
	buttons[operatorButtons][2] = new ButtonSource(new Point(10+65*2,40),55,55,mySpace,equal, 2, "greenTriangle");
	buttons[operatorButtons][3] = new ButtonSource(new Point(10+65*3,40),55,55,mySpace,plusEQ, 3, "greenTriangle");
	buttons[operatorButtons][4] = new ButtonSource(new Point(10+65*4,40),55,55,mySpace,minusEQ, 4, "greenTriangle");
	buttons[operatorButtons][5] = new ButtonSource(new Point(10+65*5,40),55,55,mySpace,compEQ, 5, "orangeTriangle");
	buttons[operatorButtons][6] = new ButtonSource(new Point(10+65*6,40),55,55,mySpace,compGT, 6, "orangeTriangle");
	buttons[operatorButtons][7] = new ButtonSource(new Point(10+65*7,40),55,55,mySpace,compLT, 7, "orangeTriangle");

	InitButtonDescriptions();

	//Here is where we rebuild the workspace the player had saved last.
	//Debug.Log(GLOBALS.EDIT);
	if(!(dm.gameplayMode == "edit"))// && !GLOBALS.story)
	{
		if(dm.gameplayMode == "campaign" && (dm.level == 1 || dm.level == 2 || dm.level == 3 || dm.level == 4 || dm.level == 6 || dm.level == 7 || dm.level == 8 || dm.level == 10 || dm.level == 11 || dm.level == 12 || dm.level == 14 || dm.level == 15 || dm.level == 16 || dm.level == 18 || dm.level == 19 || dm.level == 20))
		{
			solutionLoaded = true;
		}
		else
		{
			Debug.Log("TryBuild");
			RebuildWorkspace();
		}
	}
	else
	{
		solutionLoaded = true;
	}


	//if(!levelLoaded && !cameraMM)
	//{
	//	LoadMiniMapCam();
	//}
}

function Update()
{
	//going to be bugs here because unity won't load these things all until the THIRD update...
	//this is pretty awful.



	if (Input.GetKeyDown("return") && dm.user.isAdmin && dm.gameplayMode == "campaign")
	{
		skipLevel = true;

	}

	//once the level is loaded, we grab the camera from it, and stop loading.
	if(gameState == GameState.loading && solutionLoaded)
	{
		Load();
	}

	if(gameState == GameState.scoring)
	{
		Debug.Log("getting somewhere?");
		if (!dm.IsBusy())
			gameState = GameState.exiting;
	}
	else if(gameState == GameState.submitting)
	{
		//UploadLevel();
	}
	else if(gameState == GameState.resetting && !myRobot.GetComponent("Robot").robotBusy)
	{
		Stop();
		myRobot.GetComponent("Robot").ResetError();
		lastStepCompleted = true;
		gameState = GameState.idle;
	}
	else if (gameState == GameState.exiting)
	{
		if (dm.IsBusy())
			return;

		if(dm.gameplayMode == "campaign")
		{
			displayInfo = true;
			if(TutorialMode.tutorialVersion == 2)
			{
			 	if((dm.level == 5
			 	|| dm.level == 6
			 	|| dm.level == 7
			 	|| dm.level == 8
			 	|| dm.level == 9
			 	|| dm.level == 10
			 	|| dm.level == 11
			 	|| dm.level == 12
			 	|| dm.level == 13
			 	|| dm.level == 14
			 	|| dm.level == 15
			 	|| dm.level == 16
			 	|| dm.level == 17
			 	|| dm.level == 18
			 	|| dm.level == 19
			 	|| dm.level == 20) && !iNeedTeaching)
			 	{
			    	//dm.level++;//skips the tutorial level if demonstration level criteria are met.
			    	dm.user.savestate++;
			    	iNeedTeaching = true;
			    }
		    }
		    dm.user.savestate++;
			buttonControl=0;
			currentPage = 0;
			Application.LoadLevel("Tutorial");
		}
		else
		{
			Application.LoadLevel("Start");
		}

	}
	else if (gameState == GameState.finished)
	{
		//check the level for completion
		if(myLevel && myLevel.GetComponent("CreateLevel") && !myLevel.GetComponent("CreateLevel").myRobot.robotBusy && mySpace && mySpace.pointer && mySpace.pointer.IsComplete())
		{
			if(!(dm.gameplayMode == "edit") && myLevel.GetComponent("CreateLevel").CheckCompletion())
			{
				Minimize();
				if(dm.gameplayMode == "campaign" && ((dm.level == 7 && NumberButtonsUsed() < 17) || (dm.level == 11 && NumberButtonsUsed() < 15) || (dm.level == 15 && (NumberButtonsUsed() < 16 || usedFunction)) || (dm.level == 19 && (NumberButtonsUsed() < 28 && usedFunction))))
				{
					ShowMessageBox("win_tutorial", "You won using " + NumberButtonsUsed() + " buttons! \n \n In addition, due to the efficiency \n of your  solution, you've also \n qualified to skip the next level!");
				}
				else
					ShowMessageBox("win", "You won using " + NumberButtonsUsed() + " buttons!");
			}
		}

		//the robot's voice
		//if the robot has something to say, we show it
		if (myRobot.GetComponent("Robot").HasError())
		{
			Minimize();
			ShowMessageBox("error", myRobot.GetComponent("Robot").GetErrorText().ToString());
		}
	}
	else if (gameState == GameState.stepping)
	{

	}

	//once the level is loaded, we grab the tutorial (if one exists) from it.
	if(gameState != GameState.loading && dm.gameplayMode == "campaign" && myLevel)
	{
		levelInstructions = myLevel.GetComponent("CreateLevel").TutorialInstructionList;
		if (levelInstructions.GetFunctionLimit() != -1)
		{
			FUNCTION_LIMIT = levelInstructions.GetFunctionLimit();
		}
		if(levelInstructions.GetSize() > 0)
		{
			TutorialIsLoaded = true;
		}
	}

	//old double-click timer used to make the game behave consistently across browsers/OS
	//might no longer be needed with new versions of Unity
	if(Input.GetMouseButtonDown(0))
	{
		curClick = Time.time;
		if((curClick - preClick) <.3 && preClick != 0)
		{
			doubleClick = true;
			//("I double clicked");
		}
		else
		{
			doubleClick = false;

		}
		preClick = curClick;
	}
}

function DrawMainGUI()
{
	// Assign the primary GUI skin


	GUI.skin = mySkin;
	//Debug.Log(gameState);

	GUI.Button(Rect(0,0,200,25), gameState.ToString());

	if (gameState == GameState.loading)
		return;

	//Draw The Buttons
	if (windowList.length != 0 || NumberButtonsUsed() < 1)
	{
		if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*20/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "PlayDeactivated"));
		if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*60/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "StepDeactivated"));
		if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*100/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700),"", "StopDeactivated"));
	}
	else
	{
	switch(gameState)
	{
		case GameState.idle:
			if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*20/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "GoButton"))
			{
				Run();
			}

			if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*60/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "StepButton"))
			{
				if(lastStepCompleted)
				{
					StepForward();
					gameState = GameState.stepping;
				}
			}

			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*100/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700),"", "StopDeactivated");

			break;
		case GameState.running:
		case GameState.finished:
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*20/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "PlayDeactivated");
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*60/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "StepDeactivated");
			if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*100/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700),"", "StopButton"))
			{
				AddStringToLog("User pressed STOP");
				Stop();

				AddStringToLog("Failed using " + NumberButtonsUsed() + " buttons");
				SubmitScore(0);
				gameState = GameState.resetting;
			}
			break;
		case GameState.stepping:
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*20/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "PlayDeactivated");
			if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*60/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "StepButton"))
				{
					if(lastStepCompleted)
					{
						StepForward();
						gameState = GameState.stepping;
					}
				}
			if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*100/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700),"", "StopButton"))
			{
				AddStringToLog("User pressed STOP");
				Stop();

				AddStringToLog("Failed using " + NumberButtonsUsed() + " buttons");
				SubmitScore(0);
				gameState = GameState.resetting;
			}
			break;
		default:
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*20/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "PlayDeactivated");
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*60/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "", "StepDeactivated");
			GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*100/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700),"", "StopDeactivated");
			break;
	}
	}

	if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*200/700, Screen.width*buttonSize.x/910, Screen.height*buttonSize.y/700), "?", "HelpButton"))
	{
		AddStringToLog("User clicked HELP");
		Help();
	}

	if(GUI.Button(Rect(Screen.width*buttonOffset/910, Screen.height*140/700, Screen.width*buttonSize.x/910, Screen.height*(buttonSize.y * 1.6)/700), "", "TrashButton"))
	{
		AddStringToLog("User clicked TRASH");
		if(gameState != GameState.loading)
			SubmitScore(0);
		Stop();
		Trash();
		gameState = GameState.resetting;
	}

	if(gameState != GameState.displaying && GUI.Button(Rect(Screen.width*(910-240)/910,Screen.height*(700-25)/700,Screen.width*110/910,Screen.height*25/700),"Quit"))
	{
		 AddStringToLog("User clicked QUIT");

			 if(dm.gameplayMode != "edit")
			 {
				 dm.LogAttempts();
				 if(gameState != gameState.loading)
				 	SubmitScore(0);
			 }
			 dm.gameplayMode = "play";
			 pickCol = 0;
			 Stop(); Trash();
			 gameState = GameState.scoring;
	}
	if(dm.gameplayMode == "campaign" || dm.gameplayMode == "story")
	{
		if(dm.user.isAdmin)
		{
			if(GUI.Button(Rect(Screen.width*(780)/910,Screen.height*(700-25)/700,Screen.width*110/910,Screen.height*25/700),"Skip Level"))
			{
				 AddStringToLog("User clicked Skip Level");

					gameState = GameState.scoring;
					//dm.UnlockNextTutorialLevel();
			}
		}
	}


}


function DrawProgrammingGUI()
{
	GUI.Box(Rect(Screen.width*325/910, Screen.height*205/700, Screen.width*565/910, Screen.height*470/700), "", "Workspace");

	mySpace.Display(piecesSkin, gameState == GameState.idle);

	//Toolkit
	GUI.skin = mySkin;
	GUI.BeginGroup(tabs_group, "", style);

	//Toolbar
	toolbarContent[0] = new GUIContent(" Actions", actionIcon);
	toolbarContent[1] = new GUIContent(" Variables", variableIcon);
	toolbarContent[2] = new GUIContent(" Operators", operatorIcon);
	toolbarContent[3] = new GUIContent(" Controls", controlIcon);
	toolbarContent[4] = new GUIContent(" Functions", functionIcon);
	toolbarInt = GUI.Toolbar (Rect(0, 0, Screen.width*525/910, Screen.height*30/700), toolbarInt, toolbarContent);
	switch(toolbarInt)
	{
		case 0:  DisplayActions(); break;
		case 1:  DisplayVariables(); break;
		case 2:  DisplayOperators(); break;
		case 3:  DisplayControls(); break;
		case 4:  DisplayFunctions(); break;
		default:  DisplayActions(); break;
	}
	GUI.EndGroup();

	//Side Panel
	OrderWindows();

	if(gameState != GameState.running)
	{
		GUI.BeginGroup(Rect(Screen.width*763/910, Screen.height*230/700 ,Screen.width*150/910,Screen.height*150/700));
		GUI.Label(Rect(0, 0,Screen.width*150/910, Screen.height*150/700), monitorPic);
		GUI.Label(Rect(Screen.width*10/910, Screen.height*70/700, Screen.width*100/910, Screen.height*100/700), "COMMANDS");
		GUI.Label(Rect(Screen.width*35/910,Screen.height* 95/700, Screen.width*50/910, Screen.height*50/700), NumberButtonsUsed().ToString());
		GUI.EndGroup();
	}

	GUI.skin = piecesSkin;
	if(heldButton!=null) heldButton.Display();
}

function OnGUI (){

	if(gameState == GameState.loading || gameState == GameState.scoring || gameState == GameState.exiting || !solutionLoaded)// || dm.IsBusy())
	{
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), loadingScreen, ScaleMode.StretchToFill, true, 0);
		//Debug.Log("megabutts");
		return;
	}

	if(isTutorialLevel && dm.gameplayMode == "campaign" && displayInfo)
	{
		DisplayMoreInfo(0, 0, 300, 400);
	}

	if(gameState != GameState.loading && TutorialIsLoaded)
	{
		if(myLevel != null || cameraMM != null)
		{
			gameState = GameState.idle;
	    	cameraMM.GetComponent("MouseOrbit2").UpdateValues(mySkin, buttonSize, buttonOffset, this, windowList);
	    	isMaximized = cameraMM.GetComponent("MouseOrbit2").maximized;
	    	//Debug.Log(IsSubmittable());
			Debug.Log(myLevel.GetComponent("CreateLevel").endCount);
	    }
    }

    if(cameraMM != null)
    {
    	isMaximized = cameraMM.GetComponent("MouseOrbit2").maximized;
    }

	DrawMainGUI();

	if(!isMaximized)
	{
		DrawProgrammingGUI();
	}

	GUI.skin = mySkin;

	if(gameState == GameState.displaying)
	{
		if (messageContent.text.Contains("Function1")) //these are large help windows
		{
			GUI.Window(9002, Rect(Screen.width / 12, Screen.height / 10, 300, 700), DisplayMessage, messageContent.text);
			GUI.BringWindowToFront(9002);
		}
		else if(messageType == "help")
		{
			GUI.Window(9002, Rect(Screen.width / 10, Screen.height / 10, 300, 500), DisplayMessage, messageContent.text);
			GUI.BringWindowToFront(9002);
		}
		else
		{
			GUI.Window(9002, Rect(Screen.width / 10, Screen.height / 10, 250, 250), DisplayMessage, messageContent.text);
			GUI.BringWindowToFront(9002);
		}
	}

	if(ShowHighlightedStep)
	{
		if(mySpace && mySpace.pointer && !isMaximized)
		{
			var HighlightOffset = 10;
			if(!myRobot.GetComponent("Robot").HasError())
			{
				GUI.Box(Rect(mySpace.containers[mySpace.pointer.previousInstruction].GetX(), mySpace.containers[mySpace.pointer.previousInstruction].GetY(), 55, 55), "", "HighlightStep");
				//GUI.Box(Rect(Screen.width*(mySpace.containers[mySpace.pointer.currentInstruction].GetX() - HighlightOffset)/910,
						 	//Screen.height*(mySpace.containers[mySpace.pointer.currentInstruction].GetY() - HighlightOffset)/700,
						 	//Screen.width*(55 + (HighlightOffset *2))/910, Screen.height*(55 + (HighlightOffset *2))/700), "", "HighlightStep");
			}
			else
			{
				GUI.Box(Rect(mySpace.containers[mySpace.pointer.previousInstruction].GetX(), mySpace.containers[mySpace.pointer.previousInstruction].GetY(), 55, 55), "", "HighlightStepError");
						//GUI.Box(Rect(Screen.width*(mySpace.containers[mySpace.pointer.currentInstruction].GetX() - HighlightOffset)/910,
						 	//Screen.height*(mySpace.containers[mySpace.pointer.currentInstruction].GetY() - HighlightOffset)/700,
						 	//Screen.width*(55 + (HighlightOffset *2))/910, Screen.height*(55 + (HighlightOffset *2))/700), "", "HighlightStepError");
			}
		}
	}

	if (dm.gameplayMode == "edit") {
		var wallpaper_text = "Wallpapers";

		if(showWallpaper)
			wallpaper_text = "Hide";

    	//code to show wallpaper select?
    	if(false && GUI.Button(Rect(Screen.width*160/910, 0, Screen.width*110/910, Screen.height*25/700), wallpaper_text))
   		{
    		if(wallpaper_text.Equals("Wallpapers"))
    		{
        		showWallpaper = true;
        	}
        	else
        		showWallpaper = false;
    	}

		//should be windowtype
		//if(showUploadWindow)
		//{
		//	GUI.Window(9002, Rect(Screen.width/2-57, Screen.height-195, 298, 174), ShowUpload, "Upload Level");
		//}
		//if(showNameSameWindow)
		//{
		//	NameSameWindow();
		//}
		//if(showNotSubmittableWindow)
		//{
		//	NotSubmittableWindow();
		//}
		//if(showWallpaper)
		//{
		//	GUI.Window(2, Rect(Screen.width*160/910, Screen.height*20/700,Screen.width*200/910,Screen.height*375/700), ShowWallpaperList, "Select your wallpaper");
		//}
		if(resetLevel)
		{
			startFlag = false;
			endFlag = false;
			pickUpFlag = false;
		}
	}

	//Creates a dialog window that asks if you "really" want to skip the level in the tutorial mode.
	/*
	if(skipLevel)
	{
		GUI.Window(9003, Rect(Screen.width / 2, Screen.height / 2, 300, 200), SkipLevelDialog, "");
		GUI.FocusWindow(9003);
	}
	*/



}

//GLOBALS.EDIT Start LevelEditor methods
/*
var notOpen : GUIStyle;
var open : GUIStyle;
function ShowWallpaperList()
{
	if(GUI.Button (Rect(Screen.width*10/910, Screen.height*25/700, Screen.width*175/910, Screen.height*22/700), "Red", open))
	{
		pickCol = 1;
		m = colorArray[0];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*45/700, Screen.width*175/910, Screen.height*22/700), "Orange", open))
	{
		pickCol = 2;
		m = colorArray[1];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*65/700, Screen.width*175/910, Screen.height*22/700), "Yellow", open))
	{
		pickCol = 3;
		m = colorArray[2];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*85/700, Screen.width*175/910, Screen.height*22/700), "Green", open))
	{
		pickCol = 4;
		m = colorArray[3];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*105/700, Screen.width*175/910, Screen.height*22/700), "Blue", open))
	{
		pickCol = 5;
		m = colorArray[4];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*125/700, Screen.width*175/910, Screen.height*22/700), "Purple", open))
	{
		pickCol = 6;
		m = colorArray[5];
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*145/700, Screen.width*175/910, Screen.height*22/700), "Rainbow", open))
	{
		pickCol = 7;
		var zz : int;
		for(zz = 0; zz < myLevel.GetComponent("CreateLevel").GetBoxes().length; zz++)
		{
			var bx = myLevel.GetComponent("CreateLevel").GetBoxes()[zz];
			m = myLevel.GetComponent("CreateLevel").colorByLevel(bx.level_x, bx.level_z, bx.level_y);
			//Debug.Log(bx.level_x + ", " + bx.level_z);
			bx.renderer.material = m;
		}
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*165/700, Screen.width*175/910, Screen.height*22/700), "Rainbow Stripes", open))
	{
		pickCol = 8;
		for(u =0; u < myLevel.GetComponent("CreateLevel").GetBoxes().length; u++)
		{
			var box = myLevel.GetComponent("CreateLevel").GetBoxes()[u];
			m = myLevel.GetComponent("CreateLevel").horizontalStripes(box.level_z);
			box.renderer.material = m;
		}
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*185/700, Screen.width*175/910, Screen.height*22/700), "Space", open))
	{
		pickCol = 9;
		var t :int;
		for(t =0; t < myLevel.GetComponent("CreateLevel").GetBoxes().length; t++)
		{
			//Debug.Log(m);
			m = myLevel.GetComponent("CreateLevel").randomColor(9); //space
			myLevel.GetComponent("CreateLevel").changeSingleBoxMat(m);
		}
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*205/700, Screen.width*175/910, Screen.height*22/700), "Under the Sea", open))
	{
		pickCol = 10;
		var w :int;
		for(w =0; w < myLevel.GetComponent("CreateLevel").GetBoxes().length; w++)
		{
			m = myLevel.GetComponent("CreateLevel").randomColor(10); //water
			myLevel.GetComponent("CreateLevel").changeSingleBoxMat(m);
		}
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*225/700, Screen.width*175/910, Screen.height*22/700),"Fall", open))
	{
		pickCol = 11;
		m = seasonsArray[0];//fall
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*245/700, Screen.width*175/910, Screen.height*22/700), "Winter", open))
	{
		pickCol = 12;
		m = seasonsArray[1]; //winter
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*265/700, Screen.width*175/910, Screen.height*22/700), "Spring", open))
	{
		pickCol = 13;
		m =seasonsArray[2]; //spring
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*285/700, Screen.width*175/910, Screen.height*22/700), "Summer", open))
	{
		pickCol = 14;
		m = seasonsArray[3]; //summer
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*305/700, Screen.width*175/910, Screen.height*22/700), "Minecraft", notOpen))
	{
		pickCol = 15;
	}
	else if(GUI.Button (Rect(Screen.width*10/910, Screen.height*325/700, Screen.width*175/910, Screen.height*22/700), "City", notOpen))
	{
		pickCol = 16;
	}
	else if(GUI.Button(Rect(Screen.width*10/910, Screen.height*345/700, Screen.width*175/910, Screen.height*22/700), "Default", open))
	{
		pickCol = 0;
		m = myLevel.GetComponent("CreateLevel").GetDefault();
		myLevel.GetComponent("CreateLevel").changeBoxMat(m);
	}
}

function SkipLevelDialog()
{
	GUI.Label(Rect(50, 50, 200, 200), " Are you sure? ");

		if (GUI.Button(new Rect(Screen.width*35/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "Yes!"))
		{

			if(dm.gameplayMode == "campaign")
			{
				dm.UnlockNextTutorialLevel();
				buttonControl=0;
				Application.LoadLevel("Tutorial");
			}

			if(dm.gameplayMode == "story")
			{
				//dm.level++; unlock next story level?
				buttonControl=0;
				Application.LoadLevel("Story");
			}
		}

		if (GUI.Button(new Rect(Screen.width*165/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "No."))
		{
			skipLevel = false;
			return;
		}
}

function QuitLevelDialog()
{
	GUI.Label(Rect(50, 50, 200, 200), " What would you like to do?");

		if (GUI.Button(new Rect(Screen.width*35/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "Skip this level"))
		{
			AddStringToLog("User clicked Skip This Level");

				 //AddStringToLog("Total Attempts: " + (log_attempts));
				 dm.LogAttempts();
				 if(gameState != gameState.loading)
				 	yield (0);
			 pickCol = 0;
			 Stop(); Trash();
			 gameState = GameState.exiting;
		}

		if (GUI.Button(new Rect(Screen.width*165/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "Quit the Tutorial"))
		{
			AddStringToLog("User clicked QUIT");

			if(!dm.gameplayMode != "edit")
			{
				//AddStringToLog("Total Attempts: " + (log_attempts));
				dm.LogAttempts();
				if(gameState != gameState.loading)
				 	SubmitScore(0);
			}
			pickCol = 0;
			Stop(); Trash();
			Application.LoadLevel("MainMenu");
		}
}

function ShowUpload()
{
	if (levelIsSubmittable)
	{
	Debug.Log("i got here at least");//level submission chokes here
	//GUI.Label(Rect(50, 50, 100, 100), "hi!");
		TextSanitizer.AlphaNumeric();
		GUI.Label(Rect(Screen.width*10/910, Screen.height*30/700, Screen.width*100/910, Screen.height*25/700), "Level Name:");
		levelName =  GUI.TextField (Rect(Screen.width*110/910, Screen.height*30/700, Screen.width*175/910, Screen.height*25/700), levelName, 25);
		GUI.Label(Rect(Screen.width*10/910,Screen.height*65/700, Screen.width*100/910, Screen.height*25/700), "Level Details:");
		levelDescription =  GUI.TextField (Rect(Screen.width*110/910, Screen.height*65/700, Screen.width*175/910, Screen.height*25/700),  levelDescription, 25);
		Debug.Log("i got here at least");//level submission chokes here
		if (GUI.Button(new Rect(Screen.width*35/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "Submit!"))
		{
		showUploadWindow = false;
			if(levelName == "")
			{
				showNameSameWindow = true;
				Debug.Log("I don't wanna be here");
			}
			if(dm.gameplayMode != "edit")
			{
				for(var level in myLevelNames)
				{
					if(level[0] == levelName)
					{
						Debug.Log("Level Names Are The Same");
						showNameSameWindow = true;
						return;
					}
				}
				myRobot.GetComponent("Robot").SetSpawn();
				UploadLevel();
				Debug.Log("i got here too");
			}
			else
			{
			Debug.Log("sadly, i also got here");
				UploadLevel();
				}

		}

		if (GUI.Button(new Rect(Screen.width*165/910, Screen.height*105/700, Screen.width*100/910, Screen.height*50/700), "Not Yet..."))
			{
				showUploadWindow = false;
				setNewSpawnPoint = false;
			}
	}
	else
	{
		showNotSubmittableWindow = true;
		//showUploadWindow = false;
	}
}

function NameSameWindow()
{
	ShowMessageWindow("You have another level with the same name or have a blank name. Please rename the new level.");
}

function NotSubmittableWindow()
{
//showNotSubmittableWindow =
ShowMessageWindow("Sorry... this isn't submittable yet.");
}

//function ShowMessageWindow(message : String) : boolean
function ShowMessageWindow(message : String)
{
	//var flag : boolean = true;
	GUI.Box(new Rect(Screen.width*350/910, Screen.height*350/700, Screen.width*300/910, Screen.height*200/700), "Message");
	GUI.Label(Rect(Screen.width*375/910, Screen.height*375/700, Screen.width*275/910, Screen.height*100/700), message);

	if (GUI.Button(new Rect(Screen.width*475/910, Screen.height*450/700, Screen.width*50/910, Screen.height*50/700), "OK"))
		showNotSubmittableWindow = false;
		//flag = false;

	//return flag;
}

function IsSubmittable() : boolean
{
	if (!myLevel)
		return false;

	return(myLevel.GetComponent("CreateLevel").IsSubmittable());
}


function UploadLevel()
{
	// Create a Web Form


		var URL;


		if(dm.gameplayMode == "edit")
		{
			Debug.Log("Updating....");
			URL = dm.location + "drupal-6.2/scripts/bots/updateLevel.php";
		}else {
			URL = dm.location + "drupal-6.2/scripts/bots/saveLevel.php";
		}
		var form = new WWWForm();

		var levelname = levelName;
		var description = levelDescription;

		var itemString = "<items> \n";
		var li = GameObject.FindGameObjectsWithTag("Level Item");
		for (item in li)
		{
			var name =  item.GetComponent("LevelItemData").itemName;
			itemString += "<item name=\"" + name + "\" x=\"" + Mathf.Round((item.transform.position.x) / 1.1f) + "\" z=\"" + Mathf.Round((item.transform.position.z) / 1.1f);
			if (name == "Start")
				itemString += "\" rot =\"" + newFacing % 4;
			itemString += "\" /> \n";
		}
		itemString += "</items> \n";
		//Debug.Log(itemString);

		var skinString = "<skin id=\"" + pickCol + "\" /> \n";

		form.AddField("user", dm.user.username);
		form.AddField("userid", dm.user.userID);
		//if(GLOBALS.PLAY_LEVEL_MODE == "edit")		{
		if(GLOBALS.PLAY_LEVEL_MODE == "edit")		{//testing line
			Debug.Log("Still Updating..."+ GLOBALS.CURRENT_LEVEL_ID);
			form.AddField("puzzleid", GLOBALS.CURRENT_LEVEL_ID);
    		form.AddField("filename", puzzleID);
		}
		form.AddField("puzzle", levelname);
		form.AddField("file","<author>"+GLOBALS.USERNAME+"</author>\n<name>"+levelname+"</name>\n<level>" + myLevel.GetComponent("CreateLevel").LevelAsArray().ToString() + "</level> \n" + itemString + skinString);
		form.AddField("description",description);
		if (GLOBALS.VERSION_NUM == 1)
			form.AddField("published",1);
		else
			form.AddField("published",0);

		form.AddField("version", GLOBALS.VERSION_NUM);

		//form.AddField("missioncompleted", missionCompletedArray);
		//form.AddField("highscore", highScoreArray);

		gameState = GameState.loading;
		//Working
		Debug.Log("User:" + GLOBALS.USERNAME);//Returns "admin"
		Debug.Log("UserID:" + GLOBALS.USER_ID);//Returns "1".
		//Debug.Log("Puzzle ID:" + GLOBALS.CURRENT_LEVEL_ID);//Causes an error, says the value is null.
		Debug.Log("FileName:" + puzzleID);// Seems to return an empty string, does not throw an error.
		Debug.Log("Puzzle:" + levelname);//Returns "My New Level".
		Debug.Log("File:" + "<author>"+GLOBALS.USERNAME+"</author>\n<name>"+levelname+"</name>\n<level>" + myLevel.GetComponent("CreateLevel").LevelAsArray().ToString() + "</level> \n" + itemString + skinString);//Not sure how to debug this field.
		Debug.Log("Description:" + description);//Returns "A level made by me!".
		Debug.Log("Published:");//Not sure how to debug this field.
		Debug.Log("Version:" + GLOBALS.VERSION_NUM);//Returns "0".
		//Debug.Log("MissionCompleted:" + storyModeState[missionCompleted][0]);
		//Debug.Log("HighScore:" + 	storyModeState[highScore][0]);//Returns "0".
		//Not sure if all fields have been debugged, are any missing?

		//Upload to a php script
		var w = WWW(URL, form);
		yield w;

		loading = false;
		if (w.error != null)
		{
			levelname=w.error;
			Debug.Log(w.error);
		}
		else
		{
			Debug.Log("Finished Uploading Level");
			Application.LoadLevel("Start");
		}
		showUploadWindow = false;

}
*/
//GLOBALS.EDIT End LevelEditor methods

/*
 *  returns number of buttons used to solve the puzzle.
 */
function NumberButtonsUsed() : int
{
	functionsUsed = new ArrayList();

	var buttonsUsed : int = CountButtonsUsed(mySpace);

	functionsUsed = new ArrayList();
	return buttonsUsed;
}

/*
 * Function recursively counts the number of blocks in the workspace
 * Only square buttons are counted.
 */
var functionsUsed : ArrayList;
function CountButtonsUsed(space : Workspace) : int
{
	var buttonsUsed : int;
	for(var i = 0; i < space.containers.length; i++)
	{
		if(space.buttonList[i] != null)
		{
			var button : DraggableButton = space.buttonList[i];
			if(button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.FUNCTION_STRUCT && !functionsUsed.Contains(button.title))
			{
				functionsUsed.Add(button.title);
				buttonsUsed++;
				buttonsUsed += CountButtonsUsed(funcSpaces[button.GetContent().GetTargetIndex()]);
			}
			else
			{
				buttonsUsed++;
			}
		}
	}

	return buttonsUsed;
}

/*
 * Function controls the window layering system
 * & displays the current window (last one added to the list).
 */
 var numOpenFuncIDs = new ArrayList();
function OrderWindows()
{
	//ITS OVER 9000!
	if(!postcard && ! pcQuestion) //to make sure the GUI window does not appear in the postcard creation window
		GUI.Window(9001, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), DisplayInfoWindow, "", "MoreInfo");

		for(var i = 0; i < windowList.length; i++)
		{
			var win = windowList[i];//new marker
			var text : String = "";

			switch(win.type)
			{
				case ADD_VAR:
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), AddVariable, "New Variable", "ShowVariable");
					break;
				case ADD_FUNC:
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*300/700), AddFunction, "New Function", "ShowFunction");
					break;
				case EDIT_VAR:
					text = "Edit Variable\n\" " + buttons[variableButtons][win.currentIndex].GetContent().GetName() + " \"";
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), ShowVariableSpace, text, "ShowVariable");
					break;
				case EDIT_OP :
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), ShowOperatorSpace, "Set Situation", "ShowOperator");
					break;
				case EDIT_LOOP :
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), ShowLoopSpace, "Edit For Loop", "ShowLoop");
					break;
				case EDIT_FUNC :
					text = "Edit Function\n\" " + buttons[functionButtons][win.currentIndex].GetContent().GetName() + " \"";
					GUI.Window(win.uniqueID, Rect(Screen.width*10/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), ShowFunctionSpace, text, "ShowFunction");
					if(!numOpenFuncIDs.Contains(win.uniqueID))
					{
						numOpenFuncIDs.Add(win.uniqueID);
					}
					break;
				default :
					GUI.Window(win.uniqueID, Rect(Screen.width*15/910, Screen.height*10/700, Screen.width*300/910, Screen.height*400/700), DisplayInfoWindow, "", "MoreInfo");
					break;
			}
		}


	if(windowList.length != 0)
	{
		var currWin : WindowWrapper = windowList[windowList.length - 1];
		GUI.BringWindowToFront(currWin.uniqueID);
	}
}
/*
 * Render the Action section of the toolkit
 */
function DisplayActions() {
	style = "Actions";
	if (buttons[actionButtons] == null)
		return;

	for(var i = 0; i < buttons[actionButtons].length; i++)
	{
		GUI.skin=piecesSkin;
		if(buttons[actionButtons][i] && buttons[actionButtons][i].Display() && buttons[actionButtons][i].copies > 0 && gameState == GameState.idle)
		{
			PickUp(buttons[actionButtons][i].CopyButton());
		}

		//GUI.skin=mySkin;
		if(buttons[actionButtons][i].copies > 0)
			GUI.Label(Rect(Screen.width*(buttons[actionButtons][i].pos.X+40)/910,Screen.height*(buttons[actionButtons][i].pos.Y+35)/700,Screen.width*35/910,Screen.height*35/700),(buttons[actionButtons][i].copies+" "));
	}
	GUI.skin=mySkin;
}

/*
 * Render the Variable section of the toolkit
 */
function DisplayVariables() {
	style = "Variables";


	for(var i = 0; i < buttons[variableButtons].length; i++)
	{
		if(!buttons[variableButtons][i])
			continue;

		GUI.skin=piecesSkin;
		if(buttons[variableButtons][i].title != "" && buttons[variableButtons][i].Display() && buttons[variableButtons][i].copies > 0 && gameState == GameState.idle){
			PickUp(buttons[variableButtons][i].CopyButton());
		}

		//GUI.skin=mySkin;
		if(buttons[variableButtons][i].copies > 0)
		GUI.Label(Rect(Screen.width*(buttons[variableButtons][i].pos.X+40)/910,Screen.height*(buttons[variableButtons][i].pos.Y+35)/700,Screen.width*35/910,Screen.height*35/700),(buttons[variableButtons][i].copies+" "));
	}
	GUI.skin=mySkin;
	if(GUI.Button(Rect(0, Screen.height*155/700, Screen.width*25/910,Screen.height*25/700),"+"))
	{
		addingVariable = true;
		//HERE
		//Debug.Log("1Pushed");
		windowList.push(new WindowWrapper(uniqueIDmaker, ADD_VAR, varCount));
	}
	if( varCount < VARIABLE_LIMIT )
		GUI.Label(Rect(Screen.width*10/910, Screen.height*162/700, Screen.width*35/910,Screen.height*35/700),((VARIABLE_LIMIT-varCount)+" "));

}

/*
 * Render the Operator section of the toolki
 */
function DisplayOperators() {
	style = "Operators";


	for(var i = 0; i < buttons[operatorButtons].length; i++)
	{
		GUI.skin=piecesSkin;
		if(buttons[operatorButtons][i].Display() && buttons[operatorButtons][i].copies > 0 && gameState == GameState.idle)
		{
			PickUp(buttons[operatorButtons][i].CopyButton());
		}

		//GUI.skin=mySkin;
		if(buttons[operatorButtons][i].copies > 0)
		GUI.Label(Rect(Screen.width*(buttons[operatorButtons][i].pos.X+40)/910,Screen.height*(buttons[operatorButtons][i].pos.Y+35)/700,Screen.width*35/910,Screen.height*35/700),(buttons[operatorButtons][i].copies+" "));
	}
	GUI.skin=mySkin;
}

/*
 * Render the Control section of the toolkit
 */
function DisplayControls() {
	style = "Controls";


	for(var i = 0; i < buttons[controlButtons].length; i++)
	{
		GUI.skin=piecesSkin;
		//Debug.Log("controlButton: "+controlButtons.length+ " i "+i);
		if(buttons[controlButtons][i].Display() && buttons[controlButtons][i].copies > 0 && gameState == GameState.idle)
		{
			PickUp(buttons[controlButtons][i].CopyButton());
		}

		//GUI.skin=mySkin;
		if(buttons[controlButtons][i].copies > 0)
		GUI.Label(Rect(Screen.width*(buttons[controlButtons][i].pos.X+40)/910,Screen.height*(buttons[controlButtons][i].pos.Y+35)/700,Screen.width*35/910,Screen.height*35/700),(buttons[controlButtons][i].copies+" "));
	}
	GUI.skin=mySkin;
}

/*
 * Render the Function section of the toolkit
 */
function DisplayFunctions() {
	style = "Functions";
	for(var i = 0; i < funcCount; i++)
	{
		//Debug.Log(functionButtons.length);
		//Debug.Log(functionButtons[0].title);
		GUI.skin=piecesSkin;
		if( buttons[functionButtons][i] && buttons[functionButtons][i].title != "" && buttons[functionButtons][i].Display() && buttons[functionButtons][i].copies > 0 && gameState == GameState.idle)
		{
			PickUp(buttons[functionButtons][i].CopyButton());
		}

		//GUI.skin=mySkin;
		if(buttons[functionButtons][i] && buttons[functionButtons][i].copies > 0)
		GUI.Label(Rect(Screen.width*(buttons[functionButtons][i].pos.X+40)/910,buttons[functionButtons][i].pos.Y+35,Screen.width*35/910,35),(buttons[functionButtons][i].copies+" "));
	}
	GUI.skin=mySkin;

	if(GUI.Button(Rect(0, Screen.height*155/700, Screen.width*25/910,Screen.height*25/700),"+"))
	 {
		windowList.push(new WindowWrapper(uniqueIDmaker, ADD_FUNC, funcCount));
	}
	if( funcCount < FUNCTION_LIMIT )
		GUI.Label(Rect(Screen.width*10/910, Screen.height*162/700, Screen.width*35/910,Screen.height*35/700),((FUNCTION_LIMIT-funcCount)+" "));
}

/*
 * Trash Functions
 */

function TrashFunctions(){
	for (i=0; i<funcCount; i++)
	{
		if(funcSpaces[i])
		{
			for(var piece in funcSpaces[i].buttonList)
			{
				if(piece != null && piece instanceof DraggableButton)
				{
					resetButtonCount(piece);
				}
			}
		}
	}
	funcSpaces = new Array();
	funcCount = 0;
}

/*
 * Trash Loop Spaces
 */

function TrashLoopSpaces(){
	for (var loop in loopSpaces)
	{
		for(var piece in loop.buttonList)
		{
			if(piece != null && piece instanceof DraggableButton)
			{
				resetButtonCount(piece);
			}
		}
	}
	loopSpaces = new Array();
}

/*
 * Trash Op Spaces
 */

function TrashOpSpaces(){
	for (var op in opSpaces)
	{
		for(var piece in op.buttonList)
		{
			if(piece != null && piece instanceof DraggableButton)
			{
				resetButtonCount(piece);
			}
		}
	}
	opSpaces = new Array();
}

/*
 * Render the MoreInfo Panel
 */

function DisplayInfoWindow()
{
	DisplayMoreInfo(0, 0, 300, 400);

	mySpace.Display(piecesSkin, gameState == GameState.idle);
	GUI.skin = piecesSkin;
	if(heldButton!=null)
	{
		heldButton.Display(10,10);
	}
	GUI.skin = mySkin;


}

/*
 * Shows more info about a button when hovering over it,
 * if not currently executing the program. Otherwise it
 * displays the execution directions.
 */
function DisplayMoreInfo(start_x: int, start_y: int, info_width: int, info_height: int)
{
	//if(gameState == GameState.loading)
		//return;

	var i = 0; var bp_x; var bp_y;
	var mp_x = Input.mousePosition.x-335;
	var mp_y = -Input.mousePosition.y+683-10;
	var endScroll : boolean = false;

	//********************************************************************************
	//Campaign Mode Stuff: Add Text for Tutorials
	//********************************************************************************
	//if(isTutorialLevel && TutorialIsLoaded)
	//{
		//********************************************************************************
		//GUI Tutorial Stuff- Level 1
		//********************************************************************************
		//if(levelInstructions.GetButtonIndex(buttonControl) == 1000)
		//{

			/*GUI.Label (Rect(0,0,Screen.width*300/910,Screen.height*400/700), levelInstructions.GetInstruction(buttonControl));
				if(GUI.Button(Rect(Screen.width*125/910,Screen.height*350/700,Screen.width*50/910,Screen.height*40/700),"NEXT"))
				{
					buttonControl++;
				}
			}
			else
			{
				if(GUI.Button(Rect(Screen.width*125/910,Screen.height*350/700,Screen.width*50/910,Screen.height*40/700),"NEXT"))
				{
					buttonControl++;
				}
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), levelInstructions.GetInstruction(buttonControl));
			}
	//	}


		if (dm.level==1)
		{
			if(buttonControl==0)
			{
				return;
			}

			else if (buttonControl==1)
			{
				return;
			}
			/*else if(buttonControl==2)
			{
				GUI.Label (Rect(Screen.width*40/910,Screen.height*40/700,Screen.width*220/910,Screen.height*90/700), commandArea);
				GUI.Label (Rect(Screen.width*100/910,Screen.height*130/700,Screen.width*100/910,Screen.height*100/700), programArea);
			}
			else if(buttonControl==3 || buttonControl==4|| buttonControl==5)
			{
				GUI.Label (Rect(Screen.width*105/910,Screen.height*80/700,Screen.width*90/910,Screen.height*90/700), act1);
			}
			else if(buttonControl==6 || buttonControl==8)
			{
				GUI.Label (Rect(Screen.width*105/910,Screen.height*80/700,Screen.width*90/910,Screen.height*90/700), act4);
			}
			else if(buttonControl==7)
			{
				GUI.Label (Rect(Screen.width*105/910,Screen.height*80/700,Screen.width*90/910,Screen.height*90/700), act2);
			}
			else if(buttonControl==9)
			{
				GUI.Label (Rect(Screen.width*140/910,Screen.height*80/700,Screen.width*25/910,Screen.height*25/700), "", "goButton");
			}*/

		//need to make sure level is ENTIRELY loaded
		//if(levelInstructions != null && levelInstructions.GetSize() > 0)
		if(dm.gameplayMode == "campaign")
		{
			if(dm.level == 1)
			{

					GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
					GUI.Label (Rect(0,148,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray1[0];
				         tutorialPicture = commandAreaPic;
				         break;
				     case 1:
				         text = tutorialTextArray1[1];
				         tutorialPicture = actionsExamplesPic;
				         break;
				     case 2:
				         text = tutorialTextArray1[2];
				         tutorialPicture = variableExamplesPic;
				         break;
				     case 3:
				         text = tutorialTextArray1[3];
				         tutorialPicture = operatorExamplesPic;
				         break;
				     case 4:
				         text = tutorialTextArray1[4];
				         tutorialPicture = controlsExamplesPic;
				         break;
				     case 5:
				         text = tutorialTextArray1[5];
				         tutorialPicture = functionsExamplesPic;
				         break;
				     case 6:
				         text = tutorialTextArray1[6];
				         tutorialPicture = programAreaNumbered;
				         break;
				     case 7:
				         text = tutorialTextArray1[7];
				         tutorialPicture = gameButtons;
				         break;
				     case 8:
				         text = tutorialTextArray1[8];
				         tutorialPicture = playButtonPic;
				         break;
				     case 9:
				         text = tutorialTextArray1[9];
				         tutorialPicture = stepButtonPic;
				         break;
				     case 10:
				         text = tutorialTextArray1[10];
				         tutorialPicture = stopButtonPic;
				         break;
				     case 11:
				         text = tutorialTextArray1[11];
				         tutorialPicture = trashButtonPic;
				         break;
				     case 12:
				         text = tutorialTextArray1[12];
				         tutorialPicture = levelDisplayWindow;
				         break;
				     case 13:
				         text = tutorialTextArray1[13];
				         tutorialPicture = switchPic;
				         break;
				     case 14:
				         text = tutorialTextArray1[14];
				         tutorialPicture = numberOfCommandsPic;
				         break;
				     case 15:
				         text = tutorialTextArray1[15];
				         tutorialPicture = null;
				         break;
				     case 16:
				         text = tutorialTextArray1[16];
				         tutorialPicture = level1Step1;
				         break;
				     case 17:
				         text = tutorialTextArray1[17];
				         tutorialPicture = level1Step2;
				         break;
				     case 18:
				         text = tutorialTextArray1[18];
				         tutorialPicture = level1Step3;

				         break;
				     case 19:
				         text = tutorialTextArray1[19];
				         tutorialPicture = null;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 19 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}

				//GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), levelInstructions.GetInstruction(0));
				displayInfo = false;
			}
			else if(dm.level == 2)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray2[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray2[1];
				         tutorialPicture = level2Step1;
				         break;
				     case 2:
				         text = tutorialTextArray2[2];
				         tutorialPicture = level2Step2;
				         break;
				     case 3:
				         text = tutorialTextArray2[3];
				         tutorialPicture = level2Step3;
				         break;
				     case 4:
				         text = tutorialTextArray2[4];
				         tutorialPicture = null;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 4 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				//GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), levelInstructions.GetInstruction(0));
				displayInfo = false;
			}
			else if(dm.level == 3)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray3[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray3[1];
				         tutorialPicture = level3Step1;
				         break;
				     case 2:
				         text = tutorialTextArray3[2];
				         tutorialPicture = level3Step2;
				         break;
				     case 3:
				         text = tutorialTextArray3[3];
				         tutorialPicture = level3Step3;
				         break;
				     case 4:
				         text = tutorialTextArray3[4];
				         tutorialPicture = level3Step4;
				         break;
				     case 5:
				         text = tutorialTextArray3[5];
				         tutorialPicture = level3Step5;
				         break;
				     case 6:
				         text = tutorialTextArray3[6];
				         tutorialPicture = level3Step6;
				         break;
				     case 7:
				         text = tutorialTextArray3[7];
				         tutorialPicture = level3Step7;
				         break;
				     case 8:
				         text = tutorialTextArray3[8];
				         tutorialPicture = level3Step8;
				         break;
				     case 9:
				         text = tutorialTextArray3[9];
				         tutorialPicture = level3Step9;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 9 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 4)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray4[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray4[1];
				         tutorialPicture = level4Step1;
				         break;
				     case 2:
				         text = tutorialTextArray4[2];
				         tutorialPicture = level4Step2;
				         break;
				     case 3:
				         text = tutorialTextArray4[3];
				         tutorialPicture = level4Step3;
				         break;
				     case 4:
				         text = tutorialTextArray4[4];
				         tutorialPicture = level4Step4;
				         break;
				     case 5:
				         text = tutorialTextArray4[5];
				         tutorialPicture = level4Step5;
				         break;
				     case 6:
				         text = tutorialTextArray4[6];
				         tutorialPicture = level4Step6;
				         break;
				     case 7:
				         text = tutorialTextArray4[7];
				         tutorialPicture = level4Step7;
				         break;
				     case 8:
				         text = tutorialTextArray4[8];
				         tutorialPicture = level4Step8;
				         break;
				     case 9:
				         text = tutorialTextArray4[9];
				         tutorialPicture = level4Step9;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 9 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 5)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray5[0];
				         tutorialPicture = null;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 6)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray6[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray6[1];
				         tutorialPicture = lightBlockPic;
				         break;
				     case 2:
				         text = tutorialTextArray6[2];
				         tutorialPicture = switchPic;
				         break;
				     case 3:
				         text = tutorialTextArray6[3];
				         tutorialPicture = level6Step1;
				         break;
				     case 4:
				         text = tutorialTextArray6[4];
				         tutorialPicture = level6Step2;
				         break;
				     case 5:
				         text = tutorialTextArray6[5];
				         tutorialPicture = level6Step3;
				         break;
				     case 6:
				         text = tutorialTextArray6[6];
				         tutorialPicture = level6Step4;
				         break;
				     case 7:
				         text = tutorialTextArray6[7];
				         tutorialPicture = level6Step5;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 7 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 7)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray7[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 8)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray17[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 9)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray8[0];
				         tutorialPicture = null;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 10)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray9[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray9[1];
				         tutorialPicture = heavyBlockPic;
				         break;
				     case 2:
				         text = tutorialTextArray9[2];
				         tutorialPicture = jumpOnHeavyBlock;
				         break;
				     case 3:
				         text = tutorialTextArray9[3];
				         tutorialPicture = null;
				         break;
				     case 4:
				         text = tutorialTextArray9[4];
				         tutorialPicture = level9Step1;
				         break;
				     case 5:
				         text = tutorialTextArray9[5];
				         tutorialPicture = level9Step2;
				         break;
				     case 6:
				         text = tutorialTextArray9[6];
				         tutorialPicture = level9Step3;
				         break;
				     case 7:
				         text = tutorialTextArray9[7];
				         tutorialPicture = level9Step4;
				         break;
				     case 8:
				         text = tutorialTextArray9[8];
				         tutorialPicture = level9Step5;
				         break;
				     case 9:
				         text = tutorialTextArray9[9];
				         tutorialPicture = level9Step6;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 9 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 11)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray10[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 12)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray17[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 13)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray11[0];
				         tutorialPicture = null;
				         break;
					}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 14)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray12[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray12[1];
				         tutorialPicture = null;
				         break;
				     case 2:
				         text = tutorialTextArray12[2];
				         tutorialPicture = null;
				         break;
				     case 3:
				         text = tutorialTextArray12[3];
				         tutorialPicture = null;
				         break;
				     case 4:
				         text = tutorialTextArray12[4];
				         tutorialPicture = null;
				         break;
				     case 5:
				         text = tutorialTextArray12[5];
				         tutorialPicture = null;
				         break;
				     case 6:
				         text = tutorialTextArray12[6];
				         tutorialPicture = null;
				         break;
				     case 7:
				         text = tutorialTextArray12[7];
				         tutorialPicture = null;
				         break;
				     case 8:
				         text = tutorialTextArray12[8];
				         tutorialPicture = null;
				         break;
				     case 9:
				         text = tutorialTextArray12[9];
				         tutorialPicture = null;
				         break;
				     case 10:
				         text = tutorialTextArray12[10];
				         tutorialPicture = null;
				         break;
				     case 11:
				         text = tutorialTextArray12[11];
				         tutorialPicture = null;
				         break;
				     case 12:
				         text = tutorialTextArray12[12];
				         tutorialPicture = null;
				         break;
				     case 13:
				         text = tutorialTextArray12[13];
				         tutorialPicture = null;
				         break;
				     case 14:
				         text = tutorialTextArray12[14];
				         tutorialPicture = level12Step1;
				         break;
				     case 15:
				         text = tutorialTextArray12[15];
				         tutorialPicture = level12Step2;
				         break;
				     case 16:
				         text = tutorialTextArray12[16];
				         tutorialPicture = level12Step3;
				         break;
				     case 17:
				         text = tutorialTextArray12[17];
				         tutorialPicture = null;
				         break;
				     case 18:
				         text = tutorialTextArray12[18];
				         tutorialPicture = level12Step5;
				         break;
				     case 19:
				         text = tutorialTextArray12[19];
				         tutorialPicture = level12Step6;
				         break;
				     case 20:
				         text = tutorialTextArray12[20];
				         tutorialPicture = level12Step7;
				         break;
				     case 21:
				         text = tutorialTextArray12[21];
				         tutorialPicture = level12Step8;
				         break;
				     case 22:
				         text = tutorialTextArray12[22];
				         tutorialPicture = level12Step9;
				         break;
				     case 23:
				         text = tutorialTextArray12[23];
				         tutorialPicture = null;
				         break;
				     case 24:
				         text = tutorialTextArray12[24];
				         tutorialPicture = level12Step11;
				         break;
				     case 25:
				         text = tutorialTextArray12[25];
				         tutorialPicture = level12Step12;
				         break;
				     case 26:
				         text = tutorialTextArray12[26];
				         tutorialPicture = level12Step13;
				         break;
				     case 27:
				         text = tutorialTextArray12[27];
				         tutorialPicture = level12Step14;
				         break;
				     case 28:
				         text = tutorialTextArray12[28];
				         tutorialPicture = level12Step15;
				         break;
				     case 29:
				         text = tutorialTextArray12[29];
				         tutorialPicture = level12Step16;
				         break;
				     case 30:
				         text = tutorialTextArray12[30];
				         tutorialPicture = null;
				         break;
				     case 31:
				         text = tutorialTextArray12[31];
				         tutorialPicture = level12Step18;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 31 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 15)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray13[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 16)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray16[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 17)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray14[0];
				         tutorialPicture = null;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 18)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray15[0];
				         tutorialPicture = null;
				         break;
				     case 1:
				         text = tutorialTextArray15[1];
				         tutorialPicture = null;
				         break;
				     case 2:
				         text = tutorialTextArray15[2];
				         tutorialPicture = null;
				         break;
				     case 3:
				         text = tutorialTextArray15[3];
				         tutorialPicture = null;
				         break;
				     case 4:
				         text = tutorialTextArray15[4];
				         tutorialPicture = null;
				         break;
				     case 5:
				         text = tutorialTextArray15[5];
				         tutorialPicture = null;
				         break;
				     case 6:
				         text = tutorialTextArray15[6];
				         tutorialPicture = level15Step1;
				         break;
				     case 7:
				         text = tutorialTextArray15[7];
				         tutorialPicture = level15Step2;
				         break;
				     case 8:
				         text = tutorialTextArray15[8];
				         tutorialPicture = level15Step3;
				         break;
				     case 9:
				         text = tutorialTextArray15[9];
				         tutorialPicture = level15Step4;
				         break;
				     case 10:
				         text = tutorialTextArray15[10];
				         tutorialPicture = level15Step5;
				         break;
				     case 11:
				         text = tutorialTextArray15[11];
				         tutorialPicture = level15Step6;
				         break;
				     case 12:
				         text = tutorialTextArray15[12];
				         tutorialPicture = level15Step7;
				         break;
				     case 13:
				         text = tutorialTextArray15[13];
				         tutorialPicture = level15Step8;
				         break;
				     case 14:
				         text = tutorialTextArray15[14];
				         tutorialPicture = level15Step9;
				         break;
				     case 15:
				         text = tutorialTextArray15[15];
				         tutorialPicture = level15Step10;
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 15 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 19)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray13[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			else if(dm.level == 20)
			{
				GUI.Label (Rect(0,17,Screen.width*300/910,Screen.height*400/700), text);
				GUI.Label (Rect(0,200,Screen.width*300/910,Screen.height*400/700), tutorialPicture);

				switch (currentPage)
				{
				     case 0:
				         text = tutorialTextArray17[0];
				         break;
				}

				if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 - 100,Screen.height*350/700,Screen.width*50/910 + 70,Screen.height*40/700),"Previous Page"))
				{
				     currentPage--;
				}
				else if (currentPage != 0 && GUI.Button(Rect(Screen.width*125/910 + 50,Screen.height*350/700,Screen.width*50/910 + 50,Screen.height*40/700),"Next Page"))
				{
				     currentPage++;
				}
				displayInfo = false;
			}
			/*else if(dm.level == 17)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "This level will teach you how to properly use a for loop control. Follow the instructions to solve the following level!");
				displayInfo = false;
			}
			else if(dm.level == 18)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "It's time to use what you've learned! Solve this challenge level by using the skills you've learned in the previous levels.");
				displayInfo = false;
			}
			else if(dm.level == 19)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "Now we will attempt to measure your ability to solve a puzzle that requires the manipulation of heavy blocks. Attempt to solve the following level!");
				displayInfo = false;
			}
			else if(dm.level == 20)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "This level will teach you how to properly use the heavy block. Follow the instructions to solve the following level!");
				displayInfo = false;
			}
			else if(dm.level == 21)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "It's time to use what you've learned! Solve this challenge level by using the skills you've learned in the previous levels.");
				displayInfo = false;
			}
			else if(dm.level == 22)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "Now we will attempt to measure your ability to solve a puzzle that uses at least 1 function. Attempt to solve the following level!");
				displayInfo = false;
			}
			else if(dm.level == 23)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "This level will teach you how to properly use a function. Follow the instructions to solve the following level!");
				displayInfo = false;
			}
			else if(dm.level == 24)
			{
				GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "It's time to use what you've learned! Solve this challenge level by using the skills you've learned in the previous levels.");
				displayInfo = false;
			}*/
			else
			GUI.Box (Rect(0,0,Screen.width*300/910,Screen.height*400/700), "If you see this message, the tutorial didn't end on time.");
		}

	//}
	/*else
	{
		//*******************************************************************************
		if(gameState != GameState.running)
		{
			info_width = info_width - 14;
			GUI.Label(Rect(Screen.width*start_x/910, Screen.height*start_y/700, Screen.width*info_width/910, Screen.height*50/700),"More Info...");
		}
		else if(gameState == GameState.running)
		{
			endScroll = true;
			scrollViewVector = GUI.BeginScrollView (Rect(Screen.width*start_x/910, Screen.height*start_y/700, Screen.width*info_width/910, Screen.height*info_height/700), scrollViewVector, Rect(Screen.width*(start_x-5)/910, start_y, Screen.width*284/910, 800), false, false);
			GUI.Label(Rect(Screen.width*-5/910, Screen.height*10/700, Screen.width*300/910, Screen.height*800/700),"___________DIRECTIVE___________\n" + directions);
		}
		else
		{
			var currentButtons;
			switch (style)
			{
			case "Actions": currentButtons = buttons[actionButtons]; //Debug.Log("Action");
			break;
			case "Variables": currentButtons = buttons[variableButtons]; //Debug.Log("Variable");
			break;
			case "Operators": currentButtons = buttons[operatorButtons];// Debug.Log("Operators");
			break;
			case "Controls": currentButtons = buttons[controlButtons];// Debug.Log("Controls");
			break;
			case "Functions": currentButtons =  buttons[functionButtons];// Debug.Log("Functs");
			break;
			default: currentButtons = buttons[actionButtons]; break;
			}

			for(i = 0; i < currentButtons.length; i++)
			{
				if(!currentButtons[i])
					continue;

				bp_x = currentButtons[i].pos.X;
				bp_y = currentButtons[i].pos.Y;
				var currentInfo;
				switch (style)
				{
					case "Variables": try{currentInfo = buttons[variableButtons][i].GetInfoString() + "Value: " + varValues[i];}
										    catch(err){currentInfo = buttons[variableButtons][i].GetInfoString() + "Value: undefined";} break;
					default: currentInfo = currentButtons[i].GetInfoString(); break;
				}

				if (currentButtons[i].hasContent && currentButtons[i].IsHovered(new Vector2(tabs_group.x, tabs_group.y)))
				{
					GUI.Label(Rect(Screen.width*start_x/910, Screen.height*start_y/700,Screen.width*info_width/910, Screen.height*info_height/700), "\n\n\n" + currentInfo);
					if(style == "Functions" && i < funcSpaces.length)
					{
					funcSpaces[i].offset = start_y + 75;
					funcSpaces[i].Display(piecesSkin, gameState == GameState.idle);
					funcSpaces[i].offset = 0;
					}
				}
			}
		}
	}*/
	if(endScroll)
		GUI.EndScrollView();
}

/*
 * Render New Variable Panel
 */
function AddVariable(windowID : int)
{
	GUI.skin = mySkin;
	var currWindow: WindowWrapper = windowList[windowList.length - 1];
	if(currWindow.type == ADD_VAR)
	{
		TextSanitizer.AlphaNumeric();
		GUI.Label(Rect(Screen.width*20/910, Screen.height*50/700, Screen.width*25/910, Screen.height*25/700), variableIcon);
		newVariableName = GUI.TextField (Rect(Screen.width*50/910, Screen.height*50/700, Screen.width*100/910, Screen.height*25/700), newVariableName, "textField" );
		GUI.Label(Rect(Screen.width*150/910, Screen.height*50/700, Screen.width*25/910,Screen.height*25/700),"=");
		newVariableValue = GUI.TextField (Rect(Screen.width*175/910, Screen.height*50/700, Screen.width*50/910, Screen.height*25/700), newVariableValue, "textField" );
		if( varCount < VARIABLE_LIMIT )
		{
			if(GUI.Button(Rect(Screen.width*245/910, Screen.height*50/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
			{
				if(varCount < 8)
				{
					buttons[variableButtons][varCount] = new ButtonSource(new Point(10+65*varCount,40),55,55,mySpace,newVariableName, varCount, "blueCircle");
				}else if(varCount < 16)
				{
					buttons[variableButtons][varCount] = new ButtonSource(new Point(10+65*(varCount-8),100),55,55,mySpace,newVariableName, varCount, "blueCircle");
				}
				buttons[variableButtons][varCount].moreInfo.SetInstructionType(INSTRUCTION_TYPE.VARIABLE);
				buttons[variableButtons][varCount].moreInfo.SetTargetIndex(varCount);
				buttons[variableButtons][varCount].SetContentDescription("Stores a value that can be used and manipulated by other instructions.");
				varValues[varCount] = newVariableValue;
				addingVariable = false;
				newVariableName = "name";
				newVariableValue = "value";
				varCount++;
				Debug.Log("1");
				windowList.pop();
			}
		}else
		{
							Debug.Log("2");

			windowList.pop();
			ShowMessageBox("gui_error", "Sorry, but you can't \nmake any more of these.");
		}

		if(GUI.Button(Rect(Screen.width*275/910, Screen.height*50/700, Screen.width*25/910, Screen.height*25/700), "","stopButton"))
		{
			addingVariable = false;
			newVariableName = "name";
			newVariableValue = "value";

							Debug.Log("3");

			windowList.pop();
		}
		DisplayMoreInfo(0,105,300,305);

		mySpace.Display(piecesSkin, gameState == GameState.idle);
		GUI.skin = piecesSkin;
		if(heldButton!=null) heldButton.Display(10,10);
		GUI.skin = mySkin;
	}
}

/*
 * Render New Function Panel
 */
function AddFunction(windowID : int)
{
	if(windowList.length == 0)
		return;

	//Debug.Log("WindowList "+(windowList.length));
	var currWindow: WindowWrapper = windowList[windowList.length - 1];
	if(currWindow.type == ADD_FUNC)
	{
		if(!setFuncSpace)
		{
			funcSpaces[funcCount] = new Workspace("function "+funcCount, 25, 80,  3, 4, 65, this);
			setFuncSpace = true;
		}
		GUI.Label(Rect(Screen.width*25/910, Screen.height*35/700, Screen.width*25/910, Screen.height*25/700), functionIcon);

		TextSanitizer.AlphaNumeric();

		newFunctionName = GUI.TextField (Rect(Screen.width*50/910, Screen.height*35/700, Screen.width*180/910, Screen.height*25/700), newFunctionName, "textField" );
		if(funcCount < FUNCTION_LIMIT)
		{
			if(newFunctionName != "")
			{
				if(GUI.Button(Rect(Screen.width*240/910, Screen.height*35/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
				{
					if(funcCount < 8)
					{
						buttons[functionButtons][funcCount] = new ButtonSource(new Point(10+65*funcCount,40),55,55,mySpace,newFunctionName, funcCount, "button");
					}else if(funcCount < 16)
					{
						buttons[functionButtons][funcCount] = new ButtonSource(new Point(10+65*(funcCount-8),100),55,55,mySpace,newFunctionName, funcCount, "button");
					}
					buttons[functionButtons][funcCount].moreInfo.SetTargetIndex(funcCount);
					buttons[functionButtons][funcCount].moreInfo.SetInstructionType(INSTRUCTION_TYPE.FUNCTION_STRUCT);
					buttons[functionButtons][funcCount].SetContentDescription("Double Click to open. Instructions inside the function will execute before the next one after the function.");
					funcSpaces[funcCount].name = newFunctionName;
					newFunctionName = "name";
					funcCount++;
					setFuncSpace = false;
									Debug.Log("4");

					windowList.pop();
				}
			}
			else
				GUI.Button(Rect(Screen.width*240/910, Screen.height*35/700, Screen.width*25/910, Screen.height*25/700), "", "PlayDeactivated");
		} else
		{
			Debug.Log("5");
			windowList.pop();
			ShowMessageBox("gui_error", "Sorry, but you can't \nmake any more of these.");
		}

		if(GUI.Button(Rect(Screen.width*270/910, Screen.height*35/700, Screen.width*25/910, Screen.height*25/700), "", "stopButton"))
		{
			newFunctionName = "name";
			setFuncSpace = false;
			Debug.Log("6");
			windowList.pop();
		}

		if(setFuncSpace == true)
		{
			funcSpaces[funcCount].Display(piecesSkin, gameState == GameState.idle);
		}
		DisplayMoreInfo(0,290,300,120);

		mySpace.Display(piecesSkin, gameState == GameState.idle);
		GUI.skin = piecesSkin;

		if(heldButton!=null) heldButton.Display(10,10);
		GUI.skin = mySkin;
	}

}

/*
 * Displays the appropriate Variable editing space
 */
function ShowVariableSpace()
{
	if(windowList.length > 0)
	{
		GUI.skin = mySkin;

		var currWindow: WindowWrapper = windowList[windowList.length - 1];
		if(currWindow.type == EDIT_VAR)
		{
			TextSanitizer.Numeric();

			varValues[currWindow.currentIndex] = GUI.TextField(Rect(Screen.width*175/910, Screen.height*50/700, Screen.width*50/910, Screen.height*25/700), varValues[currWindow.currentIndex], "textField" );

			//button to close the window
			if(GUI.Button(Rect(Screen.width*245/910, Screen.height*50/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
			{
				Debug.Log("7");
				windowList.pop();

			}
			DisplayMoreInfo(0,105,300,305);

			mySpace.Display(piecesSkin, gameState == GameState.idle);
			GUI.skin = piecesSkin;
			if(heldButton!=null) heldButton.Display(10,10);
			GUI.skin = mySkin;
		}
	}
}

/*
 * Displays the appropriate Function editing space
 */
function ShowFunctionSpace()
{
	if(windowList.length > 0)
	{
		GUI.skin = mySkin;

		GUI.Label(Rect(Screen.width*85/910, 0, Screen.width*25/910, Screen.height*25/700), functionIcon);
		var currWindow: WindowWrapper = windowList[windowList.length - 1];
		if(currWindow.type == EDIT_FUNC)
		{
			funcSpaces[currWindow.currentIndex].Display(piecesSkin, gameState == GameState.idle);
			//button to close the window
			if(GUI.Button(Rect(Screen.width*245/910, Screen.height*35/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
			{
				numOpenFuncIDs.Remove(currWindow.uniqueID);
				Debug.Log("8");
				windowList.pop();
			}

			DisplayMoreInfo(0,290,300,120);

			mySpace.Display(piecesSkin, gameState == GameState.idle);
			GUI.skin = piecesSkin;

			if(heldButton!=null) heldButton.Display(10,10);
			GUI.skin = mySkin;
		}
	}
}

/*
 * Displays the appropriate Operator editing space
 */
function ShowOperatorSpace()
{
	if(windowList.length > 0)
	{

		GUI.skin = mySkin;
		var currWindow: WindowWrapper = windowList[windowList.length - 1];
		if(currWindow.type == EDIT_OP)
		{
			opSpaces[currWindow.currentIndex].Display(piecesSkin, gameState == GameState.idle);

			//button to close the window
			if (GUI.Button(Rect(Screen.width*265/910, Screen.height*40/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
			{
				Debug.Log("9");
				windowList.pop();
			}

			DisplayMoreInfo(0,105,300,305);

			mySpace.Display(piecesSkin, gameState == GameState.idle);
			GUI.skin = piecesSkin;

			if(heldButton!=null) heldButton.Display(10,10);
			GUI.skin = mySkin;

		}
	}

}

/*
 * Displays the appropriate Loop editing space
 */
function ShowLoopSpace()
{
	if(windowList.length > 0)
	{
		GUI.skin = mySkin;
		var currWindow: WindowWrapper = windowList[windowList.length - 1];
		if(currWindow.type == EDIT_LOOP)
		{
			loopSpaces[currWindow.currentIndex].Display(piecesSkin, gameState == GameState.idle);

			if (loopSpaces[currWindow.currentIndex].limitValue == "" || loopSpaces[currWindow.currentIndex].initValue == "" ||
				loopSpaces[currWindow.currentIndex].limitValue.Split("-"[0]).length > 2 || loopSpaces[currWindow.currentIndex].initValue.Split("-"[0]).length > 2)
			{
				GUI.Button(Rect(Screen.width*265/910, Screen.height*40/700, Screen.width*25/910, Screen.height*25/700), "", "PlayDeactivated");
			}
			else
			{
				//button to close the window
				if (GUI.Button(Rect(Screen.width*265/910, Screen.height*40/700, Screen.width*25/910, Screen.height*25/700), "", "goButton"))
				{

					loopSpaces[currWindow.currentIndex].setInformation();
					Debug.Log("10");
					windowList.pop();
				}
			}


			DisplayMoreInfo(0,255,300,155);

			mySpace.Display(piecesSkin, gameState == GameState.idle);
			GUI.skin = piecesSkin;

			if(heldButton!=null)
			{
				heldButton.Display(10,10);
			}
			GUI.skin = mySkin;
		}
	}
}

//this function creates a new space of the selected type
//it then returns the target index to the caller

//this function is called in ButtonSource.CopyButton when a new button is created
function NewButtonSpace(button : ButtonSource) : int
{
	var type = button.moreInfo.GetInstructionType();
	var index : int;
	switch(type)
	{
//		case INSTRUCTION_TYPE.OPERATOR:
//			opSpaces.push(new OperatorSpace("opSpace", 65, 40, this, button.moreInfo.GetOperatorType()));
//			index = opSpaces.length - 1;
//			break;
		case INSTRUCTION_TYPE.VARIABLE_ACTION:
			opSpaces.push(new OperatorSpace("opSpace", 65, 40, this, button.moreInfo.GetOperatorType(), true));
			index = opSpaces.length - 1;
			break;
		case INSTRUCTION_TYPE.BRANCH_STRUCT:
			if(button.title == "if")
			{
				opSpaces.push(new OperatorSpace("opSpace", 65, 40, this, button.moreInfo.GetOperatorType(), true));
				index = opSpaces.length -1;
			}
			break;
		case INSTRUCTION_TYPE.LOOP_STRUCT:
			if(button.title == "while")
			{
				opSpaces.push(new OperatorSpace("opSpace", 65, 40, this, button.moreInfo.GetOperatorType(), true));
				index = opSpaces.length -1;
			}else
			{
				loopSpaces.push(new LoopSpace("loopSpace", 65, 40, this));
				index = loopSpaces.length -1;
				loopSpaces[index].setInformation();
			}
			break;
		case INSTRUCTION_TYPE.FUNCTION_STRUCT:
			index = button.moreInfo.GetTargetIndex();
			break;
		case INSTRUCTION_TYPE.VARIABLE:
			index = button.moreInfo.GetTargetIndex();
			break;
		default:
			break;//Debug.Log("create action");
	}
	return index;

}

function ShowButtonSpace(button : DraggableButton)
{
	//don't do anything if the program is running or a dialog is open
	if(!(gameState == GameState.idle))
		return;

	//here it should display appropriateList[targetIndex]
	//for example if the type passed in is VARIABLE ACTION and the index is 3
	//this should display the space contained at opSpaces[3] if there is one.
	var targetIndex = button.GetContent().GetTargetIndex();
	var type = button.GetContent().GetInstructionType();
	button.SetWindowID(uniqueIDmaker);
//	Debug.Log("I created window: " + uniqueIDmaker);
	//HERE
	switch(type)
	{
		case INSTRUCTION_TYPE.OPERATOR: //Operator
			if (opSpaces.length > targetIndex)
			{
				return; //operator spaces are not used any more
				//Debug.Log("3Pushed");
				//windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_OP, targetIndex));
				//if(windowList[windowList.length-2].type == EDIT_OP)
				//{
				//	var temp = windowList.pop();
				//	windowList.pop();
					//Debug.Log("4Pushed");
				//	windowList.push(temp);

				//}
			}
			break;
		case INSTRUCTION_TYPE.VARIABLE_ACTION: //Set
			if (opSpaces.length > targetIndex)
			{
				windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_OP, targetIndex));
				if(windowList[windowList.length-2].type == EDIT_OP)
				{
					Debug.Log("11");
					var temp2 = windowList.pop();

					windowList.pop();
					windowList.push(temp2);
				}
			}
			break;
		case INSTRUCTION_TYPE.BRANCH_STRUCT: // if
			if (opSpaces.length > targetIndex && button.title == "if")
			{
				//Debug.Log("7Pushed");
				windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_OP, targetIndex));
			}
			break;
		case INSTRUCTION_TYPE.LOOP_STRUCT:
			if (button.title == "while" && opSpaces.length > targetIndex) //while loop
			{
				//Debug.Log("5Pushed");
				windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_OP, targetIndex));
			}
			else if (button.title == "for" && loopSpaces.length > targetIndex) //for loop
			{
				//Debug.Log("6Pushed");
				windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_LOOP, targetIndex, button.title));
			}
			else{
				//Debug.Log("I a winner");
			}
			break;
		case INSTRUCTION_TYPE.VARIABLE:
			//HERE
			//Debug.Log("8Pushed");
			windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_VAR, targetIndex));
			break;
		case INSTRUCTION_TYPE.FUNCTION_STRUCT:
			//HERE
			//Debug.Log("9Pushed");
			windowList.push(new WindowWrapper(uniqueIDmaker, EDIT_FUNC, targetIndex));
			break;
//			Debug.Log("create new nothing");
	}
	uniqueIDmaker++;
	return;
}

/*
 * Function closes the buttons window, if the button is removed while the window is opened.
 */
function RemoveButtonSpace(button : DraggableButton)
{
	for( var i = 0; i < windowList.length; i++)
	{
		if(button.windowID == windowList[i].uniqueID)
		{
			windowList.RemoveAt(i);

			Debug.Log("I closed my window: " + button.windowID);
		}
	}
	if(button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.FUNCTION_STRUCT)
	{
		numOpenFuncIDs.Remove(button.windowID);
	}


}


/*
 * Function sets the button currently being held by the mouse
 * Function called from a workspace
 */
function PickUp(button : DraggableButton) : boolean
{
	if (button == null)
		return;

	if (heldButton == null && gameState == GameState.idle)
	{
		heldButton = button;
		return true;
	}
	else
	{
		return false;
	}
}

/*
 * Function determines if a button was dropped in a
 * safe location. Function called from a workspace.
 */
function Drop(button : DraggableButton) : boolean
{
	/*if(!isTutorialLevel)
		return DropTutorial(button);
	else
	{*/
		if (heldButton == button)
		{
			heldButton = null;
			var placement : int = mySpace.IsLegalDrop(button.pos);
			var currWindow : WindowWrapper;

			if(placement != -1 && !button.style.Contains("Circle") && !button.style.Contains("Triangle"))
			{

				if(mySpace.buttonList[placement]!=null)
				{
					scootButtons(mySpace.buttonList[placement], placement);
				}

				button.SetWorkspace(mySpace, placement);

				mySpace.AddButton(button, placement);
				return true;
			}
			else if(windowList.length != 0 )
			{

				currWindow = windowList[windowList.length - 1];
				//Debug.Log("Current Window: " + currWindow.type);

				if(currWindow.type == ADD_FUNC)
				{


					var function_placement : int = funcSpaces[funcSpaces.length-1].IsLegalDrop(button.pos);

					if(function_placement != -1 && !button.style.Contains("Circle") && !button.style.Contains("Triangle"))
					{

						if(funcSpaces[funcSpaces.length-1].buttonList[function_placement]!=null)
						{

							scootButtons(funcSpaces[funcSpaces.length-1].buttonList[function_placement], function_placement);
							//handleButtonCleanup(funcSpaces[funcSpaces.length-1].buttonList[function_placement]);
						}
						button.SetWorkspace(funcSpaces[funcSpaces.length-1], function_placement);
						funcSpaces[funcSpaces.length-1].AddButton(button, function_placement);
						return true;
					}
				}
				else if (currWindow.type == EDIT_OP)
				{

					var op_placement : int = opSpaces[currWindow.currentIndex].IsLegalDrop(button, button.pos);
					if(op_placement != -1)
					{

						if(opSpaces[currWindow.currentIndex].buttonList[op_placement]!=null)
						{

							handleButtonCleanup(opSpaces[currWindow.currentIndex].buttonList[op_placement]);
						}
						button.SetWorkspace(opSpaces[currWindow.currentIndex], op_placement);
						opSpaces[currWindow.currentIndex].AddButton(button, op_placement);
						return true;
					}
				}
				else if (currWindow.type == EDIT_LOOP)
				{

					var loop_placement : int = loopSpaces[currWindow.currentIndex].IsLegalDrop(button, button.pos);
					if(loop_placement != -1)
					{

						if(loopSpaces[currWindow.currentIndex].buttonList[loop_placement]!=null && !button.style.Contains("Triangle"))
						{

							handleButtonCleanup(loopSpaces[currWindow.currentIndex].buttonList[loop_placement]);
						}
						button.SetWorkspace(loopSpaces[currWindow.currentIndex], loop_placement);
						loopSpaces[currWindow.currentIndex].AddButton(button, loop_placement);
						return true;
					}
				}
				else if (currWindow.type == EDIT_FUNC)
				{
					//find closest index
					var func_placement : int = funcSpaces[currWindow.currentIndex].IsLegalDrop(button.pos);

					if(func_placement != -1 && !button.style.Contains("Circle") && !button.style.Contains("Triangle"))
					{

						if(funcSpaces[currWindow.currentIndex].buttonList[func_placement]!=null)
						{

							scootButtons(funcSpaces[currWindow.currentIndex].buttonList[func_placement], func_placement);
							//handleButtonCleanup(funcSpaces[currWindow.currentIndex].buttonList[func_placement]);
						}
						button.SetWorkspace(funcSpaces[currWindow.currentIndex], func_placement);
						funcSpaces[currWindow.currentIndex].AddButton(button, func_placement);
						return true;
					}
				}
			}

			handleButtonCleanup(button);
			button.SetWorkspace(null, -1);
			RemoveButtonSpace(button);


			//Debug.Log("*************I deleted myself " + button.moreInfo.GetName() + "***************");
			return false;
		}
		else {
			return false;
		}
	//}
}

function DropTutorial(button : DraggableButton) : boolean
{
	if (heldButton == button)
	{
//		Debug.Log("by this point I am held: "+ heldButton.title);
		heldButton = null;
		var placement : int = mySpace.IsLegalDrop(button.pos);
		//var currWindow : WindowWrapper;
		//var buttonID = button.GetPPI();
		buttonSot = levelInstructions.GetButtonIndex(buttonControl);

		if(placement != -1)
		{
			if(levelInstructions.GetTargetWindow(buttonControl) != -1)
			{
				handleButtonCleanup(button);
				button.SetWorkspace(null, -1);
				RemoveButtonSpace(button);
				return false;
			}
		}

		if(button.style.Contains("Circle"))
		{
			if(buttonControl<levelInstructions.GetSize())
			{
				Debug.Log("BUTTONCOUNT: "+buttonControl+" LENGTH: "+levelInstructions.GetSize());

				buttonSot=levelInstructions.GetButtonIndex(buttonControl);
				buttonID = -1;
				if(buttonID == buttonSot)
				{
					Debug.Log("ButtonID: "+buttonID);
					mySpace.AddButton(button, placement);
					buttonControl++;
					return true;
				}
			}
		}
		if(placement != -1 && !button.style.Contains("Circle") && !button.style.Contains("Triangle"))
		{
			button.SetWorkspace(mySpace, placement);

			buttonID=button.GetPPI();


			Debug.Log("TEST BUTTONID: "+buttonID + " STYLE: " + style);
			Debug.Log("STYLE NEEDED: " + levelInstructions.GetStyle(buttonControl));
			Debug.Log("BUTTON NEEDED: " + levelInstructions.GetButtonIndex(buttonControl));
			Debug.Log("INSTRUCTION: " + levelInstructions.GetInstruction(buttonControl));

			if(buttonControl<levelInstructions.GetSize()+1)
			{
				Debug.Log("BUTTONCOUNT: "+buttonControl+" LENGTH: "+levelInstructions.GetSize());
				buttonID=button.GetPPI();
				//Debug.Log("Array Value: "+levelInstructions.GetButtonIndex(buttonControl));
				buttonSot=levelInstructions.GetButtonIndex(buttonControl);
				if(buttonID == buttonSot && (style == levelInstructions.GetStyle(buttonControl) || "DEBUG" == levelInstructions.GetStyle(buttonControl)) && levelInstructions.GetTargetIndex(buttonControl) == placement)
				{
					Debug.Log("ButtonID: "+buttonID);
					mySpace.AddButton(button, placement);
					buttonControl++;
					return true;
				}
//				else
//				{
//					///////////////////////////Fix for declining function availability////////////////
//					handleButtonCleanup(button);
//					button.SetWorkspace(null, -1);
//					RemoveButtonSpace(button);
//					///////////////////////////End Fix for declining function availability////////////
//					Debug.Log("You did not select the right command, try again");
//					Debug.Log(GLOBALS.campaign);
//				}
			}
//			else
//			{
//				Debug.Log("Please Execute");
//			}
//			return true;
		}
		else if(windowList.length != 0 )// ADD FUNCTIONALLITY FOR LEVEL INSTRUCTIONS
		{
			currWindow = windowList[windowList.length - 1];
			Debug.Log("Current Window: " + currWindow.currentIndex);

			if(currWindow.type != levelInstructions.GetTargetWindow(buttonControl) || levelInstructions.GetTargetWindowID(buttonControl) != currWindow.currentIndex)
			{
				handleButtonCleanup(button);
				button.SetWorkspace(null, -1);
				RemoveButtonSpace(button);
				return false;
			}

			if(currWindow.type == ADD_FUNC || currWindow.type == EDIT_FUNC)
			{
				var func_placement : int = funcSpaces[currWindow.currentIndex].IsLegalDrop(button.pos);
				if(func_placement != -1 && !button.style.Contains("Circle") && !button.style.Contains("Triangle"))
				{
					button.SetWorkspace(funcSpaces[currWindow.currentIndex], func_placement);

					buttonID = button.GetPPI();
					//Debug.Log("Array Value: "+levelInstructions.GetButtonIndex(buttonControl));
					buttonSot=levelInstructions.GetButtonIndex(buttonControl);
					if(buttonID == buttonSot &&
					   (style == levelInstructions.GetStyle(buttonControl) || "DEBUG" == levelInstructions.GetStyle(buttonControl)) &&
					   levelInstructions.GetTargetIndex(buttonControl) == func_placement)
					{
						Debug.Log("ButtonID: "+buttonID);
						funcSpaces[currWindow.currentIndex].AddButton(button, func_placement);
						buttonControl++;
						return true;
					}
				}
			}
			else if (currWindow.type == EDIT_OP)
			{
				var op_placement : int = opSpaces[currWindow.currentIndex].IsLegalDrop(button, button.pos);
				if(op_placement != -1)
				{
					buttonID=button.GetPPI();
					//Debug.Log("Array Value: "+levelInstructions.GetButtonIndex(buttonControl));
					buttonSot=levelInstructions.GetButtonIndex(buttonControl);
					if(buttonID == buttonSot && (style == levelInstructions.GetStyle(buttonControl) || "DEBUG" == levelInstructions.GetStyle(buttonControl)) && levelInstructions.GetTargetIndex(buttonControl) == op_placement)
					{
						Debug.Log("ButtonID: "+buttonID);
						if(opSpaces[currWindow.currentIndex].buttonList[op_placement]!=null)
						{
							handleButtonCleanup(opSpaces[currWindow.currentIndex].buttonList[op_placement]);
						}
						button.SetWorkspace(opSpaces[currWindow.currentIndex], op_placement);
						opSpaces[currWindow.currentIndex].AddButton(button, op_placement);
						buttonControl++;
						return true;
					}
				}
			}
			else if (currWindow.type == EDIT_LOOP)
			{
				var loop_placement : int = loopSpaces[currWindow.currentIndex].IsLegalDrop(button, button.pos);
				if(loop_placement != -1 )
				{
					buttonID=button.GetPPI();
					//Debug.Log("Array Value: "+levelInstructions.GetButtonIndex(buttonControl));
					buttonSot=levelInstructions.GetButtonIndex(buttonControl);
					if(buttonID == buttonSot && (style == levelInstructions.GetStyle(buttonControl) || "DEBUG" == levelInstructions.GetStyle(buttonControl)) && levelInstructions.GetTargetIndex(buttonControl) == loop_placement)
					{
						Debug.Log("ButtonID: "+buttonID);
						if(loopSpaces[currWindow.currentIndex].buttonList[loop_placement]!=null)
						{
							handleButtonCleanup(loopSpaces[currWindow.currentIndex].buttonList[loop_placement]);
						}
						button.SetWorkspace(loopSpaces[currWindow.currentIndex], loop_placement);
						loopSpaces[currWindow.currentIndex].AddButton(button, loop_placement);
						buttonControl++;




						return true;
					}

				}
			}
		}

		handleButtonCleanup(button);
		button.SetWorkspace(null, -1);
		RemoveButtonSpace(button);

		//Debug.Log("*************I deleted myself " + button.moreInfo.GetName() + "***************");
		return false;
	}
	else
	{
		return false;
	}
}


function scootButtons(button : DraggableButton, placement : int)
{
	//Debug.Log("Scooting required on button " + button.moreInfo.GetName());

	if(button.GetWorkspace().buttonList.length <= placement+1)
	{
		handleButtonCleanup(button.GetWorkspace().buttonList[placement]);
		return;
	}

	if(button.GetWorkspace().buttonList[placement+1]!=null)
	{
		scootButtons(button.GetWorkspace().buttonList[placement+1], placement+1);
	}
	button.SetWorkspace(button.GetWorkspace(), placement+1);
	button.GetWorkspace().AddButton(button, placement+1);
	button.CheckSlider();

}

/*
 * determines which buttons need to be reaccounted for.
 */
 function handleButtonCleanup(button : DraggableButton)
 {
 	var myContents : Array;

	resetButtonCount(button);

	if(button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.BRANCH_STRUCT )//button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.OPERATOR ||
	{
		myContents = opSpaces[button.GetContent().GetTargetIndex()].buttonList;
		if(myContents != null)
		{
			if(myContents[0] != null)
			{
				//Debug.Log(myContents[0].title);
				resetButtonCount(myContents[0]);
			}
			if(myContents[2] != null)
			{
				//Debug.Log(myContents[2].title);
				resetButtonCount(myContents[2]);
			}
		}
	}

	if(button.title == "while")
	{
		myContents = opSpaces[button.GetContent().GetTargetIndex()].buttonList;
		if(myContents != null)
		{
			for(var i = 0; i < myContents.length; i++)
			{
				if(myContents[i] != null )
				{
					//Debug.Log(myContents[i].title);
					resetButtonCount(myContents[i]);
				}
			}
		}
	}

	if(button.title == "for")
	{
		myContents = loopSpaces[button.GetContent().GetTargetIndex()].buttonList;
		if(myContents != null)
		{
			for(var j = 0; j < myContents.length; j++)
			{
				if(myContents[j] != null)
				{
					//Debug.Log(myContents[j].title);
					resetButtonCount(myContents[j]);
				}
			}
		}
	}

	if(button.title == "set")
	{
		myContents = opSpaces[button.GetContent().GetTargetIndex()].buttonList;
		if(myContents != null)
		{
			for(var k = 0; k < myContents.length; k++)
			{
				if(myContents[k] != null )
				{
					//Debug.Log(myContents[i].title);
					resetButtonCount(myContents[k]);
				}
			}
		}
	}
 }

/**actionButtons
 * Function replaces a life to the pool for a
 * button that was just deleted.
 */
function resetButtonCount(button : DraggableButton)
{
	if(button.GetPPI() == -1)
		return;

	var target : ButtonSource;
	switch(button.GetContent().GetInstructionType())
	{
		case INSTRUCTION_TYPE.ROBOT_ACTION:
			target = buttons[actionButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.VARIABLE_ACTION:
			target = buttons[controlButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.LOOP_STRUCT:
			target = buttons[controlButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.BRANCH_STRUCT:
			target = buttons[controlButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.FUNCTION_STRUCT:
			target = buttons[functionButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.VARIABLE:
			target = buttons[variableButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.ESCAPE:
			target = buttons[controlButtons][button.GetPPI()]; break;
		case INSTRUCTION_TYPE.OPERATOR:
			target = buttons[operatorButtons][button.GetPPI()]; break;
		default: return;
	}
	target.copies++;
}
//8888888888888888888888888888888888888888888888888888888888
function ClearMessage()
{
	messageContent.text = "";
	messageType = "";
}

function DisplayMessage()
{

	if (messageContent.text == "" || messageType == "")

		{
			ClearMessage();
			return;
		}
	//HACK: This is terrible. Need to define this by Window Type rather than by the text.
	if(messageType == "win" || messageType == "win_tutorial" )
	{
		if (GUI.Button(Rect(Screen.width*125/910 + 25, Screen.height*180/700, Screen.width*55/910, Screen.height*55/700), "Review"))
		{
			ClearMessage();
			Stop();
			gameState = GameState.resetting;
		}

		if(GUI.Button(Rect(Screen.width*125/910 - 75, Screen.height*180/700, Screen.width*55/910, Screen.height*55/700), "done"))
		{
			if(gameState != GameState.loading)
			{
				if(dm.gameplayMode == "campaign")
				{
					path = myRobot.GetComponent("Robot").GetLastPath();
					Debug.Log(path);

					for (var counter = 0; counter < buttons[functionButtons].length; counter++)
					{
						if (buttons[functionButtons][counter] && buttons[functionButtons][counter].copies < 10)
						{
							Debug.Log(buttons[functionButtons][counter].copies);
							usedFunction = true;
						}
						else
						Debug.Log("No functions in position " + counter);

						if (usedFunction == true)
						{
							break;
						}
					}

					if (buttons[controlButtons][1] && buttons[controlButtons][1].copies < 10)
					{
						Debug.Log(buttons[controlButtons][1].copies);
						usedForLoop = true;
					}
					else
					Debug.Log("No For Loops used");
					//comeback
					numOfCommandsUsed = NumberButtonsUsed();
					if(numOfCommandsUsed < 1 && dm.level == 5)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 6)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 17 && dm.level == 7)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 8)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 9)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 10)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 15 && dm.level == 11)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 12)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 13)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 14)
					{
						iNeedTeaching = false;
					}
					else if((numOfCommandsUsed < 16 || usedFunction) && dm.level == 15)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 16)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 17)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 18)
					{
						iNeedTeaching = false;
					}
					else if((numOfCommandsUsed < 28 && usedFunction) && dm.level == 19)
					{
						iNeedTeaching = false;
					}
					else if(numOfCommandsUsed < 1 && dm.level == 20)
					{
						iNeedTeaching = false;
					}

					/*if(path.IndexOf("Forward") != -1 && dm.level == 1)
					{
						iNeedTeaching = false;
					}
					else if (path.IndexOf("Backward") != -1 && dm.level == 4)
					{
						iNeedTeaching = false;
					}
					else if (path.IndexOf("Turn Right") != -1 || path.IndexOf("Turn Left") != -1 && dm.level == 7)
					{
						iNeedTeaching = false;
					}
					else if(path.IndexOf("Pick Up/Put Down") != -1 && dm.level == 10)
					{
						iNeedTeaching = false;
					}
					else if(path.IndexOf("Jump") != -1 && dm.level == 13)
					{
						iNeedTeaching = false;
					}
					else if(usedForLoop == true && dm.level == 16)
					{
						iNeedTeaching = false;
					}
					else if(usedFunction == true && dm.level == 22)
					{
						iNeedTeaching = false;
					}*/
					usedFunction = false;
					usedForLoop = false;

					if(dm.level == 1)
					score1 = NumberButtonsUsed();
					else if(dm.level == 2)
					score2 = NumberButtonsUsed();

				}

				AddStringToLog("Completed using " + NumberButtonsUsed() + " buttons");
				SubmitScore(1);
				Stop();
				Trash();
				ClearMessage();
				gameState = GameState.scoring;
			}
		}
	}
	else if(messageType == "skip")
	{
		if(GUI.Button(Rect(Screen.width*125/910 - 75, Screen.height*180/700, Screen.width*55/910, Screen.height*55/700), "done"))
		{
			ClearMessage();
			if(gameState != GameState.loading)
			{
				AddStringToLog("SKIPPING");
			}
			gameState = GameState.scoring;
			Stop();
			Trash();
		}
	}
	else if (messageType == "help")
	{
		if(GUI.Button(Rect(Screen.width*125/910-15, Screen.height*180/700 + 250, Screen.width*55/910 + 25, Screen.height*55/700), "Return"))
		{
			Stop();
			ClearMessage();
		}
	}
	else if(GUI.Button(Rect(Screen.width*125/910 - 40, Screen.height*180/700, Screen.width*55/910 + 35, Screen.height*55/700), "ok"))
	{
		if(gameState != GameState.loading)
		{
			AddStringToLog("Failed using " + NumberButtonsUsed() + " buttons");
			SubmitScore(0);
		}
		if(gameState == GameState.running)
		{
			Stop();
		}

		ClearMessage();

		if(!(dm.gameplayMode == "campaign") || !messageType.Contains("win"))
			gameState = GameState.resetting;
		else
			gameState = GameState.scoring;
	}

	GUI.skin = mySkin;
	//GUI.EndGroup();
}

function Help()
{
	if(dm.gameplayMode == "campaign")
	{
		if(dm.level == 7)
		{
			ShowMessageBox("help", "The solution to this level is shown below: \n" +
			"Forward \n Turn Left \n Pickup/Put Down \n Turn Right \n Turn" +
			"Right \n Pickup/Put down \n Turn Left \n Forward \n Turn Left \n" +
			"Pickup/Put down \n Turn Right \n Turn Right \n Pickup/Put Down" +
			"\n Turn Left \n Forward \n Pickup/Put Down \n Turn Left \n Pickup/Put Down");
		}
		else if (dm.level == 11)
		{
			ShowMessageBox("help","The solution to this level is shown below: \n" +
			"Pickup/Put Down \n Turn Right \n Forward \n Pickup/Put Down \n Backward" +
			"\n Turn Left \n Forward \n" +
			"Pickup/Put down \n Backward \n Turn Right \n Forward" +
			"\n Forward \n Pickup/Put Down \n Foward \n Foward");
		}
		else if (dm.level == 15)
		{
			ShowMessageBox("help","The solution to this level is shown below: \n" +
			"For Loop{ \n Forward} \n Change var = 1 to var = 9 \n Turn Left \n Forward" +
			"\n Forward \n Turn Left \n For Loop{ \n Forward} \n Change var = 1 to var = 9 \n" +
			"Turn Right \n Forward \n" +
			"Forward \n Turn Right \n Forward \n Pickup/Put Down" +
			"\n Backward \n Pickup/Put Down");
		}
		else if (dm.level == 19)
		{
			ShowMessageBox("help", "The solution to this level is shown below: \n" +
			"Forward \n Make a function with \n the following: \n Pickup/Put Down \n Forward \n Turn" +
			"Right \n Jump \n Jump \n Turn Left \n Jump \n" +
			"Turn Right \n Turn Right \n Pickup/Put Down \n Save the Function" +
			"\n Make a second function \n with the following: \n Turn Left \n Turn Left" +
			"\n Jump \n Jump \n Turn Right \n Save the Function \n Function1 \n Function2 \n Jump \n" +
			"Function1 \n Function2 \n Jump \n Function1 \n Function2");
		}
	}
	else if(!helpUsedOnce)
	{
		ShowMessageBox("help", "Complete a level by having a 'weight'\n on every 'switch'.\n" +
						"The robot also counts as a 'weight'.\n\n" +
						"For more help, press 'ok', then\n" +
						"select the tab for the area you want\n help on, and select '?' again.");
	}
	else
	{
		switch (style)
			{
				case "Actions":
					ShowMessageBox("help","'Actions' move the robot.\n\n" +
									"The robot will do that action one time.\n" +
									"\nEach 'Action' is counted as 1 command");
					break;

				case "Variables":
					ShowMessageBox("help","'Variables' hold a value.\n\n" +
									"These can be used in 'Controls',\n" +
									"");
					break;

				case "Operators":
					ShowMessageBox("help","Green 'Operators' change Variable values,\n\n" +
									"Orange 'Operators' compare two values,\n\n" +
									"These can be used in 'Controls',\n" +
									"");
					break;

				case "Controls":
					ShowMessageBox("help","'Controls' affect the robot's actions\n\n" +
									"by repeating them or changing them \n" +
									"'while' repeats them while a condition is true,\n" +
									"'for' repeats them as it counts to a number,\n" +
									"'if' does them only if a condition is met,\n" +
									"'set' changes a 'Variable' value,\n" +
									"\nEach 'Control' is counted as 1 command");
					break;

				case "Functions":
					ShowMessageBox("help","'Functions' hold a group of actions,\n" +
									"that can be used over and over.\n" +
									"\nEach Function is counted as 1 command,\n" +
									"and everything inside the function is\n" +
									"only counted once, no matter how many times\n" +
									"the Function is used.");
					break;

				default:

					break;
			}
	}
	helpUsedOnce = true;
}

//Clicking the "Run" button Maximizes the RobotWorld screen,
//and tells the reobot to execute steps until the pointer in the main workspace has nowhere to step forward to.
function Run()
{
	Maximize();

	if(gameState==GameState.idle)
	{
		mySpace.SetInstPoint(0);

		holdingVals.clear();
		for(val in varValues)
		{
			holdingVals.push(val);
		}
	}
	gameState = GameState.running;

	while (myRobot && !myRobot.GetComponent("Robot").HasError() && gameState == GameState.running && !mySpace.pointer.IsComplete())
	{
		yield StepForward();
	}

	if(gameState == GameState.idle)
		return;

	levelIsSubmittable = false;//IsSubmittable();

	if(levelIsSubmittable)
	{
		setNewSpawnPoint = true;
		showUploadWindow = true;
	}
	else
	showNotSubmittableWindow = true;

	lastStepCompleted = true;
	gameState = GameState.finished;
}

function StepForward()
{
	lastStepCompleted = false;

	if (gameState == GameState.idle)
	{
		mySpace.SetInstPoint(0);

		holdingVals.clear();
		for(val in varValues)
		{
			holdingVals.push(val);
		}
	}



	if(!mySpace.pointer.IsComplete())
	{
		directions = mySpace.ExecuteNextInstruction(0);

		HighlightStep();




		myRobot.GetComponent("Robot").Run();

		if(mySpace && mySpace.pointer && mySpace.pointer.IsComplete())
		{
			return;
		}


		while (gameState != GameState.resetting && myRobot.GetComponent("Robot").running)
			yield WaitForSeconds(0.001);
	}
	lastStepCompleted = true;

	if(mySpace.pointer.IsComplete() || myRobot.GetComponent("Robot").HasError())
		gameState = GameState.finished;

	return;
}

function HighlightStep()
{
	ShowHighlightedStep = true;
}

function Stop() {
	Minimize();
	mySpace.SetInstPoint(0);
	gameState = GameState.resetting;

	playonce = false;
	ShowHighlightedStep = false;
	errorInCode = false;

	if(myLevel)
	{
		myLevel.GetComponent("CreateLevel").ResetLevel();
	}

	varValues.clear();
	for(val in holdingVals)
	{
		varValues.push(val);
	}
}

function Trash() {

	haveButton = false; buttonCount = 0;
	TrashFunctions();
	TrashLoopSpaces();
	TrashOpSpaces();

	for(var piece in mySpace.buttonList)
	{
		if(piece != null)
		{
			resetButtonCount(piece);
		}
	}
	windowList.Clear();


	//**********************************************
	//If is campaign mode, reset buttonControl for tutorial arrays
	//**********************************************
	if(isTutorialLevel)
	{
		buttonControl=0;
		for(var i = 0; i < funcCount ; i++)
		{
			for(var piece in funcSpaces[i].buttonList)
			{
				if(piece != null)
				{
					resetButtonCount(piece);
				}
			}
			funcSpaces[i] = new Workspace("function "+i, 25, 80,  3, 4, 65, this);
		}
	}
	//************************************************
	mySpace = new Workspace("main", 445, 320, 4, 5, 65, this);
}

function Load()
{
	//Load the mini-map view
    cameraMM = GameObject.Find("/MMCamera");
	myLevel = GameObject.Find("/Main_Level");

	if (cameraMM != null)
	{
		cameraMM.camera.rect = cameraSmallRect;
		cameraMM.GetComponent("MouseOrbit2").ResetCamera();
		myRobot = myLevel.GetComponent("CreateLevel").myRobot.gameObject;
		if(myLevel)
		{
			myLevel.GetComponent("CreateLevel").ResetLevel();
		}
		gameState = GameState.idle;
	}
}

function Maximize()
{
	cameraMM.GetComponent("MouseOrbit2").UpdateValues(mySkin, buttonSize, buttonOffset, this, windowList);
	cameraMM.camera.rect = cameraBigRect;
	cameraMM.GetComponent("MouseOrbit2").cam1 = true; //vcat
	cameraMM.GetComponent("MouseOrbit2").enabled = true;
	cameraMM.GetComponent("MouseOrbit2").maximized = true;
	isMaximized = true;
}

function Minimize()
{
	cameraMM.camera.rect = cameraSmallRect;
	cameraMM.GetComponent("MouseOrbit2").cam1 = true;
	cameraMM.GetComponent("MouseOrbit2").ResetCamera();
	cameraMM.GetComponent("MouseOrbit2").enabled = true;
	cameraMM.GetComponent("MouseOrbit2").maximized = false;
	isMaximized = false;
}

//sets the gui to display a dialog box with the appropriate text
function ShowMessageBox(type: String, text : String)
{
		Debug.Log(text);
		gameState = GameState.displaying;
		messageType = type;
		messageContent = new GUIContent(text);
}

//This function submits a score and logs the player's solution so they can reload it later.
function SubmitScore(success : int)
{
	if(!(dm.gameplayMode == "edit"))
	{
		Debug.Log("try to submit");
		var state : String = ""; //construct state

		try
		{
			state += "main - " + mySpace.ToString() + ";\n";

			for(i=0; i<funcSpaces.length; i++)
			{
				try
				{
					state += "func " + i + " " + funcSpaces[i].name + " - " + funcSpaces[i].ToString() + ";\n";
				}
				catch(Error)
				{
					Debug.Log(Error);
				}
			}
			for(i=0; i<opSpaces.length; i++)
			{
				try
				{
					state += "opSpace " + i + " - " + opSpaces[i].ToString() + ";\n";
				}
				catch(Error)
				{
					Debug.Log(Error);
				}
			}
			for(i=0; i<loopSpaces.length; i++)
			{
				try
				{
					state += "loopSpace " + i + " - " + loopSpaces[i].ToString() + ";\n";
				}
				catch(Error)
				{
					Debug.Log(Error);
				}
			}
			for(i=0; i<varValues.length; i++)
			{
				state += "var " + i + " - " + holdingVals[i].ToString() + ";\n";
			}
		}
		catch(Error)
		{
			Debug.Log(Error);
		}

		var path = ""; //construct path?
		try
		{
			path = myRobot.GetComponent("Robot").GetLastPath();
		}
		catch(Error)
		{
			Debug.Log(Error);
		}
		dm.SubmitScore(success, NumberButtonsUsed(), state, path);
	}
}

function EndLevel()
{
	//gameState = GameState.displaying;
	//messageContent = new GUIContent("Skipping the Level");
}

/* FUNCTIONS USED FOR LOGGING PLAYER INFORMATION */

function AddStringToLog(s : String)
{
	dm.CreateLog(s);
}


/* FUNCTIONS USED FOR REBUILDING SAVED SOLUTIONS */

//This function rebuilds a user's last saved solution
function RebuildWorkspace()
{

	//format is several segments, separated by semicolon
	// title - {index, button}{index, button}...{index, button};

	//first, I need to load the most recent solution from the database
	var ID = dm.levelToLoad;
	var URL = dm.location + "scripts/bots/getSolution.php";
	var form = new WWWForm();

	if(dm.gameplayMode == "campaign" && (dm.level == 5 ||dm.level == 9 ||dm.level == 13 ||dm.level == 17))
		form.AddField("userid", 1);
	else
		form.AddField("userid", dm.user.userID);
	
	form.AddField("puzzle",dm.levelToLoad);

	var w : WWW = new WWW(URL, form);

//	yield dm.GetSolution();
	yield w;
	try
	{
		var contents : String = w.text;
		Debug.Log(contents);
		var spaces : String[] = contents.Split(";"[0]);
		for (var space in spaces)
		{
			var spaceName = space.Split("-"[0])[0].Trim();
			if (spaceName == "main")
			{
				//reconstruct main workspace, button by button
				var workspaceState : String[] = space.Split("-"[0])[1].Replace('{',' ').Split('}'[0]);
				for (var newButton : String in workspaceState)
				{
					if (newButton == "")
					break;

					Debug.Log(newButton.Split(','[0])[1]);
					var temp = parseInt(newButton.Split(','[0])[0]);

					var b = GetButton(newButton.Trim());
					if(b)
					{
						b.SetWorkspace(mySpace, temp);
						mySpace.AddButton(b, temp);
					}
					else
					{
						Debug.Log("Can't get " + newButton);
					}
				}
			}
			else if (spaceName.Contains("var"))
			{
				Debug.Log((spaceName.Split(" "[0])[1]));
				target = parseInt(spaceName.Split(" "[0])[1]);
				varValue = space.Split("-"[0])[1];//parseInt(space.Split("-"[0])[1]);
				varValues[target] = varValue;
			}
			else if (spaceName.Contains("loopSpace"))
			{
				if(spaceName != "" && spaceName.Split(" "[0]).Length > 1)
				{
					Debug.Log("Space Name: " + spaceName);
					loopSpaces.push(new LoopSpace("loopSpace", 65, 40, this));

					//construct a new workspace, if one does not exist
					var loopspaceState : String[] = space.Split("-"[0])[1].Replace('{',' ').Split('}'[0]);
					Debug.Log((spaceName.Split(" "[0])[1]));
					target = parseInt(spaceName.Split(" "[0])[1]);

					//rebuild the function workspace, button by button
					for (var newButton : String in loopspaceState)
					{
						if (newButton.Trim() == "")
						break;

						Debug.Log((newButton.Split(','[0])[0]));
						var temp_l = parseInt(newButton.Split(','[0])[0]);

						if(newButton.Contains("initValue"))
						{
							//var initValue = newButton.Split(','[0])[2].Trim();
							loopSpaces[target].setInitValue(newButton.Split(','[0])[2].Trim());
						}
						else if(newButton.Contains("limitValue"))
						{
							//var limitValue = newButton.Split(','[0])[2].Trim();
							loopSpaces[target].setLimitValue(newButton.Split(','[0])[2].Trim());
						}
						else
						{
							var b_l = GetButton(newButton.Trim());
							if(b_l)
							{
								b_l.SetWorkspace(loopSpaces[target], temp_l);
								loopSpaces[target].AddButton(b_l, temp_l);
							}
						}
					}
				}
			}
			else if (spaceName.Contains("opSpace"))
			{
				if(spaceName != "" && spaceName.Split(" "[0]).Length > 1)
				{
					//construct a new workspace, if one does not exist
					var opspaceState : String[] = space.Split("-"[0])[1].Replace('{',' ').Split('}'[0]);
					Debug.Log((spaceName.Split(" "[0])[1]));
					target = parseInt(spaceName.Split(" "[0])[1]);

					Debug.Log("Space Name: " + spaceName);

					//BuildOperator(target, OPERATOR_TYPE.NOT_AN_OPERATOR);

					//rebuild the workspace, button by button
					for (var newButton : String in opspaceState)
					{
						Debug.Log("--State: " + newButton);
						if (newButton.Trim() == "")
						break;

							Debug.Log((newButton.Split(','[0])[0]));
							var temp_o = parseInt(newButton.Split(','[0])[0]);

						if(newButton.Contains("numberValue"))
						{
							opSpaces[target].setNumberValue(newButton.Split(','[0])[2].Trim());
						}
						else
						{
							var b_o = GetButton(newButton.Trim());
							if(b_o)
							{
								if(b_o.moreInfo.GetInstructionType() == INSTRUCTION_TYPE.OPERATOR)
									opSpaces[target].SetOpCode(b_o.moreInfo.GetOperatorType());
								b_o.SetWorkspace(opSpaces[target], temp_o);
								opSpaces[target].AddButton(b_o, temp_o);
							}
						}
					}
				}
			}
			else //anything else is a function
			{
				if(spaceName != "" && spaceName.Split(" "[0]).Length > 2)
				{
					//Debug.Log("Space Name: " + spaceName);
					//construct a new function workspace, if one does not exist
					var funcspaceState : String[] = space.Split(" "[0])[1].Replace('{',' ').Split('}'[0]);
					Debug.Log((spaceName.Split(" "[0])[1]));
					target = parseInt(spaceName.Split(" "[0])[1]);

					var newName = spaceName.Split(" "[0])[2];
					//functions that are built but not used in any other workspace will have a generic name ATM
					//TODO: fix this
					BuildFunction(target, newName);

					//rebuild the function workspace, button by button
					for (var newButton : String in funcspaceState)
					{
						if (newButton.Trim() == "")
						break;

						Debug.Log((newButton.Split(','[0])[0]));
						var temp_f = parseInt(newButton.Split(','[0])[0]);

						var b_f = GetButton(newButton.Trim());
						if(b_f)
						{
							b_f.SetWorkspace(funcSpaces[target], temp_f);
							funcSpaces[target].AddButton(b_f, temp_f);
						}
					}
				}
			}
		}

		//loopSpaces.Pop();
		//Debug.Log(mySpace);
		//Debug.Log(opSpaces);
		//Debug.Log(loopSpaces);
	}

	catch(e)
	{
		Debug.Log("Error Loading Previous Level State: " + e);
		Trash();

	}
	solutionLoaded = true;

}

//This function gets a button with the same name as the input
function GetButton(input : String) : DraggableButton
{
	var newButton = input.Split(","[0]);
	var index = newButton[0].Trim();
	var name = newButton[1].Trim();

	var toReturn : DraggableButton;

	if(newButton.length > 2)
	{
		var space = newButton[2];
		var type = space.Trim().Split(" "[0])[0];
		var target = parseInt(space.Trim().Split(" "[0])[1]);

		switch (name)
		{
			case "++":
				toReturn = buttons[operatorButtons][0].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "--":
				toReturn = buttons[operatorButtons][1].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "=":
				toReturn = buttons[operatorButtons][2].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "+=":
				toReturn = buttons[operatorButtons][3].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "-=":
				toReturn = buttons[operatorButtons][4].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "==":
				toReturn = buttons[operatorButtons][5].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case ">":
				toReturn = buttons[operatorButtons][6].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "<":
				toReturn = buttons[operatorButtons][7].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;


			case "while":
				toReturn = buttons[controlButtons][0].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				toReturn.SetPosSlide(parseInt(newButton[3].Trim().Split(' '[0])[1]), parseInt(newButton[3].Trim().Split(' '[0])[2]), true);
				break;
			case "for":
				toReturn = buttons[controlButtons][1].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				toReturn.SetPosSlide(parseInt(newButton[3].Trim().Split(' '[0])[1]), parseInt(newButton[3].Trim().Split(' '[0])[2]), true);
				break;
			case "if":
				toReturn = buttons[controlButtons][2].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				toReturn.SetPosSlide(parseInt(newButton[3].Trim().Split(' '[0])[1]), parseInt(newButton[3].Trim().Split(' '[0])[2]), true);
				break;
			case "set":
				toReturn = buttons[controlButtons][3].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				toReturn.moreInfo.SetTargetIndex(target);
				break;

			case "blank":
				toReturn = null;
				break;
			default:
				if (type == "funcspace")
				{
					var funcNum = parseInt(target);
					BuildFunction(funcNum, name);
					toReturn = buttons[functionButtons][funcNum].CopyButton();
					}
				else if (type == "varvalue")
				{
					var varNum = parseInt(target);
					toReturn = buttons[variableButtons][varNum].CopyButton();
					}
				break;

		}
	}
	else
	{
		switch (name)
		{
			case "Backward":
				toReturn = buttons[actionButtons][0].CopyButton();
				break;
			case "Forward":
				toReturn = buttons[actionButtons][1].CopyButton();
				break;
			case "Turn Left":
				toReturn = buttons[actionButtons][2].CopyButton();
				break;
			case "Turn Right":
				toReturn = buttons[actionButtons][3].CopyButton();
				break;
			case "Pick Up/Put Down":
				toReturn = buttons[actionButtons][4].CopyButton();
				break;
			case "Jump":
				toReturn = buttons[actionButtons][5].CopyButton();
				break;

			 /*
			    case "Place Switch":
				Debug.Log("Copy of Switch Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][6].CopyButton() : null;
			    break;
		    //Box
			case "Place Box":
				Debug.Log("Copy of Box Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][7].CopyButton() : null;
			    break;
		    //Spawn
			case "Set Spawn":
				Debug.Log("Copy of Spawn Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][8].CopyButton() : null;
			    break;
			//Raise Ground
			case "Raise Ground":
				Debug.Log("Copy of Ground Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][9].CopyButton() : null;
			    break;
			//Lower Ground
			case "Lower Ground":
				Debug.Log("Romoves Copy of Ground Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][10].CopyButton() : null;
			    break;
			//HeavyBox
		    case "HeavyBox":
				Debug.Log("Copy of HeavyBox Created");
			    toReturn = (GLOBALS.EDIT) ? buttons[actionButtons][11].CopyButton() : null;
			    break;

			*/

			case "++":
				toReturn = buttons[operatorButtons][0].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "--":
				toReturn = buttons[operatorButtons][1].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "=":
				toReturn = buttons[operatorButtons][2].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "+=":
				toReturn = buttons[operatorButtons][3].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "-=":
				toReturn = buttons[operatorButtons][4].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "==":
				toReturn = buttons[operatorButtons][5].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case ">":
				toReturn = buttons[operatorButtons][6].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;
			case "<":
				toReturn = buttons[operatorButtons][7].CopyButton();
				//BuildOperator(target, toReturn.moreInfo.GetOperatorType());
				break;


			case "while":
				toReturn = buttons[controlButtons][0].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "for":
				toReturn = buttons[controlButtons][1].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "if":
				toReturn = buttons[controlButtons][2].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				break;
			case "set":
				toReturn = buttons[controlButtons][3].CopyButton();
				toReturn.moreInfo.SetTargetIndex(target);
				break;

			case "blank":
				toReturn = null;
				break;
			default:
				toReturn = null;
				break;
		}
	}
	toReturn.isOnMouse = false;
	return toReturn;
}

//This function creates a new "Function" block with the given name and index
function BuildFunction(funcNum : int, name : String)
{
	if(funcNum >= funcSpaces.length || !funcSpaces[funcNum])
	{
		funcSpaces[funcNum] = new Workspace("function "+funcNum, 25, 80,  3, 4, 65, this);
		funcSpaces[funcNum].name = name;

		if(funcNum < 8)
		{
			buttons[functionButtons][funcNum] = new ButtonSource(new Point(10+65*funcNum,40),55,55,mySpace,name, funcNum, "button");
		}else if(funcNum < 16)
		{
			buttons[functionButtons][funcNum] = new ButtonSource(new Point(10+65*(funcNum-8),100),55,55,mySpace,name, funcNum, "button");
		}
		buttons[functionButtons][funcNum].moreInfo.SetTargetIndex(funcNum);
		buttons[functionButtons][funcNum].moreInfo.SetInstructionType(INSTRUCTION_TYPE.FUNCTION_STRUCT);
		buttons[functionButtons][funcNum].SetContentDescription("Double Click to open. Instructions inside the function will execute before the next one after the function.");
	}


	if (funcNum >= funcCount)
		funcCount = funcNum + 1;
}

//This function rebuilds loop and operator spaces
function BuildOperator(target : int, OpCode : OPERATOR_TYPE)
{
	if(target<=opSpaces.length || !opSpaces.length)
	{
		Debug.Log("Building new OpSpace: " + OpCode);
		opSpaces[target] = new OperatorSpace("opSpace", 65, 40, this, OpCode, true);
	}
}
