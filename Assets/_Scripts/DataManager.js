#pragma strict
import System.Collections.Generic;
import System.Security.Cryptography.MD5;

public class DataManager extends MonoBehaviour
{
	//singletonize this class
	private var filterLoaded = false;
	public var location : String = "http://localhost/PHP/";
	//loading screen
	public var loadingScreen : Texture2D;

	//lists of leveldata
	var NaughtyWords : List.<String> = new List.<String>();
	var myLevelContents : List.<LevelData> = new List.<LevelData>();
	var mySavedLevelContents : List.<LevelData> = new List.<LevelData>();
	var friendsLevelContents : List.<LevelData> = new List.<LevelData>();
	var systemLevelContents : List.<LevelData> = new List.<LevelData>();
	var tutorialLevelContents : List.<LevelData> = new List.<LevelData>();

	//meta-lists?
	var platLevelContents : List.<LevelData> = new List.<LevelData>();
	var goldLevelContents : List.<LevelData> = new List.<LevelData>();
	var silverLevelContents : List.<LevelData> = new List.<LevelData>();
	var bronzeLevelContents : List.<LevelData> = new List.<LevelData>();
	var defendLevelContents : List.<LevelData> = new List.<LevelData>();
	var overthrowLevelContents : List.<LevelData> = new List.<LevelData>();

	public var interactionLogContents : String;
	var currentLevelAttempts : int = 0;

	var loaded : boolean = false;

	var user : UserData;
	var levelToLoad : String;
	var filenameToLoad : String;
	var levelXML : String;
	var levelNode : XMLNode;
	var parser = new XMLParser();

	var gameplayMode : String;
	var level : int;
	public var selectedLevel : LevelData;

	/*var userID : String;
	var username : String;
	var version : int;
	var current_study_id : int;
	var askForStudy : int;
	var isAdmin : int;*/

	var numberLoaded : int = 0;
	var jobsToDo : int = 0;
	var timeoutChecker : int = 0;
	var messageFromServer : String = "";

	function Awake()
	{
		DontDestroyOnLoad (transform.gameObject);

	    Debug.Log("Load Config File");
		var mydata : TextAsset = Resources.Load("config") as TextAsset;
		var configInfo : String = mydata.text;
		var start = configInfo.IndexOf("<host>");
		var end = configInfo.IndexOf("</host>");
		var host = configInfo.Substring(start+6,end - 6);
		location = host;
		Init();
	}

