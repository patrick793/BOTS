#pragma strict

var dm : DataManager;
var selectedCollection :  List.<LevelData>;
var popUpCollection : List.<LevelData>;
var selectedLevel : LevelData;
var albumViewVector : Vector2 = Vector2.zero;
var popUpViewVector : Vector2 = Vector2.zero;
public var loadingFlag = false;
public var levelXMLLoaded = false;
public var showEditorControls = true;

var stringToEdit : String = "level ID";

public var TabBoxTopLeft : Vector2 = new Vector2(50, 20);
public var LevelBoxTopLeft : Vector2 = new Vector2(50, 50);
public var LevelEntryDimensions : Vector2 = new Vector2(400, 60);
public var DescBoxTopLeft : Vector2 = new Vector2(Screen.width - (LevelEntryDimensions.x + 50 + 17), 50);
public var EditorBoxTopLeft : Vector2 = new Vector2(50, 650);
public var EditorControlsTopLeft : Vector2 = Vector2.zero;

public var mainMenuSkin : GUISkin;

//popupstuff
public var blackImg : Texture2D;
var loading = false;
var muteGUI = false;
var popUpActive = false;
var popUpType = "none";
var popUpRat : float = 1.0f;
var popUpCaption : String = "";

var popUpRect = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 128, 400, 256 );
var popUpTallRect = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 256, 400, 512 );
var popUpWindowRect = Rect(popUpRect.x,popUpRect.y+popUpRat*Screen.height,popUpRect.width,popUpRect.height);

var plats = 0;
var golds = 0;
var silvers = 0;
var bronzes = 0;
var overthrows = 0;
var defends = 0;


function Awake()
{	
	//Debug.Log(Screen.width);
	try {
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
	}
	catch (e) { 
	var go = new GameObject("DataManager"); 
	go.AddComponent("DataManager"); 
	dm = go.GetComponent("DataManager");
	dm.Awake();
	dm.SetupDummyUser();
	}
}

function Start () {
	GetLevels();
	selectedCollection = dm.systemLevelContents;
	popUpCollection = dm.platLevelContents;
	DescBoxTopLeft = new Vector2(Screen.width - (LevelEntryDimensions.x + 50 + 17), 50);
	dm.ResetLevelToLoad();
}

function Update () {

}

function OnGUI() {
	GUI.skin = mainMenuSkin;
	if((dm && dm.IsBusy()) || loading)
	{
		dm.DrawLoadingScreen();
		return;
	}
	DrawTabBar();
	ShowLevels();
	ShowEditorControls();
	ShowDescBox();
	DrawPopUp();
}

function GetLevels() {
	if(!dm.loaded)
	{
		yield dm.GetMyLevels();
		yield dm.GetFriendsLevelsAndCampaign();
	}

}

function DrawTabBar(){

	if(GUI.Button(Rect(TabBoxTopLeft.x, TabBoxTopLeft.y, 100, 30), "Official Levels", "Tab"))
		selectedCollection = dm.systemLevelContents;
	if(GUI.Button(Rect(TabBoxTopLeft.x + 100, TabBoxTopLeft.y, 100, 30), "Custom Levels", "Tab"))
		selectedCollection = dm.friendsLevelContents;
	if(dm.user.username != "guestbot" && GUI.Button(Rect(TabBoxTopLeft.x + 200, TabBoxTopLeft.y, 100, 30), "My Levels", "Tab"))
		selectedCollection = dm.myLevelContents;
	if(dm.user.username != "guestbot" && GUI.Button(Rect(TabBoxTopLeft.x + 300, TabBoxTopLeft.y, 100, 30), "Unfinished Levels", "Tab"))
		selectedCollection = dm.mySavedLevelContents;
}

