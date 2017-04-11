static var currentLevel : int; //stores the ID of the currently selected level
static var nextLevel : int;
static var newLevel : boolean = false;
static var isLevelOpen : boolean = false;
static var isLvlFinish : boolean = true;
static var LevelNames : Array;
static var customLvlArray : Array;

static var selected = 1;

public var loadingScreen : Texture2D;
public var loadingFlag = false;

var guiOffset : int = 60;

var GAME_COUNT = 10;
var levelChoice = "Demo Level";

var menubarInt;
var menubarContent : GUIContent[];
var albumViewVector : Vector2 = Vector2.zero;
var mailViewVector : Vector2 = Vector2.zero;

var mailSelectionInt : int = 0;
var mailNames : Texture2D[];

var friendsLevels : Texture2D;
var friendsAuthors = null;
var friendsIDs = null;

var myLevels : Texture2D;
var myAuthors = null;
var myIDs = null;

var highScores : Texture2D;
var messageTexture : Texture2D;
var messageTextureRead : Texture2D;
var create : Texture2D;
var play : Texture2D;
var loginScreen : Texture2D;
var debug : GUIStyle;
var mySkin : GUISkin;

var error :boolean = false;
var textAreaString : String = "here";
var bkgrd : GUIStyle;

var SelectedLevelName : String = "LevelName";
var SelectedLevelAuthor : String = "Author";
var SelectedLevelDescription : String = "LevelDescription";

var userName = "admin";

var MenuStyle : GUIStyle;
var alteredSkin : GUIStyle;

var showMail : boolean;
var myMessages = null;
var mailPiece : ArrayList;

var levelXMLLoaded : boolean = false;

var once : boolean = false;
var twice : boolean = false;

var displayTooltip : int = 0;
var tooltipPosition : Point;
static var isDragAndDropLevelEditor : boolean = true;
static var levelEditorName : String = "Drag&Drop Level Editor";

public var tooltipContent : GUIContent;

//##Minimap
var miniCam : Minimap;

var newProgramGUI : boolean = true;

var dm : DataManager;

function Awake()
{
	//Screen.SetResolution(915, 687, false);
	MenuStyle = new GUIStyle();
	MenuStyle.alignment = TextAnchor.UpperCenter;
	MenuStyle.normal.textColor = Color.white;
	MenuStyle.margin.top = 15;

	mailPiece = new ArrayList();
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
}


function Start()
{
	menubarInt = 0;
	menubarContent  = new GUIContent[2];  //5

	selected = 0;
 	GAME_COUNT = 10;

 	showMail = true ;

 	currentLevel = 1;
 	customLvlArray = new Array();

	GetLevels();

	//##New minimap inclusion - load additively once
	miniCam = new Minimap();
	//miniCam.Load();  Causes a NullReference Error

}

function Update()
{
	if (levelXMLLoaded) {
		//dm.gameplayMode = "";
		//if(!newProgramGUI)
		//	Application.LoadLevel("ProgramGUI");
		//else
		Application.LoadLevel("_GameWorld");
	}
}