	function DrawLoadingScreen()
	{
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), loadingScreen, ScaleMode.StretchToFill, true, 0);
	}

	function ResetLevelToLoad()
	{
		levelToLoad = "";
		filenameToLoad = "";
		levelXML = "";
		//level = -1; TODO: See if this was important. I don't think it was.
	}

	function GetLevelNode() : XMLNode
	{
		if(!levelNode)
			levelNode = parser.Parse(levelXML);
		return levelNode;
	}

	function GetProgEditorNode() : XMLNode
	{
		Debug.Log("Getting Prog Node");
		var mydata : TextAsset = Resources.Load("Prog GUI/tutorial") as TextAsset;
		var EditorXML = mydata.text;
		var myNode : XMLNode = parser.Parse(EditorXML);
		return myNode;
	}

	function GetBlockEditorNode() : XMLNode
	{
		var mydata : TextAsset = Resources.Load("Block GUI/tutorial") as TextAsset;
		var EditorXML = mydata.text;
		var myNode : XMLNode = parser.Parse(EditorXML);
		return myNode;
	}

	function Init()
	{
		RefreshLevels();

		InitTutorialList();

		//forgive me!
		NaughtyWords = new List.<String>();
		NaughtyWords.Add("ass");
		NaughtyWords.Add("fag");
		NaughtyWords.Add("puss");
		NaughtyWords.Add("vag");
		NaughtyWords.Add("cunt");
		NaughtyWords.Add("dick");
		NaughtyWords.Add("cock");
		NaughtyWords.Add("penis");
		NaughtyWords.Add("damn");
		NaughtyWords.Add("fuck");
		NaughtyWords.Add("fuk");
		NaughtyWords.Add("shit");
		NaughtyWords.Add("piss");
		NaughtyWords.Add("bitch");
		NaughtyWords.Add("nigg");
		NaughtyWords.Add("tit");
		NaughtyWords.Add("whore");
		NaughtyWords.Add("homo");
		NaughtyWords.Add("sex");
		NaughtyWords.Add("rape");
		NaughtyWords.Add("anal");
		NaughtyWords.Add("suck");
		NaughtyWords.Add("blowjob");
		NaughtyWords.Add("dildo");
		Debug.Log("init words");
		filterLoaded = true;

	}

	function InitTutorialList()
	{
		tutorialLevelContents = new List.<LevelData>();
	}

	function RaiseFlag()
	{
		jobsToDo++;
		Debug.Log("RaiseFlag" + jobsToDo);
	}

	function LowerFlag()
	{
		jobsToDo--;
	}

	function IsBusy() : boolean
	{
		//Debug.Log("I got " + jobsToDo + " work to do!");
		//if(jobsToDo > 0)
		//{
		//	timeoutChecker++;
		//if(timeoutChecker > 1000)
		//		jobsToDo = 0;
		//}
		//else
		//	timeoutChecker = 0;

		return jobsToDo > 0;
	}

	function RefreshLevels()
	{
		loaded = false;
		numberLoaded = 0;
		myLevelContents = new List.<LevelData>();
		mySavedLevelContents = new List.<LevelData>();
		friendsLevelContents = new List.<LevelData>();
		user.campaignLevels = new List.<LevelData>();
		systemLevelContents = new List.<LevelData>();

		platLevelContents = new List.<LevelData>();
		goldLevelContents = new List.<LevelData>();
		silverLevelContents = new List.<LevelData>();
		bronzeLevelContents = new List.<LevelData>();
		defendLevelContents = new List.<LevelData>();
		overthrowLevelContents = new List.<LevelData>();
	}

	function CheckLoaded()
	{
		numberLoaded++;
		loaded = (numberLoaded >= 2);
	}

	function GetMyLevels()
	{
		if (loaded)
		{
			Debug.Log("Already Loaded");
			return;
		}
		jobsToDo++;
		Debug.Log("GetMyLevels" + jobsToDo);
		var URL = location + "scripts/bots/getLevels.php?userid=" + user.userID + "&token=my&version=" + user.version + "&study=" + user.current_study_id;
		Debug.Log(URL);
		var www : WWW = WWW(URL);
		yield www;
		if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}

		//Load Games into levelNames
		var levelquery : String[] = www.text.Split(";"[0]);

		var i = 0;
		for(var newRow in levelquery)
		{
			if (newRow != "")
			{
				var row : String[] = newRow.Split(","[0]);
				var lvl = new LevelData();
				lvl.author = row[0];
				lvl.puzzle = row[1];
				lvl.PUZZLE_ID = row[2];
				lvl.myhiscore = int.TryParse(row[3], lvl.myhiscore) ? lvl.myhiscore : 0;
				lvl.hiscore = int.TryParse(row[4], lvl.hiscore) ? lvl.hiscore : 0;
				lvl.champ = row[5];
				lvl.published = int.TryParse(row[6], lvl.published) ? lvl.published : 0;
				lvl.rating = float.TryParse(row[7], lvl.rating) ? lvl.rating : 0.0;

				lvl.version = int.TryParse(row[8], lvl.version) ? lvl.version : 0;
				lvl.description = row[9];
				lvl.lowscore = int.TryParse(row[10], lvl.lowscore) ? lvl.lowscore : 100;

				//calculate medal
				lvl.medal = 0;
				if (lvl.myhiscore && lvl.myhiscore > 0 && lvl.hiscore && lvl.hiscore > 0)
				{
					if (lvl.myhiscore == lvl.hiscore)
					{
						lvl.medal = 4; platLevelContents.Add(lvl);
					}
					else if (lvl.myhiscore && (lvl.hiscore * 1.5) >= lvl.myhiscore)
					{
						lvl.medal = 3; defendLevelContents.Add(lvl); goldLevelContents.Add(lvl);
					}
					else if (lvl.myhiscore && (lvl.hiscore * 2) >= lvl.myhiscore)
					{
						lvl.medal = 2; defendLevelContents.Add(lvl); silverLevelContents.Add(lvl);
					}
					else
					{
						lvl.medal = 1; defendLevelContents.Add(lvl); bronzeLevelContents.Add(lvl);
					}
				}

				//Debug.Log(www.text);
				//if (lvl.version == user.version || user.version == 0)
				//{
					if(lvl.published)
						myLevelContents.Add(lvl);
					else
						mySavedLevelContents.Add(lvl);
				//}

			}
		}
		CheckLoaded();
		jobsToDo--;
			return;
	}

	function GetFriendsLevelsAndCampaign()
	{
		if(loaded)
			return;

		//friendsLevelContents.Clear();
		jobsToDo++;
		Debug.Log("GetFriendsLevels" + jobsToDo);
		var URL = location + "scripts/bots/getLevelsNew.php?userid=" + user.userID + "&token=friends&version=" + user.version + "&study=" + user.current_study_id;
		Debug.Log(URL);
		var www : WWW = WWW(URL);
		yield www;
				if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}


		//Load Games into levelNames
		var levelquery : String[] = www.text.Split(";"[0]);

		//check if user already has a campaign
		yield GetCampaign();

		var cloneFriendsList : List.<LevelData> = new List.<LevelData>();
		var hasCampaignAlready = false;
		var levelStrings : String[] = user.campaignLevelText.Split(","[0]);
		//campaign already exists for this user
		if(!levelStrings[0].Equals("") && !levelStrings[1].Equals("") && !levelStrings[2].Equals(""))
		{
			hasCampaignAlready = true;
			Debug.Log("Campaign Already Exists");
			user.campaignProgress = parseInt(levelStrings[0]);
			user.campaignLevels = new List.<LevelData>(new LevelData[12]);
		}
		//Create friends levels and campaign
		var i = 0;
		for(var newRow in levelquery)
		{
			if (newRow != "")
			{
				var row : String[] = newRow.Split(","[0]);
				var lvl = new LevelData();
				lvl.author = row[0];
				lvl.puzzle = row[1];

				lvl.PUZZLE_ID = row[2];
				lvl.myhiscore = int.TryParse(row[3], lvl.myhiscore) ? lvl.myhiscore : 0;
				lvl.hiscore = int.TryParse(row[4], lvl.hiscore) ? lvl.hiscore : 0;
				lvl.champ = row[5];
				lvl.published = int.TryParse(row[6], lvl.published) ? lvl.published : 0;
				lvl.rating = float.TryParse(row[7], lvl.rating) ? lvl.rating : 0.0;

				lvl.version = int.TryParse(row[8], lvl.version) ? lvl.version : 0;
				lvl.description = row[9];
				lvl.lowscore = int.TryParse(row[10], lvl.lowscore) ? lvl.lowscore : 100;



				//calculate medal
				lvl.medal = 0;
				if (lvl.myhiscore && lvl.myhiscore > 0 && lvl.hiscore && lvl.hiscore > 0)
				{
					if (lvl.myhiscore == lvl.hiscore)
					{
						lvl.medal = 4; platLevelContents.Add(lvl); overthrowLevelContents.Add(lvl);
					}
					else if (lvl.myhiscore && (lvl.hiscore * 1.5) >= lvl.myhiscore)
					{
						lvl.medal = 3; goldLevelContents.Add(lvl);
					}
					else if (lvl.myhiscore && (lvl.hiscore * 2) >= lvl.myhiscore)
					{
						lvl.medal = 2; silverLevelContents.Add(lvl);
					}
					else
					{
						lvl.medal = 1; bronzeLevelContents.Add(lvl);
					}
				}

				if(lvl.author=="admin")
				{
					if(lvl.puzzle.Contains("utorial") || lvl.puzzle.Contains("Test") || lvl.puzzle.Contains("evel"))
						continue;

					if(lvl.champ == null || lvl.hiscore == null || lvl.hiscore < 10)
						continue;

					systemLevelContents.Add(lvl);
				}
				else if (lvl.hiscore && lvl.hiscore > 5)
					friendsLevelContents.Add(lvl);
				//}

				//campaign already exists for this user
				if(hasCampaignAlready)
				{
					//go through each level, adding to the campaign levels list
					for(var x = 2; x < levelStrings.Length; x++)
					{
						if(lvl.PUZZLE_ID.Equals(levelStrings[x]))
						{
							user.campaignLevels[x - 2] = lvl;
						}
					}
				}
				//doesn't have campaign, so generate dummy list for campaign creation
				else
				{
					cloneFriendsList.Add(lvl);
				}
			}
		}
		if(!hasCampaignAlready)
		{
			BuildNewCampaign(cloneFriendsList);
		}
		jobsToDo--;
		CheckLoaded();
		return;
	}

	function GetAdminLevels()
	{
		if(loaded)
			return;

	    //systemLevelContents.Clear();
		jobsToDo++;
		Debug.Log("GetAdminLevels" + jobsToDo);
		var www : WWW = WWW(location + "scripts/bots/getLevels.php?userid=" + user.userID + "&token=friends&version=" + user.version + "&study=" + user.current_study_id);
		yield www;
				if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}

		//Load Games into levelNames
		var levelquery : String[] = www.text.Split(";"[0]);

		var i = 0;
		for(var newRow in levelquery)
		{
			if (newRow != "")
			{
				var row : String[] = newRow.Split(","[0]);
				var lvl = new LevelData();
				lvl.author = row[0];
				lvl.puzzle = row[1];
				lvl.PUZZLE_ID = row[2];
				lvl.myhiscore = int.TryParse(row[3], lvl.myhiscore) ? lvl.myhiscore : 0;
				lvl.hiscore = int.TryParse(row[4], lvl.hiscore) ? lvl.hiscore : 0;
				lvl.champ = row[5];
				lvl.published = int.TryParse(row[6], lvl.published) ? lvl.published : 0;
				lvl.rating = float.TryParse(row[7], lvl.rating) ? lvl.rating : 0.0;

				lvl.version = int.TryParse(row[8], lvl.version) ? lvl.version : 0;
				lvl.description = row[9];
				lvl.lowscore = int.TryParse(row[10], lvl.lowscore) ? lvl.lowscore : 100;

				//Debug.Log(www.text);
				//if (lvl.
				if (lvl.version == user.version || user.version == 0)
				{
					systemLevelContents.Add(lvl);
				}

			}
		}
		jobsToDo--;
		CheckLoaded();
		return;
	}

	//appends a string to the log.
	//the log is sent (and cleared) each time a score is submitted.
	function CreateLog(logItem : String)
	{
		interactionLogContents += logItem + '\n';
		Debug.Log(interactionLogContents);
	}

	function ClearLog()
	{
		interactionLogContents = "";
	}

	function Attempt()
	{
		currentLevelAttempts++;
	}

	function ClearAttempts()
	{
		currentLevelAttempts = 0;
	}

	function LogAttempts()
	{
		CreateLog("Total Attempts: " + currentLevelAttempts);
	}

	//load level into globals
	function LoadLevel(filename : String)
	{
		jobsToDo++;
		Debug.Log("LoadLevel" + jobsToDo + " " + filename );
		filenameToLoad = filename;
		levelToLoad = filename.Split("."[0])[0];
		messageFromServer = "";
		var www = WWW(location + 'scripts/bots/getLevel.php?file=' + filename);
		yield www;
		if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--;
			Application.LoadLevel("MainMenu");
		}
		else{
//		Debug.Log(www.text);
		levelXML = www.text;
		levelNode= parser.Parse(levelXML);
		jobsToDo--;
		}
	}

	function LoadLevel(puzzle_id : int)
	{

		jobsToDo++;
		Debug.Log("LoadLevel" + jobsToDo);
		levelToLoad = puzzle_id.ToString();
		filenameToLoad = puzzle_id.ToString() + ".xml";
		var www = WWW(location + 'scripts/bots/getLevel.php?file=' + filenameToLoad);
		yield www;
				if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}
		Debug.Log(www.text);
		levelXML = www.text;
		levelNode= parser.Parse(levelXML);
		jobsToDo--;
	}

	function Login(username: String, password: String)
	{
		jobsToDo++;
		Debug.Log("Login" + jobsToDo);
		if (username.Length < 4 || password.Length < 7 || username == "username" || password == "password")
		{
			messageFromServer = "You must enter a valid username and password.";
			return;
		}
		var URL = location + "scripts/bots/login.php";
		var form = new WWWForm();
		form.AddField("un", username);
		form.AddField("pw", password);

		var w = WWW(URL, form);
		yield w;
				if(!String.IsNullOrEmpty(w.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + w.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}


//		Debug.Log(w.text);

		if (w.text.Contains("fail"))
			messageFromServer = "Sorry, that wasn't right... Try again?";
		else
		{
			messageFromServer = "Logging you in...";
			user = new UserData();
			user.userID = w.text.Trim();
		}

		jobsToDo--;
	}

	function AdminReset(username: String, password: String)
	{
		jobsToDo++;
		Debug.Log("AdminReset" + jobsToDo);
		var URL = location + "scripts/bots/adminPasswordReset.php";
		var form = new WWWForm();
		form.AddField("un", username);
		form.AddField("pw", password);

		var w = WWW(URL, form);
		yield w;
						if(!String.IsNullOrEmpty(w.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + w.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}
		Debug.Log(w.text);
		//user = new UserData();
		//user.userID = w.text.Trim();
		jobsToDo--;
	}

	function Register(username: String, password: String)
	{
		jobsToDo++;
		Debug.Log("Register" + jobsToDo);
		if(!filterLoaded)
			Init();

		Debug.Log("i'm updating...");
		if(username.Length < 4)
		{
			messageFromServer = "Sorry, that username is too short. Please use 4 characters at least.";
			jobsToDo--;
			return;
		}
		if(password.Length < 7)
		{
			messageFromServer = "Sorry, that password is too short. Please use 8 characters at least.";

			jobsToDo--;
			return;
		}
		if(WordFilter(username))
		{
			messageFromServer = "Sorry, that username is already taken.";
			jobsToDo--;
			return;
		}


		Debug.Log("signing up");
		var URL = location + "scripts/bots/addUser.php";
		var form = new WWWForm();
		form.AddField("un", username);
		form.AddField("pw", password);

		var w = WWW(URL, form);
		yield w;
						if(!String.IsNullOrEmpty(w.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + w.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}
		Debug.Log(w.text);
		jobsToDo--;
		messageFromServer = w.text;
	}

	function Enroll(username: String, study: String)
	{
		jobsToDo++;
		Debug.Log("Enroll" + jobsToDo);
		var URL = location + "scripts/bots/enroll.php";
		var form = new WWWForm();
		form.AddField("un", username);
		form.AddField("std", study);

		var w = WWW(URL, form);
		yield w;
						if(!String.IsNullOrEmpty(w.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + w.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}
		Debug.Log(w.text);
		jobsToDo--;
		messageFromServer = w.text;
	}

	function GetUserData()
	{
		jobsToDo++;
		Debug.Log("GetUserData" + jobsToDo);
		var www : WWW = WWW(location + "scripts/bots/getUser.php?userid=" + user.userID);
		yield www;
						if(!String.IsNullOrEmpty(www.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + www.error;
			jobsToDo--; Application.LoadLevel("MainMenu");
		}

		var userQuerey : String[] = www.text.Split(";"[0]);

		//var i = 0;
		for(var newRow in userQuerey)
		{
			if (newRow != "")
			{
				var row : String[] = newRow.Split(","[0]);
				//user = new UserData();
				user.username = row[0];
				user.version = parseInt(row[1]);
				user.current_study_id = parseInt(row[2]);
				user.isAdmin = parseInt(row[3]);
				user.askForStudy = parseInt(row[4]);
				user.points = parseInt(row[5]);
				user.money = parseInt(row[6]);
				user.savestate = parseInt(row[7]);
			}
		}
		jobsToDo--;
	}

	function SubmitScore(success : int, score : int, state : String, path : String)
	{
		if(IsBusy())
		{ //why is this calling itself multiple times
			Debug.Log("i am overburdened");
			return;
		}

		Debug.Log("SubmitScore" + jobsToDo);

		if(success == 1)
		{
			CheckIfBeatCampaignLevel(parseInt(levelToLoad));
			RefreshLevels();
		}

		Debug.Log(
		"success: " + success +
		" score: " + score +
		" state: " + state +
		" path: " + path +
		" userid:" + user.userID +
		" puzzleid:" + levelToLoad +
		".");


		var ID = levelToLoad;
		var URL = location + "scripts/bots/logging/submitScore.php";
		var form = new WWWForm();

		form.AddField("user", user.username);
		form.AddField("score", score);
		form.AddField("userid", user.userID);
		form.AddField("puzzleid", levelToLoad);
    	form.AddField("attempt", currentLevelAttempts);
    	form.AddField("success", success);
		form.AddField("file", interactionLogContents);
		form.AddField("state",state);
		form.AddField("path",path);

  		jobsToDo++;
		var w = WWW(URL, form);
		yield w;
		if(!String.IsNullOrEmpty(w.error))
		{
			messageFromServer = "Error: Couldn't Load Levels. " + '\n' + w.error;
			jobsToDo--;
			Application.LoadLevel("MainMenu");
		}
		jobsToDo--;
		Debug.Log("Submitted.");
		ClearLog();
	}

	function CheckIfBeatCampaignLevel(currentLevel : int)
	{
		//determines that the current level is a campaign level
		Debug.Log("checking most recent campaign level!");
		if(currentLevel == parseInt(user.campaignLevels[user.campaignProgress - 1].PUZZLE_ID))
		{
			//unlock the next level if campaign not completed yet
			Debug.Log("completed most recent campaign level!");
			user.campaignProgress++;
			Debug.Log("new progress is now " + user.campaignProgress);
			IncrementCampaign();
		}
	}

	function SetupDummyUser()
	{
		user = new UserData();
		user.userID = "0";
		user.username = "guestbot";
		user.version = 0;
		user. current_study_id = 0;
		user. askForStudy = 0;
		user. isAdmin = 0;
		user. points = 0;
		user. money = 0;
		user. savestate = 0;
	}

	function SubmitLevel(levelName : String, description : String, file : String)
	{
		if(IsBusy())
		{ //why is this calling itself multiple times
			Debug.Log("i am overburdened");
			return;
		}

		jobsToDo++;
		var URL;


		//SetupDummyUser(); //for testing

		//decide if this is a new level or modifying an old one
		if(gameplayMode == "edit")
		{
			Debug.Log("Updating....");
			URL = location + "scripts/bots/updateLevel.php";
		}else {
			URL = location + "scripts/bots/saveLevel.php";
		}
		var form = new WWWForm();

		form.AddField("user", user.username);
		form.AddField("userid", user.userID);
		if(gameplayMode == "edit")		{
			Debug.Log("Still Updating..."+ levelToLoad);
			form.AddField("puzzleid", levelToLoad);
    		form.AddField("filename", levelToLoad);
		}
		form.AddField("puzzle", levelName);
		form.AddField("file",file);
		form.AddField("description",description);

		//manage whether or not a submitted level is published
		if (user.version == 1)
			form.AddField("published",1);
		else
			form.AddField("published",0);

		form.AddField("version", user.version);

		//loading = true;

		// Upload to a php script
		var w = WWW(URL, form);
		yield w;

		if (w.error != null)
		{
			levelName=w.error;
			Debug.Log(w.error);
		}
		else
		{
			Debug.Log(w.text);
		}
		jobsToDo--;

		RefreshLevels();

	}

	function GetSolution()
	{

	}

	function BuildNewCampaign(dummyList : List.<LevelData>)
	{
		user.campaignLevels = new List.<LevelData>();
		//randomly select 4 levels for each condition
		var levelsWithCondition1 = 0;
		var levelsWithCondition2 = 0;
		var levelsWithCondition3 = 0;
		//add the levels to the campaign list, with 4 of each condition (version)
		//while(user.campaignLevels.Count < 12 || dummyList.Count == 0)
		while(user.campaignLevels.Count < 12 && dummyList.Count != 0)
		{
			var rndLvl : LevelData = dummyList[Random.Range(0, dummyList.Count - 1)];
			if(rndLvl.hiscore < 5 || rndLvl.published == 0) //basic exclusions for trivial or unsolved levels
			{
				//do nothing; exclude this level
			}
			else if((rndLvl.version == 2 || rndLvl.version == 1) && levelsWithCondition1 < 4) //1&2 - click editor wo/w self-solve, but only selecting published solved levels
			{
				levelsWithCondition1++;
				user.campaignLevels.Add(rndLvl);
			}
			else if(rndLvl.version == 4 && levelsWithCondition2 < 4) //4 = blck editor
			{
				levelsWithCondition2++;
				user.campaignLevels.Add(rndLvl);
			}
			else if(rndLvl.version == 5 && levelsWithCondition3 < 4) //5 = prog editor
			{
				levelsWithCondition3++;
				user.campaignLevels.Add(rndLvl);
			}
			dummyList.Remove(rndLvl);
		}

		//randomize the list because there are somewhat less levels of type 3 so they group near the end
		var rng = new Random();
    	var n = user.campaignLevels.Count;
    	while (n > 1) {
        	n--;
        	var k : int = Random.Range(0, n - 1);
        	var val : LevelData = user.campaignLevels[k];
        	user.campaignLevels[k] = user.campaignLevels[n];
       	 	user.campaignLevels[n] = val;
    	}

		for(var x = 0; x < user.campaignLevels.Count; x++)
		{
			if(x == (user.campaignLevels.Count - 1))
			{
				user.campaignLevelText += user.campaignLevels[x].PUZZLE_ID;
			}
			else
			{
				user.campaignLevelText += user.campaignLevels[x].PUZZLE_ID + ",";
			}
		}
		//save campaign into database
		yield SetCampaign(user.campaignLevelText);
	}

	function GetCampaign() //this returns the progress, level, and list of puzzle ids as a comma-seperated list. if there is no campaign, it will return -1,-1,00000000
	{
		jobsToDo++;
		var URL = location + "scripts/bots/getCampaign.php";
		var form = new WWWForm();
		form.AddField("userid", user.userID);
		var w = WWW(URL, form);
		yield w;
		if (w.error != null)
		{
			user.campaignLevelText = w.error;
		}
		else
		{
			user.campaignLevelText = w.text;
		}
		Debug.Log(w.text);
		jobsToDo--;
	}

	//contents is a comma-seperated list of 8-digit puzzle IDs
	//contents can hold up to 12 puzzle ids.
	// if no campaign exists for the user, this will insert one. if a campaign does exist, this will overwrite it!
	function SetCampaign(contents : String)
	{
		jobsToDo++;

		var URL = location + "scripts/bots/setCampaign.php";
		var form = new WWWForm();
		form.AddField("userid", user.userID);
		form.AddField("contents", contents);
		var w = WWW(URL, form);
		Debug.Log("called it with " + contents + " " + user.userID);
		yield w;
		Debug.Log(w.text);
		jobsToDo--;
	}

	//sets the stored campaign progress to the new value
	//user.campaignProgress should be incremented locally first
	function IncrementCampaign()
	{
		var URL = location + "scripts/bots/incrementCampaign.php";
		var form = new WWWForm();
		form.AddField("userid", user.userID);
		form.AddField("progress", user.campaignProgress);
		var w = WWW(URL, form);
		jobsToDo++;
		yield w;
		Debug.Log("actually incremented campaign for real");
		Debug.Log(w.error);
		jobsToDo--;
	}


	function WordFilter(string: String) : boolean
	{
		for(var s : String in NaughtyWords)
		{
			//Debug.Log(s);
			if (string.ToLower().Contains(s))
				return true;
		}

		//Name Security
		var chars : char[] = string.ToCharArray();
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
				return true;
			}
		}

		return false;
	}

	function StartLevel(levelID : int, levelMode : String)
	{

	}

	function UnlockNewTutorialLevel()
	{
		user.savestate++;
		//do a cool thing here please
	}
}

class LevelData
{
	var author : String;
	var puzzle : String;
	var PUZZLE_ID : String;
	var myhiscore : int;
	var hiscore : int;
	var champ : String;
	var published : int;
	var rating : float;
	var version : int;
	var description : String;
	var lowscore : int;
	var medal : int; //0 - blank, 4 = plat
}

class UserData
{
	var userID : String;
	var username : String;
	var version : int;
	var current_study_id : int;
	var askForStudy : int;
	var isAdmin : int;
	var points : int;
	var money : int;
	var savestate : int;
	var campaignLevels : List.<LevelData> = new List.<LevelData>(new LevelData[12]);
	var campaignLevelText : String = "";
	var campaignProgress : int = 1;
}
