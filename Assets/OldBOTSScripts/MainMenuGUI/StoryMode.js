//****************************************************
//Story Mode
//Edited by Gabriel Perez
//****************************************************

static var currentLevel : int;
static var nextLevel : int;
static var newLevel : boolean = false;
var myLevel : GameObject;
static var isLevelOpen : boolean = false;
static var isLvlFinish : boolean = true;
static var LevelNames : Array;
static var customLvlArray : Array;

static var selected = 1;

var GAME_COUNT = 10;
var levelChoice = "Story Level";

var menubarInt;
var menubarContent : GUIContent[];
var albumViewVector : Vector2 = Vector2.zero;
var mailViewVector : Vector2 = Vector2.zero;

var mailSelectionInt : int = 0;
var mailNames : String[];

/*var friendsLevels : Texture2D;
var friendsLevelContents = null;
var friendsAuthors = null;
var friendsIDs = null;
*/
//var myLevels : Texture2D;
var myLevelContents = null;
//var mySavedLevelContents = null;
//var myAuthors = null;
//var myIDs = null;

// Picture of the missions can be change on unity in story scene
var storyScene1 : Texture2D;
var storyScene2 : Texture2D;
var storyScene3 : Texture2D;
var storyScene4 : Texture2D;
var storyScene5 : Texture2D;
var storyScene6 : Texture2D;
var medal :Texture2D;

//if the player passes a mission it goes true and revels the next set of missions
static var numOfMaps = 5;
static var numOfLevels = 10;
static var passed : boolean[] = new boolean[numOfLevels];
static var showLevel : boolean[] = new boolean[numOfMaps];

//var highScores : Texture2D;
//var messages : Texture2D;
//var create : Texture2D;
//var store : Texture2D;
var play : Texture2D;
var loginScreen : Texture2D;
var debug : GUIStyle;
var myFont : Font;

var error :boolean = false;
var textAreaString : String = "here";
var bkgrd : GUIStyle;

//This needs to be changed to the actual user name
var userName = "admin";

var MenuStyle : GUIStyle;

var showMail : boolean;
var mailPiece : ArrayList;

var levelXMLLoaded : boolean = false;
var goToMainStoryMenu = false;

/*private var redIcon : Texture2D;
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
private var winterIcon : Texture2D;*/

var fullStar : Texture2D;
var emptyStar :Texture2D;

var sr : StarRating;
var r : int;
var s : Vector2;
var e : Vector2;
var r1 : int;

var rateFriendArry : Array = new Array();
var rateMyArry : Array = new Array();
var rfArry : Array = new Array();
var rmArry : Array = new Array();

var once : boolean = false;
var twice : boolean = false;
var text: GUIStyle;
//var boxthing = GameObject.Find("Cube").;
//var programGUI : ProgramGUI; has no meaning right now
var dm : DataManager;

function Awake()
{
	MenuStyle = new GUIStyle();
	MenuStyle.alignment = TextAnchor.UpperCenter;
	MenuStyle.normal.textColor = Color.white;
	MenuStyle.margin.top = 15;
	text.normal.textColor = Color.white;
	text.fontSize = 22;
	programGUI = GetComponent("ProgramGUI");
	/*for(var counter = 0; counter < numOfMaps; counter++)
	{
		passed[counter]= false;
		StoryMode.showLevel[counter] = false;
	}*/
  dm = GameObject.Find("DataManager").GetComponent(DataManager);
}


function Start()
{
	menubarInt = 0;
	menubarContent  = new GUIContent[2];  //5

	selected = 0;
 	GAME_COUNT = 10;

 	//showMail = true ;


 	currentLevel = 1;
 	customLvlArray = new Array();

}


function Update()
{
	if(levelXMLLoaded)
		Application.LoadLevel("ProgramGUI");

	if(menubarInt==0 )
	{

		for(i =0; i <rateFriendArry.length; i++)
		{

			rfArry[i] = (rateFriendArry[i].setStars());
		}
	}

	if(menubarInt==1 )
	{

		for(i =0; i <rateMyArry.length; i++)
		{

			rmArry[i] = (rateMyArry[i].setStars());
		}
	}

}

function OnGUI()
{
	GLOBALS.story=true;

	StartStory();
}