function ShowDescBox()
{
	GUI.Box(Rect(DescBoxTopLeft.x - 1, DescBoxTopLeft.y - 1, LevelEntryDimensions.x + 17, 2 + Screen.height * .75),"");
	GUI.BeginGroup(Rect(DescBoxTopLeft.x, DescBoxTopLeft.y, LevelEntryDimensions.x + 16, 2 + Screen.height * .75));
	GUI.Label(Rect(12, 12, Screen.width * .33, Screen.height * .05), "My Medals:", "titleLabel");
	GUI.Label(Rect(32, 32, Screen.width * .33, Screen.height * .05), dm.platLevelContents.Count + " Platinum Medals");
		if(dm.platLevelContents.Count > 0)
			if (GUI.Button(Rect(Screen.width * .33 + 40, 32, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.platLevelContents;
				popUpCaption = "These are the levels you have platinum on!" + '\n' + "Try and beat your own score!";
				ActivatePopUp("ShowLevelSet");
			}
	GUI.Label(Rect(32, 52, Screen.width * .33, Screen.height * .05), dm.goldLevelContents.Count + " Gold Medals");
		if(dm.goldLevelContents.Count > 0)
			if (GUI.Button(Rect(Screen.width * .33 + 40, 52, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.goldLevelContents;
				popUpCaption = "These are the levels you have gold on! " + '\n' + "You're so close to the high score!";
				ActivatePopUp("ShowLevelSet");
			}
	GUI.Label(Rect(32, 72, Screen.width * .33, Screen.height * .05), dm.silverLevelContents.Count + " Silver Medals");
		if(dm.silverLevelContents.Count > 0)
			if (GUI.Button(Rect(Screen.width * .33 + 40, 72, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.silverLevelContents;
				popUpCaption = "These are the levels you have silver on! " + '\n' + "Try and grab gold by using less commands!";
				ActivatePopUp("ShowLevelSet");
			}
	GUI.Label(Rect(32, 92, Screen.width * .33, Screen.height * .05), dm.bronzeLevelContents.Count + " Bronze Medals");
		if(dm.bronzeLevelContents.Count > 0)
			if(GUI.Button(Rect(Screen.width * .33 + 40, 92, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.bronzeLevelContents;
				popUpCaption = "These are the levels you have bronze on! " + '\n' + "If you can get to double the best score, you'll earn silver!";
				ActivatePopUp("ShowLevelSet");
			}
	
	//draw a divider?
	GUI.Label(Rect(12, 122, Screen.width * .33, Screen.height * .05), "My Levels:", "titleLabel");
	GUI.Label(Rect(32, 142, Screen.width * .33, Screen.height * .05), dm.myLevelContents.Count + " Created Levels");
	GUI.Label(Rect(32, 162, Screen.width * .33, Screen.height * .05), dm.defendLevelContents.Count + " Defended Levels");
		if(dm.defendLevelContents.Count > 0)
			if (GUI.Button(Rect(Screen.width * .33 + 40, 162, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.defendLevelContents;
				popUpCaption = "These are the levels you need to defend! " + '\n' + "Try and take back the champ spot!";
				ActivatePopUp("ShowLevelSet");
			}
	GUI.Label(Rect(32, 182, Screen.width * .33, Screen.height * .05), dm.overthrowLevelContents.Count + " Overthrown Levels");
		if(dm.overthrowLevelContents.Count > 0)
			if(GUI.Button(Rect(Screen.width * .33 + 40, 182, 24, 24), "!", "triangleButton") && !muteGUI)
			{
				popUpCollection = dm.overthrowLevelContents;
				popUpCaption = "These are the levels where you beat the level creator! " + '\n' + "Try and stay champ!";
				ActivatePopUp("ShowLevelSet");
			
			}

	//draw a divider?
	GUI.Button(Rect(12, -44 + Screen.height * .75, 200, 32), "Contact Us!");
			
	GUI.EndGroup();
}

function ShowLevels()
{	
	GUI.Box(Rect(LevelBoxTopLeft.x - 1, LevelBoxTopLeft.y - 1, LevelEntryDimensions.x + 17, 2 + Screen.height * .75),"");
	
	if (!muteGUI)
		albumViewVector = GUI.BeginScrollView (Rect(LevelBoxTopLeft.x, LevelBoxTopLeft.y, LevelEntryDimensions.x + 20, Screen.height * .75), albumViewVector, Rect(0, 0, Screen.width * .1, selectedCollection.Count*LevelEntryDimensions.y));
	else
		GUI.BeginScrollView (Rect(LevelBoxTopLeft.x, LevelBoxTopLeft.y, LevelEntryDimensions.x + 20, Screen.height * .75), albumViewVector, Rect(0, 0, Screen.width * .1, selectedCollection.Count*LevelEntryDimensions.y));
	
	var levelIndex = 0;	
	for (var item in selectedCollection)
	{		
		var level = "BlankScoreButton"; //here will will give you a medal and stars!
		switch (item.medal)
		{
			case 4:
				level = "PlatScoreButton"; break;
			case 3:
				level = "GoldScoreButton"; break;
			case 2: 
				level = "SilverScoreButton"; break;
			case 1:
				level = "BronzeScoreButton"; break;
			default:
				break;
		}
				

		
		GUI.Box(Rect(0, LevelEntryDimensions.y*levelIndex, LevelEntryDimensions.x, LevelEntryDimensions.y + 1),"");
		var topleft = (LevelEntryDimensions.y*levelIndex);
		
		if(GUI.Button(Rect(5, topleft + 5, 50, 50), "PLAY", "BotButton") && !muteGUI) //, GUIContent("PLAY", play)))
		{
			selectedLevel = item;
			dm.selectedLevel = item;
			ActivatePopUp("LoadLevel");	
		}
		GUI.Label(Rect(65, topleft + 5, Screen.width * .33, Screen.height * .05),item.puzzle, "titleLabel");
		GUI.Label(Rect(75, topleft + 25, Screen.width * .33, Screen.height * .05), "by  " + item.author);
		var hiscore = item.hiscore == 0 ? "" : item.hiscore;
		var myhiscore = item.myhiscore == 0 ? "" : item.myhiscore;
		if(GUI.Button(Rect(LevelEntryDimensions.x - 120, topleft + 5, 50, 50), "Best\n" + hiscore, "scoreButton") && !muteGUI)
		{
			selectedLevel = item;
			dm.selectedLevel = item;
			ActivatePopUp("ShowScores");	
		}
		
		GUI.Box(Rect(LevelEntryDimensions.x - 60, topleft + 5, 50, 50), "Mine\n" + myhiscore, level);
		levelIndex++;
	}
	GUI.EndScrollView();
}

function ShowEditorControls()
{
	//draw return button
	if (GUI.Button(Rect(EditorBoxTopLeft.x + 100, EditorBoxTopLeft.y, 80, 40), "Title Screen") && !muteGUI)
	{
		loading = true;
		Application.LoadLevel("MainMenu");
	}

	if(dm.user.username != "admin" && true)//study condition
	{
		if(parseInt(dm.user.userID) % 2 == 0 && GUI.Button(Rect(EditorBoxTopLeft.x, EditorBoxTopLeft.y, 80, 40), "Level Editor"))
		{
			loading = true;
			dm.gameplayMode = "progEdit";
			Application.LoadLevel("_GameWorld");
		}
		else if (parseInt(dm.user.userID) % 2 != 0 && GUI.Button(Rect(EditorBoxTopLeft.x, EditorBoxTopLeft.y, 80, 40), "Level Editor"))
		{
			loading = true;
			dm.gameplayMode = "blockEdit";
			Application.LoadLevel("_WorldEditor");
		}
		return;
	}
	
	if (dm.user.username != "guestbot" && GUI.Button(Rect(EditorBoxTopLeft.x, EditorBoxTopLeft.y, 80, 40), "New Level") && !muteGUI)
	{
		loading = true;
		dm.gameplayMode = "clickEdit";
		Application.LoadLevel("_WorldEditor");
	}
	if (dm.user.username == "admin" && GUI.Button(Rect(EditorBoxTopLeft.x + 200, EditorBoxTopLeft.y, 80, 40), "Program Editor") && !muteGUI)
	{
		loading = true;
		dm.gameplayMode = "progEdit";
		Application.LoadLevel("_GameWorld");
	}
	if (dm.user.username == "admin" && GUI.Button(Rect(EditorBoxTopLeft.x + 300, EditorBoxTopLeft.y, 80, 40), "Block Editor") && !muteGUI)
	{
		loading = true;
		dm.gameplayMode = "blockEdit";
		Application.LoadLevel("_WorldEditor");
	}
	
	stringToEdit = GUI.TextField (Rect(EditorBoxTopLeft.x + 390, EditorBoxTopLeft.y, 80, 40), stringToEdit, 25);
	if (dm.user.username == "admin" && GUI.Button(Rect(EditorBoxTopLeft.x + 460, EditorBoxTopLeft.y, 80, 40), "By LVL ID") && !muteGUI)
	{
		selectedLevel = new LevelData();
		selectedLevel.PUZZLE_ID = stringToEdit;
		LoadLevelXML("play");
		loading = true;
	}
}

function LoadLevelXML(token : String)
{
	loadingFlag = true;

	dm.gameplayMode = token;
//	Debug.Log(token);
	
	var filename = "error.xml";
	filename = parseInt(selectedLevel.PUZZLE_ID) + ".xml";
	dm.levelToLoad = selectedLevel.PUZZLE_ID;
	dm.gameplayMode = "play";
	dm.filenameToLoad = filename;
	
	//else if (token == "try")
	//else if (token == "edit") //9989
	
	yield dm.LoadLevel(filename);	
	levelXMLLoaded = true;
	
	if(token == 'edit')
	{
		Application.LoadLevel("_WorldEditor");
		return;	
	}
	else
	{
		Application.LoadLevel("_GameWorld");
	}
}
	
//Code to activate a popup
function ActivatePopUp(type : String){
	popUpRat = 1.0f;
	popUpRect = Rect( (Screen.width)*0.5 - 200, (Screen.height)*0.5 - 128, 400, 256 );
	muteGUI = true;
	popUpActive = true;
	popUpType = type;
}
function DeactivatePopUp(){
	muteGUI = false;
	popUpActive = false;
}

function DrawPopUp(){
	//Pop-Ups
	if( popUpActive ) {
		popUpRat = Mathf.MoveTowards(popUpRat, 0, 2*Time.deltaTime);
		GUI.color = Color(1,1,1,(1-popUpRat)*0.25);
		GUI.DrawTexture( Rect(0,0,Screen.width,Screen.height), blackImg, ScaleMode.StretchToFill );
		GUI.color = Color.white;
		switch (popUpType)
		{
			case "ShowLevelSet":
				popUpWindowRect = Rect(popUpTallRect.x,popUpTallRect.y+popUpRat*Screen.height,popUpTallRect.width,popUpTallRect.height);
				break;
			default:
				popUpWindowRect = Rect(popUpRect.x,popUpRect.y+popUpRat*Screen.height,popUpRect.width,popUpRect.height);
				break;
		}
		switch(popUpType){			
			//Win Pop up
			case "LoadLevel":
				//GUI.Box( popUpWindowRect, "");
				GUI.Box( popUpWindowRect, "You want to play " + selectedLevel.author + "'s level");
				GUI.Label(popUpWindowRect, selectedLevel.puzzle, "BigTitleLabel");
				GUI.Box(popUpWindowRect, selectedLevel.description, "DescriptionLabel");
				if( GUI.Button( Rect(popUpWindowRect.x + popUpWindowRect.width/2 - 160, popUpWindowRect.y+popUpWindowRect.height-64, 128, 48), "Let's Go!" ) ){
					LoadLevelXML("play");
					loading = true;
				}
				if( GUI.Button( Rect(popUpWindowRect.x + popUpWindowRect.width/2 + 32, popUpWindowRect.y+popUpWindowRect.height-64, 128, 48), "Never Mind" ) ){
					DeactivatePopUp();
					selectedLevel = null;
					dm.selectedLevel = null;
				}
			break;
			case "ShowScores":
				GUI.Box( popUpWindowRect, selectedLevel.puzzle + "'s current champ is");
				var champ = selectedLevel.champ ? selectedLevel.champ : "nobody!";
				GUI.Label(popUpWindowRect, champ, "BigTitleLabel");
				
				//determining current award level
				//BAD CODING ALERT! TODO - don't repeat this chunk of code from above
				var encouragementString = "Complete the level to earn Bronze!";
				if (selectedLevel.myhiscore && selectedLevel.myhiscore > 0 && selectedLevel.hiscore && selectedLevel.hiscore > 0)
				{
					encouragementString = "Use " + (selectedLevel.hiscore * 2) + " or less commands to earn Silver!";
					if (selectedLevel.myhiscore && (selectedLevel.hiscore * 2) >= selectedLevel.myhiscore)
						encouragementString = "Use " + parseInt(selectedLevel.hiscore * 1.5) + " or less commands to earn Gold!"; //silver
					if (selectedLevel.myhiscore && (selectedLevel.hiscore * 1.5) >= selectedLevel.myhiscore)
						encouragementString = "Match or beat the Champ's score to earn Platinum!"; //gold
					if (selectedLevel.myhiscore == selectedLevel.hiscore)
						encouragementString = "You have the Platinum score!"; 
				}
				
				var myscorestring = (selectedLevel.myhiscore && selectedLevel.myhiscore > 0) ? "You used " + selectedLevel.myhiscore + " commands." : "You haven't completed this level."; 
				GUI.Box(popUpWindowRect, "who used only " + selectedLevel.hiscore + " commands!" + '\n' + '\n' + myscorestring + '\n' + encouragementString, "DescriptionLabel");
				if( GUI.Button( Rect(popUpWindowRect.x + popUpWindowRect.width/2 - 160, popUpWindowRect.y+popUpWindowRect.height-64, 128, 48), "OK" ) ){
					DeactivatePopUp();
				}
			break;
			case "ShowLevelSet":
				GUI.Box( popUpWindowRect, popUpCaption);
				
					var newVal = GUI.BeginScrollView (Rect(popUpWindowRect.x, popUpWindowRect.y + 40, LevelEntryDimensions.x + 20, popUpWindowRect.height - 110), popUpViewVector, Rect(0, 0, Screen.width * .1, popUpCollection.Count*LevelEntryDimensions.y));
						popUpViewVector = newVal;
					
					var levelIndex = 0;	
					for (var item in popUpCollection)
					{		
						var level = "BlankScoreButton"; //here will will give you a medal and stars!
						switch (item.medal)
						{
							case 4:
								level = "PlatScoreButton"; break;
							case 3:
								level = "GoldScoreButton"; break;
							case 2: 
								level = "SilverScoreButton"; break;
							case 1:
								level = "BronzeScoreButton"; break;
							default:
								break;
						}
								

						
						GUI.Box(Rect(0, LevelEntryDimensions.y*levelIndex, LevelEntryDimensions.x, LevelEntryDimensions.y + 1),"");
						var topleft = (LevelEntryDimensions.y*levelIndex);
						
						if(GUI.Button(Rect(5, topleft + 5, 50, 50), "PLAY", "BotButton") && !muteGUI) //, GUIContent("PLAY", play)))
						{
							selectedLevel = item;
							dm.selectedLevel = item;
							ActivatePopUp("LoadLevel");	
						}
						GUI.Label(Rect(65, topleft + 5, Screen.width * .33, Screen.height * .05),item.puzzle, "titleLabel");
						GUI.Label(Rect(75, topleft + 25, Screen.width * .33, Screen.height * .05), "by  " + item.author);
						var hiscore = item.hiscore == 0 ? "" : item.hiscore;
						var myhiscore = item.myhiscore == 0 ? "" : item.myhiscore;
						if(GUI.Button(Rect(LevelEntryDimensions.x - 120, topleft + 5, 50, 50), "Best\n" + hiscore, "scoreButton") && !muteGUI)
						{
							selectedLevel = item;
							dm.selectedLevel = item;
							ActivatePopUp("ShowScores");	
						}
						
						GUI.Box(Rect(LevelEntryDimensions.x - 60, topleft + 5, 50, 50), "Mine\n" + myhiscore, level);
						levelIndex++;
					}
					GUI.EndScrollView();
				
				if( GUI.Button( Rect(popUpWindowRect.x + popUpWindowRect.width/2 - 160, popUpWindowRect.y+popUpWindowRect.height-64, 128, 48), "Never Mind" ) ){
					DeactivatePopUp();
				}
			break;
		}
	}
}
