var sourceVals : String; //values read into the webplayer, fed from drupal

var myUser = {}; //info about the user, initially blank
var activeStudies = Array(); //case studies currently in progress, if any

// FLAGS
var ShowStudyGUI = false; //show the case study warning, or not?
var TryToJoinStudy = false; // show the case stuy warning, or now?
var DenyUser = false; //deny a user who cannot join a case study, or not?

//
var tempString : String;

var campaignMode : GameObject; //menu options for starting in tutorial mode or normal mode?
var freePlayMode : GameObject;
var storyMode : GameObject;

var loginState : int = 0;
/*
0 = show login
1 = show study
3 = show assent script
*/

var tex;
var colors;
private var showColor = false;
private var showAdj = false;
private var showAnimal = false;

private var colorEntry = 0;
private var colorList : GUIContent[];
private var adjEntry = 0;
private var adjList : GUIContent[];
private var animalEntry = 0;
private var animalList : GUIContent[];

private var listStyle : GUIStyle;
private var picked = false;

 var setupcaptcha = false;
 var captchaCollection : List.<String>;
 var correctCaptcha : int = -1;

private var usernameField = 'username';
private var passwordField = 'password';
private var studyField = '00000000';

public var mainMenuSkin : GUISkin;

var dm : DataManager;

var GUILoaded = false;

function Awake()
{
	dm = GameObject.Find("DataManager").GetComponent(DataManager);

	//campaignMode = GameObject.Find("Text Campaign Mode");
	//freePlayMode = GameObject.Find("Text Free Play");
	//storyMode =  GameObject.Find("Text Story Mode");
	
	//campaignMode.SetActive(false);
	//freePlayMode.SetActive(false);
	//storyMode.SetActive(false);
	
	// Make some content for the popup lists
	colorList = new GUIContent[5];
	colorList[0] = new GUIContent("Red");
	colorList[1] = new GUIContent("Blue");
	colorList[2] = new GUIContent("Green");
	colorList[3] = new GUIContent("Yellow");
	colorList[4] = new GUIContent("Purple");
	
	adjList = new GUIContent[5];
	adjList[0] = new GUIContent("Angry");
	adjList[1] = new GUIContent("Funky");
	adjList[2] = new GUIContent("Sneaky");
	adjList[3] = new GUIContent("Creepy");
	adjList[4] = new GUIContent("Snazzy");
	
	animalList = new GUIContent[5];
	animalList[0] = new GUIContent("Monkey");
	animalList[1] = new GUIContent("Duckling");
	animalList[2] = new GUIContent("Lizard");
	animalList[3] = new GUIContent("Pony");
	animalList[4] = new GUIContent("Beetle");
 
	// Make a GUIStyle that has a solid white hover/onHover background to indicate highlighted items
	listStyle = new GUIStyle();
	listStyle.normal.textColor = Color.white;
	tex = new Texture2D(2, 2);
	colors = new Color[4];
	for (color in colors) color = Color.white;
	tex.SetPixels(colors);
	tex.Apply();
	listStyle.hover.background = tex;
	listStyle.onHover.background = tex;
	listStyle.padding.left = listStyle.padding.right = listStyle.padding.top = listStyle.padding.bottom = 4;
	
	if (dm && dm.messageFromServer.Contains("Error:"))
	{
		loginState = -1;
	}
	
	GUILoaded = true;
}

function ErrorWidget()
{
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;

	
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 150), "Oops!");
	GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 150), dm.messageFromServer);
	
	GUI.skin.label.alignment = TextAnchor.UpperLeft;
    
	if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) + 35, 80, 32), "Go Back", "MainMenuButton"))
	{
		if(dm.user && dm.user.userID)
			loginState = 5;
		else
			loginState++;
	}
}