function LoadLevelXML(token : String)
{
	var filePrefix = dm.location + "drupal-6.2/botsFiles/Levels/";
	var filename = "error.xml";
	if (token == "my")
	{
		filename = parseInt(myLevelContents[selected]["PUZZLE_ID"]) + ".xml";
		GLOBALS.CURRENT_LEVEL_ID = myLevelContents[selected]["PUZZLE_ID"];
		GLOBALS.PLAY_LEVEL_MODE = "play";
	}
	//not part of story mode
/*	else if (token == "friends")
	{
		filename = parseInt(friendsLevelContents[selected]["PUZZLE_ID"]) + ".xml";
		GLOBALS.CURRENT_LEVEL_ID = friendsLevelContents[selected]["PUZZLE_ID"];
		GLOBALS.PLAY_LEVEL_MODE = "play";
		Debug.Log(filename);
		Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
	}
	else if (token == "try")
	{
		filename = parseInt(mySavedLevelContents[selected]["PUZZLE_ID"]) + ".xml";
		GLOBALS.CURRENT_LEVEL_ID = mySavedLevelContents[selected]["PUZZLE_ID"];
		GLOBALS.PLAY_LEVEL_MODE = "try";
		Debug.Log("try");
	}
	else if (token == "edit")
	{
		filename = parseInt(mySavedLevelContents[selected]["PUZZLE_ID"]) + ".xml";
		GLOBALS.CURRENT_LEVEL_ID = mySavedLevelContents[selected]["PUZZLE_ID"];
		GLOBALS.PLAY_LEVEL_MODE = "edit";
		GLOBALS.LEVEL_URL_TO_LOAD = filename;
		Debug.Log("edit");
		Application.LoadLevel("LevelEditor");
		return;
	}*/
	else
	{
		Debug.Log("I cannot possibly find that!");
		return;
	}

	GLOBALS.LEVEL_URL_TO_LOAD = filename;


	levelXMLLoaded = true;
}

