//****************************************************
//Tutorial Mode
//Edited by Drew Hicks on 1/30/2013
//****************************************************

static var currentLevel : int;
static var nextLevel : int;
static var newLevel : boolean = false;
static var isLevelOpen : boolean = false;
static var isLvlFinish : boolean = true;
static var LevelNames : Array;
static var customLvlArray : Array;

static var selected = 1;

var GAME_COUNT = 10;
var levelChoice = "Demo Level";

var menubarInt;
var menubarContent : GUIContent[];
var albumViewVector : Vector2 = Vector2.zero;
var mailViewVector : Vector2 = Vector2.zero;

var mailSelectionInt : int = 0;
var mailNames : String[];

var friendsLevels : Texture2D;
var friendsLevelContents = null;
var friendsAuthors = null;
var friendsIDs = null;

var myLevels : Texture2D;
var myLevelContents = null;
var mySavedLevelContents = null;
var myAuthors = null;
var myIDs = null;

var highScores : Texture2D;
var messages : Texture2D;
var create : Texture2D;
var store : Texture2D;
var play : Texture2D;
var loginScreen : Texture2D;
var debug : GUIStyle;
var myFont : Font;

var error :boolean = false;
var textAreaString : String = "here";
var bkgrd : GUIStyle;

//This needs to be changed to the actual user name
var userName = "admin";

var tutSkin : GUISkin;
var MenuStyle : GUIStyle;

var showMail : boolean;
var mailPiece : ArrayList;

var levelXMLLoaded : boolean = false;

private var redIcon : Texture2D;
private var orangeIcon : Texture2D;
private var yellowIcon : Texture2D;
private var greenIcon : Texture2D;
private var blueIcon : Texture2D;
private var purpleIcon : Texture2D;
private var rainbowIcon : Texture2D;
private var rainbowStripesIcon : Texture2D;
private var spaceIcon : Texture2D;
private var undertheseaIcon : Texture2D;
private var fallIcon : Texture2D;
private var springIcon : Texture2D;
private var summerIcon : Texture2D;
private var winterIcon : Texture2D;

var fullStar : Texture2D;
var emptyStar :Texture2D;

var sr : StarRating;
var r : int;
var s : Vector2;
var e : Vector2;
var r1 : int;

//var sr1 : StarRating;
var rateFriendArry : Array = new Array();
var rateMyArry : Array = new Array();
var rfArry : Array = new Array();
var rmArry : Array = new Array();

var once : boolean = false;
var twice : boolean = false;
var text: GUIStyle;
static var tutorialVersion;
var dm : DataManager;

function Awake()
{
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
	MenuStyle = new GUIStyle();
	MenuStyle.alignment = TextAnchor.UpperCenter;
	MenuStyle.normal.textColor = Color.white;
	MenuStyle.margin.top = 15;
	text.normal.textColor = Color.white;
	text.fontSize = 22;
	text.alignment = TextAnchor.MiddleCenter;
	text.wordWrap = true;
}

function Start()
{
	menubarInt = 0;
	menubarContent  = new GUIContent[2];  //5

	selected = 0;
 	GAME_COUNT = 10;

 	showMail = true ;

	//Josh left overs
 	currentLevel = 1;
 	customLvlArray = new Array();

 	dm.level = dm.user.savestate;
 	Debug.Log("SaveState: " + dm.user.savestate);
 	//dm.level = 4;

 	dm.ResetLevelToLoad();

}

function Update()
{
	if(levelXMLLoaded)
		Application.LoadLevel("_GameWorld");

	if(menubarInt==0 )
	{

		for(i =0; i <rateFriendArry.length; i++)
		{
			//if(!rateFriendArry[i].isSubmitted())
			rfArry[i] = (rateFriendArry[i].setStars());
		}
	}

	if(menubarInt==1 )
	{

		for(i =0; i <rateMyArry.length; i++)
		{
			//if(!rateFriendArry[i].isSubmitted())
			rmArry[i] = (rateMyArry[i].setStars());
		}
	}

}

function OnGUI()
{
	var oldSkin = GUI.skin;
	GUI.skin = tutSkin;
	dm.gameplayMode="campaign";

	StartTutorial();
	GUI.skin = oldSkin;
}