function OnGUI()
{
	if(loadingFlag || dm.IsBusy())
	{
		dm.DrawLoadingScreen();		//Debug.Log("my belief is " + loadingFlag);
		return;
	}
	GUI.skin = mySkin;
	GUI.backgroundColor = new Color(255, 124, 221,23);

	alteredSkin = GUI.skin.GetStyle("Dialog");

	if(displayTooltip > 0)
	{
		GUI.Window(9002, Rect(0, 0, Screen.width, Screen.height), DisplayTooltip, "");
		GUI.FocusWindow(9002);
	}

	if(dm.username == "" || dm.userID == 0)
	{
		GUI.Label(Rect(Screen.width * .277, Screen.height * .3077, Screen.width * .446, Screen.height * .3896), loginScreen);
	}

 	//checks if level is open. If not chooses a level based on the button selection
 	//or chooses to create a level
    else if(!isLevelOpen && !error)
	{
		if(GUI.Button(Rect(Screen.width * .961, Screen.height * .0167, Screen.width * .039, Screen.height * .0418),"", debug))
		{
			error = true;
		}
		//Toolbar
		menubarContent[0] = new GUIContent(" Friend's Levels", friendsLevels);
		menubarContent[1] = new GUIContent(" My Levels", myLevels);

		menubarInt = GUI.Toolbar (Rect(Screen.width * 0.0557, Screen.height * .0167, Screen.width * .8885, Screen.height * .167), menubarInt, menubarContent);

		switch(menubarInt)
		{
			case 0:
				ShowFriendLevels();
				break;

			case 1:
			  	ShowMyLevels();
			  	break;
		}



		//******************************************************
		//Exit to main menu
		//******************************************************
		if(GUI.Button(Rect(Screen.width * .8127, Screen.height * .95, Screen.width * .1325, Screen.height * .045), "Main Menu"))
		{
			dm.gameplayMode == "";
			Application.LoadLevel(0);
		}
		//*******************************************************

	}
	//for debug report
	if(error)
	{
		GUI.Box(Rect(0, 0, Screen.width, Screen.height), "", bkgrd);
		GUI.Label(Rect(Screen.width * .5557, Screen.height * .03177, Screen.width * .5574, Screen.height * .0502),"Please report any errors that you have found here:");
		//500 word limit
		if(textAreaString.Length <= 500)
			textAreaString = GUI.TextArea(Rect(Screen.width * .5557, Screen.height * .0819, Screen.width * .446, Screen.height * .8361), textAreaString);
		else
			textAreaString = textAreaString.Substring(0, textAreaString.length-1);
		if(GUI.Button(Rect(Screen.width * .8902, Screen.height * .9348, Screen.width * .111, Screen.height * .0836), "SUBMIT"))
		{
			//add database stuff here
			textAreaString = "";
			error =false;
		}
	}
	//Switch version of testing
	if(dm.user.isAdmin && GUI.Button(Rect(0, Screen.height * .95, Screen.width * .35, Screen.height * .045), "UN: " + dm.user.username + ", UID: " + dm.user.userID + ", VN: " + dm.user.version))
	{
		dm.user.version++;
		if(dm.user.version > 3)
		{
			dm.user.version = 0;


		}
		dm.RefreshLevels();
	}


	//Toggle between level editor modes.
	//if(dm.user.isAdmin && GUI.Button(Rect(Screen.width * .36, Screen.height * .95, Screen.width * .30, Screen.height * .045), levelEditorName))
	//{
	//	Debug.Log(isDragAndDropLevelEditor);
	//	Debug.Log(levelEditorName);
	//	if(isDragAndDropLevelEditor)
	//	{
	//		isDragAndDropLevelEditor = false;
	//		levelEditorName = "Level Editor";
	//	}
	//	else
	//	{
	//		isDragAndDropLevelEditor = true;
	//		levelEditorName = "Drag&Drop Level Editor";
	//	}
	//}

	//Toggle between gui modes.
	//if(dm.user.isAdmin && GUI.Button(Rect(0,0, 30,30), newProgramGUI.ToString()))
	//{
	//	newProgramGUI = !newProgramGUI;
	//}

}