function StartStory()
{
	var filePrefix = dm.location + "drupal-6.2/botsFiles/Levels/";
	var filename = "error.xml";
	//********************************







	if(GLOBALS.level == 11)
	{
		GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene6);
		//GUI.Box (Rect ((Screen.width/1.5)-180,170,400,300), "Story Complete",text);
		if (GUI.Button (Rect ((Screen.width/3.5),Screen.height - (Screen.height * .107 + 40),370,50), "Main Menu"))
		{
			GLOBALS.story=false;
			Application.LoadLevel(0);
		}
	}

	Debug.Log(GLOBALS.level);
	Debug.Log(showLevel[1]);

	if(GLOBALS.level == 1)
	{

			if(showLevel[0])
			GUI.Label (Rect ((Screen.width/4.5),(Screen.height - 430),60,35),medal);

			GUI.Label (Rect ((Screen.width/4.5),(Screen.height - 400),50,30),"NASA Building\n",text); //label or text above the picture
		if (GUI.Button (Rect ((Screen.width/4.5),(Screen.height - 400),150,190), storyScene1))// button with picture that is saved on storyScene1 that is a 2dtexture
		{
			//GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene1);

			   //GUI.Box (Rect ((Screen.width/2.5)-180,170,430,300), "Welcome to the BOTS Story. You are a prototype rouver"+'\n'+"that is in his final test before going to mars.",text);

			   filename = "465.xml";
			   GLOBALS.CURRENT_LEVEL_ID = "00000465";
			   GLOBALS.PLAY_LEVEL_MODE = "play";
			   Debug.Log(filename);
			   Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
			   passed[0] = true;// when mission is passed this unlocks new/next mission

				GLOBALS.LEVEL_URL_TO_LOAD = filename;

				levelXMLLoaded = true;

				Debug.Log("XML Filename: " +filename);
				Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				Debug.Log("Level: " +GLOBALS.level);
		}
		if(!showLevel[0])
			GUI.color = Color.gray;//makes button and text different color so player can identify he/she cant play it yet

		if(showLevel[1])
			GUI.Label (Rect ((Screen.width/2),(Screen.height - 430),60,35),medal);

			GUI.Label (Rect ((Screen.width/2),(Screen.height - 400),50,30),"NASA Lab\n",text);
		if (GUI.Button (Rect ((Screen.width/2),(Screen.height - 400),150,190), storyScene2))
		{
			//GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene1);

			if(showLevel[0])
			{
				GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene2);
				//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 3.",text);
				filename = "467.xml";
				GLOBALS.CURRENT_LEVEL_ID = "00000467";
				GLOBALS.PLAY_LEVEL_MODE = "play";
				Debug.Log(filename);
				Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
				passed[2] = true;

				GLOBALS.LEVEL_URL_TO_LOAD = filename;

				levelXMLLoaded = true;

				Debug.Log("XML Filename: " +filename);
				Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				Debug.Log("Level: " +GLOBALS.level);
			}
			else
			{
				GUI.Window(8971, Rect(Screen.width / 10, Screen.height / 10, 250, 250), DisplayMessage, "You must complete all of the levels inside of NASA's building before attempting Nasa's Lab!");
				GUI.BringWindowToFront(8971);
			}
		}
			if(!showLevel[1])
			GUI.color = Color.gray;

			if(showLevel[2] )
			GUI.Label (Rect ((Screen.width/1.3),(Screen.height - 430),60,35),medal);

			GUI.Label (Rect ((Screen.width/1.3),(Screen.height - 400),50,30), "Mars\n",text);
		if (GUI.Button (Rect ((Screen.width/1.3),(Screen.height - 400),150,190), storyScene3))
		{
			//GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene1);

			if(showLevel[1])
			{
				GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene3);
				//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 5.",text);
				filename = "469.xml";
				GLOBALS.CURRENT_LEVEL_ID = "00000469";
				GLOBALS.PLAY_LEVEL_MODE = "play";
				Debug.Log(filename);
				Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
				passed[4] = true;

				GLOBALS.LEVEL_URL_TO_LOAD = filename;

				levelXMLLoaded = true;

				Debug.Log("XML Filename: " +filename);
				Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				Debug.Log("Level: " +GLOBALS.level);
			}
			else
			{

				GUI.Window(8971, Rect(Screen.width / 10, Screen.height / 10, 250, 250), DisplayMessage, "You must complete all of the levels inside of NASA's building before attempting NasaLab!");
				GUI.BringWindowToFront(8971);
			}
		}
			if(!showLevel[2])
			GUI.color = Color.gray;

			if(showLevel[3] )
			GUI.Label (Rect ((Screen.width/4.5),(Screen.height - 230),60,35),medal);

			GUI.Label (Rect ((Screen.width/4.5),(Screen.height - 200),50,30), "In Mars\n",text);
		if (GUI.Button (Rect ((Screen.width/4.5),(Screen.height - 200),150,190), storyScene4))
		{
			//GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene1);

			if(showLevel[2])
			{
				GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene4);
				//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 7",text);
				filename = "471.xml";
				GLOBALS.CURRENT_LEVEL_ID = "00000471";
				GLOBALS.PLAY_LEVEL_MODE = "play";
				Debug.Log(filename);
				Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
				passed[6] = true;

				GLOBALS.LEVEL_URL_TO_LOAD = filename;

				levelXMLLoaded = true;

				Debug.Log("XML Filename: " +filename);
				Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				Debug.Log("Level: " +GLOBALS.level);
			}
			else
			{
				GUI.Window(8971, Rect(Screen.width / 10, Screen.height / 10, 250, 250), DisplayMessage, "You must complete all of the levels inside of Nasa's building before attempting Mars!");
				GUI.BringWindowToFront(8971);
			}
		}
			if(!showLevel[3])
			GUI.color = Color.gray;

			if(showLevel[4])
			GUI.Label (Rect ((Screen.width/2),(Screen.height - 230),60,35),medal);

			GUI.Label (Rect ((Screen.width/2),(Screen.height - 200),50,30), "End\n",text);
		if (GUI.Button (Rect ((Screen.width/2),(Screen.height - 200),150,190), storyScene5))
		{
			//GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene1);

			if(showLevel[3])
			{
				GUI.Box (Rect (0,0,Screen.width,Screen.height),storyScene5);
				//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 9",text);
				filename = "473.xml";
				GLOBALS.CURRENT_LEVEL_ID = "00000473";
				GLOBALS.PLAY_LEVEL_MODE = "play";
				Debug.Log(filename);
				Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
				passed[8] = true;

				GLOBALS.LEVEL_URL_TO_LOAD = filename;

				levelXMLLoaded = true;

				Debug.Log("XML Filename: " +filename);
				Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				Debug.Log("Level: " +GLOBALS.level);
			}
			else
			{
				GUI.Window(8971, Rect(Screen.width / 2, Screen.height / 2, 250, 250), DisplayMessage, "You must complete all of the levels inside of Nasa's building before attempting In Mars!");
				GUI.BringWindowToFront(8971);
			}
		}
	}

	if(GLOBALS.level == 11 || GLOBALS.level == 1)
		{
			//do nothing
		}
		else
		{
			if(GUI.Button (Rect ((Screen.width/3) - 50,Screen.height - (Screen.height * .107 + 40),200,50), "Start Level"))
			{
				if(passed[0])
			    {
				     goToMainStoryMenu = true;
					 //GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 2",text);
					 filename = "478.xml";
					 GLOBALS.CURRENT_LEVEL_ID = "00000478";
					 GLOBALS.PLAY_LEVEL_MODE = "play";
					 Debug.Log(filename);
					 Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
					 //Application.LoadLevel("Story");
					 passed[0] = false;
					 passed[1] = true;

			    }
			    else if(passed[2])
				{
					goToMainStoryMenu = true;
					//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 4",text);
					filename = "468.xml";
					GLOBALS.CURRENT_LEVEL_ID = "00000468";
					GLOBALS.PLAY_LEVEL_MODE = "play";
					Debug.Log(filename);
					Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
					passed[2] = false;
					passed[3] = true;
				}
			    else if(passed[4])
				{
					goToMainStoryMenu = true;
					//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 6",text);
					filename = "470.xml";
					GLOBALS.CURRENT_LEVEL_ID = "00000470";
					GLOBALS.PLAY_LEVEL_MODE = "play";
					Debug.Log(filename);
					Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
					passed[4] = false;
					passed[5] = true;
				}
			    else if(passed[6])
				{
					goToMainStoryMenu = true;
					//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "level 8",text);
					filename = "472.xml";
					GLOBALS.CURRENT_LEVEL_ID = "00000472";
					GLOBALS.PLAY_LEVEL_MODE = "play";
					Debug.Log(filename);
					Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
					passed[6] = false;
					passed[7] = true;
				}
			    else if(passed[8])
				{
					goToMainStoryMenu = true;
					//GUI.Box (Rect ((Screen.width/2)-180,170,430,300), "Last Story Level",text);
					filename = "474.xml";
					GLOBALS.CURRENT_LEVEL_ID = "00000474";
					GLOBALS.PLAY_LEVEL_MODE = "play";
					Debug.Log(filename);
					Debug.Log(GLOBALS.CURRENT_LEVEL_ID);
					passed[8] = false;
					passed[9] = true;
				}

				//Debug.Log("XML Filename: " +filename);
				//Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
				//Debug.Log("Level: " +GLOBALS.level);
				GLOBALS.LEVEL_URL_TO_LOAD = filename;
				levelXMLLoaded = true;
			}
		}

	if (goToMainStoryMenu)
	{
		GLOBALS.level = 0;
		goToMainStoryMenu = false;
		Application.LoadLevel("Story");
	}
	/*else
	{
		if (GUI.Button (Rect ((Screen.width/4.5),(Screen.height - 400),300,150), "Name this button gabe"))
		{
			GLOBALS.LEVEL_URL_TO_LOAD = filename;
			levelXMLLoaded = true;
		}
		GLOBALS.LEVEL_URL_TO_LOAD = filename;
			levelXMLLoaded = true;

	}*/

	if (GLOBALS.level != 11)
	{
		/*if(GUI.Button (Rect ((Screen.width/2)-160,500,370,50), "START LEVEL"))
		{
			Debug.Log("XML Filename: " +filename);
			Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
			Debug.Log("Level: " +GLOBALS.level);

			GLOBALS.LEVEL_URL_TO_LOAD = filename;

			levelXMLLoaded = true;
		}*/


	}
}

/*function Button(){

	var filePrefix = dm.location + "drupal-6.2/botsFiles/Levels/";
	var filename = "error.xml";

		if(GUI.Button (Rect ((Screen.width/2)-400,(Screen.height/2),370,50), "ok"))
		{
			Debug.Log("XML Filename: " +filename);
			Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
			Debug.Log("Level: " +GLOBALS.level);

			GLOBALS.LEVEL_URL_TO_LOAD = filename;

			levelXMLLoaded = true;
		}

		if(GUI.Button (Rect ((Screen.width/2),Screen.height - (Screen.height * .107 + 40),370,50), "cancel"))
		{
			//Debug.Log("XML Filename: " +filename);
			//Debug.Log("Current Level ID: " +GLOBALS.CURRENT_LEVEL_ID);
			//Debug.Log("Level: " +GLOBALS.level);

			GLOBALS.level = 11;

		}



}*/

function DisplayMessage()
{

		if(GUI.Button(Rect(Screen.width/2, Screen.height/2, 100, 100), "done"))
		{

		}
}