function LoginWidget()
{
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;

	
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 150), "Enter your B.O.T.S. ID");
	if (dm.messageFromServer.Contains("fail"))
	{
		GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 15), "Sorry, that wasn't right. Try again?");
	}
	else if (dm.messageFromServer != "")
	{
		GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 15), dm.messageFromServer);
	}
	GUI.skin.label.alignment = TextAnchor.UpperLeft;

	//Popup.List (Rect((Screen.width / 2) - 140, (Screen.height / 2) - 45, 80, 20), showColor, colorEntry, GUIContent(colorList[colorEntry].text), colorList, listStyle);
	//Popup.List (Rect((Screen.width / 2) - 40, (Screen.height / 2) - 45, 80, 20), showAdj, adjEntry, GUIContent(adjList[adjEntry].text), adjList, listStyle);
	//Popup.List (Rect((Screen.width / 2) + 60, (Screen.height / 2) - 45, 80, 20), showAnimal, animalEntry, GUIContent(animalList[animalEntry].text), animalList, listStyle);
	GUI.SetNextControlName("usernameField");
	usernameField = GUI.TextField(Rect((Screen.width / 2) - 140, (Screen.height / 2) - 35, 80, 20), usernameField);
	GUI.SetNextControlName("passwordField");
	passwordField = GUI.PasswordField(Rect((Screen.width / 2) + 60, (Screen.height / 2) - 35, 80, 20), passwordField, "*"[0]);

	if (UnityEngine.Event.current.type == EventType.Repaint)
    {
        if (GUI.GetNameOfFocusedControl () == "usernameField")
        {
            if (usernameField == "username") usernameField = "";
        }
        else
        {
            if (usernameField == "") usernameField = "username";
        }
        
        if (GUI.GetNameOfFocusedControl () == "passwordField")
        {
            if (passwordField == "password") passwordField = "";
        }
    	else
        {
            if (passwordField == "") passwordField = "password";
        }
    }
    
	if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) - 5, 115, 32), "Login", "MainMenuButton"))
	{
		yield dm.Login(usernameField, passwordField);
		if (dm.user && dm.user.userID)
		{			
			yield InitializeUser();			
			loginState+=3;
		}
	}
	if(GUI.Button(Rect((Screen.width / 2) - 60, (Screen.height / 2) + 35, 120, 32), "Play as Guest", "MainMenuButton"))
	{
		dm.SetupDummyUser();
		if (dm.user && dm.user.userID)
		{			
			//yield InitializeUser();			
			loginState+=3;
		}
	}
	if(GUI.Button(Rect((Screen.width / 2) + 25, (Screen.height / 2) - 5, 115, 32), "Make My ID", "MainMenuButton"))
	{
		loginState++;
		usernameField = "";
		passwordField = "";
	}
	   
	   

}

function NotARobotWidget()
{	
	if(!setupcaptcha)
	{
		var posi = new List.<String>();
		var negi = new List.<String>();
		posi.Add("Yup!");
		posi.Add("ok!");
		posi.Add("Sure am!");
		posi.Add("I agree.");
		posi.Add("Register");
		posi.Add("Login");
		posi.Add("Agree.");
		posi.Add("Yes, please.");
		posi.Add("2 + 2 = 4");
		negi.Add("Nope.");
		negi.Add("No way.");
		negi.Add("I'm not.");
		negi.Add("No.");
		correctCaptcha = parseInt(Random.Range(0,5));
		captchaCollection = new List.<String>();
		
		for (var ic = 0; ic < 6; ic++)
		{
			
			var collection : List.<String> = (ic == correctCaptcha) ? negi : posi;
			var randInd : int = parseInt(Random.Range(0,collection.Count));
			captchaCollection.Add(collection[randInd]);
		}
		
		setupcaptcha = true;
	}
	
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 250), "Are you a robot?");

	for (var i = 0; i < 6; i++)
	{
		if(GUI.Button(Rect((Screen.width / 2) - 40, (Screen.height / 2) - 35 + (30 * i), 80, 20), captchaCollection[i], "MainMenuButton"))
		{
			if(i == correctCaptcha)
				loginState++;
			else
			{
				Debug.Log("bot detected!");
				correctCaptcha = -100;
			}
		}
	}

}