function StartTutorial()
{
	var filePrefix = dm.location + "drupal-6.2/botsFiles/Levels/";
	var filename = "error.xml";


	//how to jump to levels
	if(dm.level == 1)
	{
		//dm.level = 13;
		//dm.user.savestate.tutorialLevel = 13;
	}

	//********************************
	var tempLev = new LevelData();
	tempLev.myhiscore = 999;

	if(dm.level == 0)//Forward Challenge Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Welcome to the BOTS Tutorial! This tutorial will teach you how to write the best programs for your robots, to help you complete the puzzles in the game.",text);
	}
	if(dm.level == 1)//Forward Challenge Tutorial Level
	{
		//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Welcome to the BOTS Tutorial! This tutorial will " + '\n' + " teach you the main controls of the game." + '\n' + "Please select a tutorial level.",text);
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 1: Forward Progress!" + '\n' + "We'll start off by teaching you how to control your robot." + '\n',text);
		filename = "455.xml";

		dm.levelToLoad = "00000455";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 9;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 2)//Turning Challenge Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 2: Turning the Tables!" + '\n' + "Congratulations! You're doing great! The next level will teach you how to properly use the 'Turn' action. Follow the instructions to solve the next level!", text);
		filename = "446.xml";

		dm.levelToLoad = "00000446";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 9;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 3)//Climbing Challenge Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,500,300), "Level 3: It's The Climb!" + '\n' + "Great job! The next level will teach you how to properly use the 'Climb' action. Follow the instructions to solve the next level!",text);
		//filename = "443.xml";
		filename = "457.xml";
		//dm.levelToLoad = "00000443";
		dm.gameplayMode = "campaign";
		dm.levelToLoad = "00000457";
		tempLev.hiscore = 8;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 4)//Lifting Demonstration Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 4: Super Crate Bot! " + '\n' + "Some puzzles have more than one switch. To solve them, you need to move boxes. Follow the instructions to solve the following level!",text);
		filename = "447.xml";

		dm.levelToLoad = "00000447";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 11;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 6)//Lifting Demonstration Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 6: Fully Functional" + '\n' + "Loops can be challenging but you did it! Now try using loops and functions together!",text);
		filename = "451.xml";

		dm.levelToLoad = "00000451";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 12;
	}
	else if(dm.level == 5)//Lifting Demonstration Tutorial Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 5: Let's Get Loopy! " + '\n' + "Now, here's another way to make your programs more efficient: By using Loops! Follow the instructions to solve the following level!",text);
		filename = "751.xml";

		dm.levelToLoad = "00000447";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 7;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 7)//For Loop Challenge Tutorial Level - Skip Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Level 7: VERY CHALLENGE" + '\n' + "Great job on the previous challenge level! This level will offer you additional practice. Solve this challenge level by using the skills you've learned in the previous levels.",text);
		filename = "481.xml";

		dm.levelToLoad = "00000481";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 9;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 8)//For Loop Challenge Tutorial Level - Skip Level
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "BOSS LEVEL: Bot-Henge" + '\n' + "Great work making it this far... It'll be hard to get the best score on this last level! Use everything you've learned!",text);
		filename = "216.xml";

		dm.levelToLoad = "00000216";
		dm.gameplayMode = "campaign";
		tempLev.hiscore = 16;
//		Debug.Log(filename);
//		Debug.Log(dm.levelToLoad);
	}
	else if(dm.level == 9)//End of Tutorial Screen
	{
		GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "You beat all the Tutorial levels! Try out Custom Levels mode to make your own levels, or see if your friends have made any!",text);
		if (GUI.Button (Rect ((Screen.width/2)-160,500,370,50), "Let's Go!"))
		{
			dm.gameplayMode = "campaign";
			Application.LoadLevel(0);
		}
	}

	if(dm.level == 0)
	{
		if(GUI.Button (Rect ((Screen.width/2)-160,500,370,50), "Start Tutorial"))
		{

			tutorialVersion = 1;
			dm.user.savestate = 1;
			dm.level = dm.user.savestate;

		}

	}


	if(dm.level == 9 || dm.level == 0)
		{
			//do nothing?
		}
		else
		{
			if(!dm.IsBusy() && GUI.Button (Rect ((Screen.width/2)-160,500,370,50), "Start Level"))
			{
				//Debug.Log("XML Filename: " +filename);
				//Debug.Log("Current Level ID: " +dm.levelToLoad);
				//Debug.Log("Level: " +dm.level);
				GLOBALS.LEVEL_URL_TO_LOAD = filename;
				dm.selectedLevel = tempLev;
				yield dm.LoadLevel(filename);
				levelXMLLoaded = true;
			}
			else
			{
				GUI.Button (Rect ((Screen.width/2)-160,500,370,50), "Start Level");
			}
		}
}