function ShowFriendLevels()
{



//	GUI.Box(Rect(50, 125, Screen.width - 100, Screen.height - 140), levelChoice);
	//Play selected level
	//if(GUI.Button(Rect(Screen.width/2-50, Screen.height/4+15, 100, 100), GUIContent("PLAY", play)))
	//{
	//	LoadLevelXML("friends");
	//}


		// Level Slider

		/*Friends Levels*/
	if(dm == null)
	{
		Debug.Log("what");
	}
	if(dm.friendsLevelContents == null)
	{
		Debug.Log("what else");
	}

	albumViewVector = GUI.BeginScrollView (Rect(Screen.width * 0.0557, Screen.height * .2007, Screen.width * .613, Screen.height * .743), albumViewVector, Rect(0, 0, Screen.width * .1, Screen.height * (dm.friendsLevelContents.Count*guiOffset) / 598));

	//albumViewVector = GUI.BeginScrollView (Rect(Screen.width/2-150, Screen.height-115, 300, 100), albumViewVector, Rect(0, 0, fLevels.length*90, 80));

//for high scores and my scores, add them into fLevels and change the xCount from 1 to 3
	//selected = GUI.SelectionGrid(Rect(0,0,200,fLevels.length*80), selected,fLevels, 3);
	var countaur = 0;



	for (var item in dm.friendsLevelContents)
	{
		//Debug.Log("w"+Screen.width);
		//Debug.Log("l"+Screen.height);
		//Play selected level
		/*Friend Level entry*/
		GUI.Box(Rect(0, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .591, Screen.height * .09197),"");

		if(GUI.Button(Rect(Screen.width * 0.0111, Screen.height * (2+guiOffset*countaur) / 598, Screen.width * 0.0557, Screen.width * 0.0557), "", "playButton")) //, GUIContent("PLAY", play)))
		{
			selected = countaur;
			LoadLevelXML("friends");
//			Debug.Log(item.PUZZLE_ID);
		}
		if(GUI.Button(Rect(Screen.width * .078, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502),item.puzzle, "LevelName"))
		{
			SelectedLevelName = item.puzzle;
			SelectedLevelAuthor = item.author;
			SelectedLevelDescription = item.description;

			//##Load minimap here? - not sure if puzzle is correct ID....
			var filename = parseInt(dm.friendsLevelContents[selected].PUZZLE_ID) + ".xml";
			dm.levelToLoad = dm.friendsLevelContents[selected].PUZZLE_ID;
			dm.filenameToLoad = filename;
			//##End portion abstracted from XMLLoader
		}
		GUI.Label(Rect(Screen.width * .111, Screen.height * (30+guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502), "by  " + item.author);
//			selected = countaur;
		var hiscore = item.hiscore == 0 ? "" : item.hiscore;
		var myhiscore = item.myhiscore == 0 ? "" : item.myhiscore;
		if(GUI.Button(Rect(Screen.width * .4571, Screen.height * (5+guiOffset*countaur) / 598, Screen.width * .0613, Screen.height * .07525), "Best\n" + hiscore))
		{
		}

		if(GUI.Button(Rect(Screen.width * .524, Screen.height * (5+guiOffset*countaur) / 598, Screen.width * .0613, Screen.height * .07525), "Mine\n" + myhiscore))
		{
		}

		countaur++;
	}


	if(dm.friendsLevelContents.Count > 0)
		levelChoice = dm.friendsLevelContents[selected].puzzle;

	GUI.EndScrollView();

	ShowLevelDescription();

}

function ShowLevelDescription()
{
	//Info box
	GUI.Box(Rect(Screen.width * .675, Screen.height * .2007, Screen.width * .27, Screen.height * .743),"");
	//##Minimap removal: GUI.Button(Rect(620,130,225,220),"Screenshot");
				miniCam.LoadMiniMapCam(Rect(Screen.width * .691, 130, Screen.width * .251, Screen.height * .3679), false, false);
	GUI.Label(Rect(Screen.width * .691, Screen.height * .5853, Screen.width * .234, Screen.height * .78595), SelectedLevelName, "LevelName2");
	GUI.Label(Rect(Screen.width * .691, Screen.height * .7191, Screen.width * .234, Screen.height * .78595), SelectedLevelAuthor);
	GUI.Label(Rect(Screen.width * .691, Screen.height * .8528, Screen.width * .234, Screen.height * .78595), SelectedLevelDescription);
}



function ShowMyLevels()
{

	//Debug.Log(dm.myLevelContents.Count);
	//Debug.Log(dm.mySavedLevelContents.Count + " saved");
	//Capable of entering each level editor mode.
	if(GUI.Button(Rect(Screen.width * .675, Screen.height * .95, Screen.width * .1325, Screen.height * .045), "New Level"))
	{
		dm.ResetLevelToLoad();
		Debug.Log("Reset Level To Load");
		Application.LoadLevel("_WorldEditor");
	}

		albumViewVector = GUI.BeginScrollView (Rect(Screen.width * 0.0557, Screen.height * .2007, Screen.width * .613, Screen.height * .743), albumViewVector,
		Rect(0, 0, Screen.width * .1, Screen.height * ((dm.myLevelContents.Count + dm.mySavedLevelContents.Count )*guiOffset) / 598));

	var countaur = 0;

	for (var item in dm.myLevelContents)
	{

/*My levels*/
		GUI.Box(Rect(0, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .5909, Screen.height * .09197),"");


		if(GUI.Button(Rect(Screen.width * .0111, Screen.height * (2+guiOffset*countaur) / 598, Screen.width * 0.0557, Screen.height * .0836), "", "playButton")) //, GUIContent("PLAY", play)))
		{
			selected = countaur;
			LoadLevelXML("my");
//			Debug.Log(item.PUZZLE_ID);
		}
		 if(GUI.Button(Rect(Screen.width * .078, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502),item.puzzle, "LevelName"))
		{
			SelectedLevelName = item.puzzle;
			SelectedLevelAuthor = item.author;
			SelectedLevelDescription = item.description;
		}
		 GUI.Label(Rect(Screen.width * .111, Screen.height * (30 + guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502), "by  " + item.author);
//			selected = countaur;

		var hiscore = item.hiscore == 0 ? "" : item.hiscore;
		var myhiscore = item.myhiscore == 0 ? "" : item.myhiscore;
		if(GUI.Button(Rect(Screen.width * .4571, Screen.height * (5+guiOffset*countaur) / 598, Screen.width * .0613, Screen.height * .07525), "Best\n" + hiscore))
		{
		}

		if(GUI.Button(Rect(Screen.width * .524, Screen.height * (5+guiOffset*countaur) / 598, Screen.width * .0613, Screen.height * .07525), "Mine\n" + myhiscore))
		{
		}
		countaur++;
	}
	if(dm.mySavedLevelContents.Count > 0)
	{
		countaur++;

		if(dm.user.version == 3)
			GUI.Label(Rect(Screen.width * .08, Screen.height * (guiOffset*countaur + 10) / 598, Screen.width * .5574, Screen.height * .0502),"To publish your saved levels you must wait for Admin approval.");
		else if (dm.user.version == 2)
			GUI.Label(Rect(Screen.width * .08, Screen.height * (guiOffset*countaur + 10) / 598, Screen.width * .5574, Screen.height * .0502),"To publish your saved levels you must 'Try' and solve them");
		else
			GUI.Label(Rect(Screen.width * .08, Screen.height * (guiOffset*countaur + 10) / 598, Screen.width * .5574, Screen.height * .0502),"Saved Levels");

		countaur++;

		var i = 0;
		for (var item in dm.mySavedLevelContents)
		{
			GUI.Box(Rect(0, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .5909, Screen.height * .09197),"");

			if((dm.user.version != 3 || dm.isAdmin) && GUI.Button(Rect(Screen.width * .0111, Screen.height * (2+guiOffset*countaur) / 598, Screen.width * 0.0557, Screen.height * .0836), "", "playButton")) //, GUIContent("PLAY", play)))
			{
				selected = i;
				LoadLevelXML("try");
			}
			 GUI.Label(Rect(Screen.width * .078, Screen.height * (0+guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502),item.puzzle, "LevelName");
			 GUI.Label(Rect(Screen.width * .111, Screen.height * (30+guiOffset*countaur) / 598, Screen.width * .3344, Screen.height * .0502), "by  " + item.author);

			if(GUI.Button(Rect(Screen.width * .435,Screen.height * (5+guiOffset*countaur) / 598, Screen.width * .0613, Screen.height * .07525), "Edit"))
			{
				selected = i;
				LoadLevelXML("edit"); //9989
			}

			countaur++;
			i++;
		}
	}

	GUI.EndScrollView();
	ShowLevelDescription();
}

//Load Levels From XML
function LoadLevelXML(token : String)
{
	loadingFlag = true;
	var filePrefix = dm.location + "drupal-6.2/botsFiles/Levels/";
//	Debug.Log(token);
	
	var filename = "error.xml";
	if (token == "my")
	{
		filename = parseInt(dm.myLevelContents[selected].PUZZLE_ID) + ".xml";
		dm.levelToLoad = dm.myLevelContents[selected].PUZZLE_ID;
		dm.gameplayMode = "play";
	}
	else if (token == "friends")
	{
		filename = parseInt(dm.friendsLevelContents[selected].PUZZLE_ID) + ".xml";
		dm.levelToLoad = dm.friendsLevelContents[selected].PUZZLE_ID;
		dm.gameplayMode = "play";
	}
	else if (token == "try")
	{
		filename = parseInt(dm.mySavedLevelContents[selected].PUZZLE_ID) + ".xml";
		dm.levelToLoad = dm.mySavedLevelContents[selected].PUZZLE_ID;
		dm.gameplayMode = "try";
	}
	else if (token == "edit") //9989
	{
		filename = parseInt(dm.mySavedLevelContents[selected].PUZZLE_ID) + ".xml";
		dm.levelToLoad = dm.mySavedLevelContents[selected].PUZZLE_ID;
		dm.gameplayMode = "edit";
		dm.filenameToLoad = filename;

	}
	else
	{
		Debug.Log("I cannot possibly find that!");
		return;
	}

//	Debug.Log("Loading " + filename);
	yield dm.LoadLevel(filename);
//	Debug.Log("Loaded in play mode " + dm.gameplayMode);
	levelXMLLoaded = true;

	if(token == 'edit')
	{
			//Application.LoadLevel("Drag&DropEditor");
		Application.LoadLevel("_WorldEditor");
		return;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function GetLevels()
{
	//Debug.Log("Getting Levels");
	dm.RaiseFlag();
	if(!dm.loaded)
	{
		yield dm.GetMyLevels();
		yield dm.GetFriendsLevels();
	}
	dm.LowerFlag();
//	//Debug.Log("Done Getting Levels");
}

function DisplayTooltip()
{
var color : int;
color = 1;

	//compare scores
	if(displayTooltip == 2)
	{
		var hi = tooltipContent.text.Split('|'[0])[0];
		var my = tooltipContent.text.Split('|'[0])[1];
		var lo = tooltipContent.text.Split('|'[0])[2];
		//tooltipContent.text.Split(

		Debug.Log(hi);
		Debug.Log(my);
		Debug.Log(lo);

		//put error checking for these parses
		var scorePercentile = parseInt(hi) + parseInt(lo) / 3;
		var scorePercentile2 = 2 * (parseInt(hi) + parseInt(lo)) / 3;
		var hiScore = parseInt(my);

		Debug.Log(hiScore);
		Debug.Log(scorePercentile);
		Debug.Log(scorePercentile2);


		if(hiScore > scorePercentile2)
		{
			//GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 300, 100), (tooltipContent.text + 0 + "%"), "Tooltip1");
			alteredSkin.normal.textColor = Color.red;
			GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 300, 100), (tooltipContent.text), "dialog");

		}
		else if(hiScore > scorePercentile)
		{
			alteredSkin.normal.textColor = Color.yellow;
			GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 300, 100), (tooltipContent.text), "dialog");
		}
		else
		{
			alteredSkin.normal.textColor = Color.green;
			GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 300, 100), (tooltipContent.text), "dialog");
		}
	}
	else
	{
		GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 300, 100), tooltipContent, "dialog");



	}
	/*if(GUI.Button(Rect(Screen.width * .111, Screen.height * .0836, Screen.width * .0446, Screen.height * .0669), "ok", "playButton"))//style
	{
		displayTooltip = false;
		tooltipContent.text = "";
		tooltipPosition = new Point(0,0);
	}
	GUI.EndGroup();	*/
	if(GUI.Button (Rect(200,40,50,50) ,GUIContent("Ok ","Dialog")))
	{
	alteredSkin.normal.textColor = Color.black;
	displayTooltip = 0;
	tooltipContent.text = " ";
	tooltipPosition = new Point(0,0);
	}
	GUI.Label (Rect(30,30,10,10),GUI.tooltip);
	GUI.EndGroup();
}