function RegisterWidget()
{
	GUI.skin.label.alignment = TextAnchor.MiddleCenter;

	
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 150), "Register for a B.O.T.S. ID");
	if (dm.messageFromServer.Contains("fail"))
	{
		GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 150), "Sorry, that name is already taken.");
	}
	else if (dm.messageFromServer != "")
	{
		GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 150), dm.messageFromServer);
	}
	GUI.skin.label.alignment = TextAnchor.UpperLeft;

	//Popup.List (Rect((Screen.width / 2) - 140, (Screen.height / 2) - 45, 80, 20), showColor, colorEntry, GUIContent(colorList[colorEntry].text), colorList, listStyle);
	//Popup.List (Rect((Screen.width / 2) - 40, (Screen.height / 2) - 45, 80, 20), showAdj, adjEntry, GUIContent(adjList[adjEntry].text), adjList, listStyle);
	//Popup.List (Rect((Screen.width / 2) + 60, (Screen.height / 2) - 45, 80, 20), showAnimal, animalEntry, GUIContent(animalList[animalEntry].text), animalList, listStyle);
	GUI.SetNextControlName("usernameField");
	usernameField = GUI.TextField(Rect((Screen.width / 2) - 140, (Screen.height / 2) - 35, 80, 20), usernameField);
	GUI.SetNextControlName("passwordField");
	passwordField = GUI.TextField(Rect((Screen.width / 2) + 60, (Screen.height / 2) - 35, 80, 20), passwordField);

	if (UnityEngine.Event.current.type == EventType.Repaint)
    {
        if (GUI.GetNameOfFocusedControl () == "usernameField")
        {
            if (usernameField == "username") usernameField = "";
        }
        else
        {
            if (usernameField == "") usernameField = "username";
        }
        
        if (GUI.GetNameOfFocusedControl () == "passwordField")
        {
            if (passwordField == "password") passwordField = "";
        }
    	else
        {
            if (passwordField == "") passwordField = "password";
        }
    }
    
	if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) + 35, 80, 32), "Go Back", "MainMenuButton"))
	{
		loginState-= 2;
		setupcaptcha = false;
		usernameField = "";
		passwordField = "";
	}
	if(GUI.Button(Rect((Screen.width / 2) + 60, (Screen.height / 2) + 35, 80, 32), "Register", "MainMenuButton"))
	{
		yield dm.Register(usernameField, passwordField);
		if(!dm.messageFromServer.Contains("Sorry,") && !dm.messageFromServer.Contains("Error"))
		{
			loginState-=2;
			dm.messageFromServer = "";
		}
		usernameField = "";
		passwordField = "";
	}	    
}

function StudySignupWidget()
{
	if(false) //dm.user.askForStudy == 1) Do not ask for studies right now.
	{
		GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 150), "You are not enrolled in a study.");
		GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 55, 300, 150), "If you'd like to enroll, enter the study ID here.");
	
		studyField = GUI.TextField(Rect((Screen.width / 2) - 80, (Screen.height / 2) - 35, 80, 20), studyField);
		
		if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) + 35, 80, 32), "Sign Up", "MainMenuButton"))
		{
			yield dm.Enroll(dm.user.username, studyField);
			if(dm.messageFromServer != "fail")
			{
				Debug.Log(dm.messageFromServer);
				loginState++;		
			}
		}
		if(GUI.Button(Rect((Screen.width / 2) + 60, (Screen.height / 2) + 35, 80, 32), "No Thanks", "MainMenuButton"))
		{
			yield dm.Enroll(dm.user.username, "0");
				loginState++;
		}
	}
	else
	{
//		Debug.Log(dm.user.askForStudy);
		loginState++; 
		loginState++;
		return; 
	}
}

function AssentScriptWidget()
{
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 275, 300, 700), "Assent Script");
	GUI.Label(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 255, 300, 700), dm.messageFromServer);
	
	if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) + 325, 80, 32), "I Disagree", "MainMenuButton"))
	{
		loginState++;
	}
	
	if(GUI.Button(Rect((Screen.width / 2) + 60, (Screen.height / 2) + 325, 80, 32), "I Agree", "MainMenuButton"))
	{
		loginState++;
	}
}

function AdminPasswordWidget()
{
	//don't draw this!
	return;
	
	GUI.Box(Rect((Screen.width / 2) - 150, (Screen.height / 2) - 75, 300, 150), "Password Reset");
	
	
	
	GUI.SetNextControlName("usernameField");
	usernameField = GUI.TextField(Rect((Screen.width / 2) - 140, (Screen.height / 2) - 35, 80, 20), usernameField);
	GUI.SetNextControlName("passwordField");
	passwordField = GUI.TextField(Rect((Screen.width / 2) + 60, (Screen.height / 2) - 35, 80, 20), passwordField);

	
	if(GUI.Button(Rect((Screen.width / 2) - 140, (Screen.height / 2) + 35, 80, 32), "Reset", "MainMenuButton"))
	{
		//yield dm.Login("admin", "game9%7learn");
		yield dm.AdminReset(usernameField, passwordField);
	}
}

function DefaultLoadUser() //???
{
	var tempName = sourceVals.Split("&"[0]);
	GLOBALS.USERNAME = tempName[0];
	GLOBALS.USER_ID= parseInt(tempName[1]);

	try{
	GLOBALS.VERSION_NUM = parseInt(tempName[2]);
	}
	catch(err)
	{
	GLOBALS.VERSION_NUM = 0;
	}
}

function Start()
{
	if(dm.messageFromServer.Contains("Error:"))
		loginState = -1;
	else if(dm.user && dm.user.userID)
		loginState = 5;
	
}

function OnGUI()
{
	if(!GUILoaded)
		return;
	
	GUI.skin = mainMenuSkin;
	
	
	if(loginState == -1)
	{
		ErrorWidget();
		return;
	}
	
	else if(loginState == 0)
	{
		LoginWidget();
		return;
	}
	
	else if(loginState == 1)
	{
		NotARobotWidget();
		return;
	}
	
	else if (loginState == 2)
	{
		RegisterWidget();
		return;
	}
	
	else if (loginState == 3)
	{
		StudySignupWidget();
		return;
	}
	
	else if (loginState == 4)
	{
		AssentScriptWidget();
		return;
	}
	else if (loginState == 5)
	{
		
		ReadyToPlay();
		
		//display the admin controls if the user is an admin
		if(dm.user.isAdmin)
		{
			if(GUI.Button(Rect(10, (Screen.height - 10 - 50), 50, 50), "ADMIN", "MainMenuButton"))
			{
				Application.LoadLevel("AdminSettings");
			}
			GUI.BeginGroup(Rect((Screen.width / 2) - 180, (Screen.height / 2) - 105, 800, 800));
			GUI.skin = mainMenuSkin;
			AdminPasswordWidget();
			GUI.EndGroup();
		}
	}
	else 
		return;
}

function ReadyToPlay()
{
	ShowStudyGUI = false;
	
	campaignMode.SetActive(true);
	freePlayMode.SetActive(true);
	//storyMode.SetActive(true);
	
//	Debug.Log("Ready To Play");
}

function InitializeUser()
{
	yield dm.GetUserData();
	
	//Debug.Log("Username: " + dm.user.username + ", User ID: " + dm.user.userID + ", Game Admin: " + dm.user.isAdmin  + ", AskForStudy: " + dm.user.askForStudy + ", Study ID: " + dm.user.current_study_id + ", Version Number: " + dm.user.version);
//	CheckForActiveStudy();
}
