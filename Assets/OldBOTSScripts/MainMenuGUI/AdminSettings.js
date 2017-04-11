static var selected = 1;

var guiOffset : int = 60;

var menubarInt;
var menubarContent : String[];
var userViewVector : Vector2 = Vector2.zero;
var CaseStudyViewVector : Vector2 = Vector2.zero;
var otherViewVector : Vector2 = Vector2.zero;

var error :boolean = false;
var textAreaString : String = "here";
var bkgrd : GUIStyle;

var MenuStyle : GUIStyle;

var displayTooltip : boolean = false;
var tooltipPosition : Point;
public var tooltipContent : GUIContent;

////// User Vars
var UsersList = new Array();

///// Case Study Vars
var activeStudies = new Array();
var addNewStudy : boolean = false;
var newStudyName : String = "";
var dm : DataManager;

function Awake()
{
	MenuStyle = new GUIStyle();
	MenuStyle.alignment = TextAnchor.UpperCenter;
	MenuStyle.normal.textColor = Color.white;
	MenuStyle.margin.top = 15;
  dm = GameObject.Find("DataManager").GetComponent(DataManager);
}

function Start()
{
	menubarInt = 0;
	menubarContent  = new String[3];  //5

	GetUsers();
	GetCaseStudies();
}

function Update()
{
}

function OnGUI()
{
	//GUI.skin = mySkin;
	GUI.backgroundColor = new Color(255, 124, 221,23);

	if(displayTooltip)
	{
		GUI.Window(9001, Rect(0, 0, Screen.width, Screen.height), DisplayTooltip, "");
		GUI.FocusWindow(9001);
	}
	else if(addNewStudy)
	{
		GUI.Window(9002, Rect((Screen.width / 2) - 100, (Screen.height / 2) - 50, 200, 100), AddNewCaseStudyWindow, "Add a new Case Study");
		GUI.FocusWindow(9002);
	}
    else if(!error)
	{
		//Toolbar
		menubarContent[0] = " Users";
		menubarContent[1] = " Case Studies";
		menubarContent[2] = " Other";


		menubarInt = GUI.Toolbar (Rect (50, 10, Screen.width-100, 100), menubarInt, menubarContent);

		switch(menubarInt)
		{
			case 0:
				ShowUsers();
				break;

			case 1:
			  	ShowCaseStudies();
			  	break;

			case 2:
				ShowOther();
				break;
		}

		if(GUI.Button(Rect((Screen.width/2)+279, Screen.height/2+295, 125, 50), "Main Menu"))
		{
			Application.LoadLevel(0);
		}
	}
}

function ShowLevelDescription()
{
	GUI.Box(Rect(605,120,255,523),"");
//	GUI.Button(Rect(620,130,225,220),"Screenshot");
//	GUI.Label(Rect(620,350,210,470), SelectedLevelName, "LevelName2");
//	GUI.Label(Rect(620,430,210,470), SelectedLevelAuthor);
//	GUI.Label(Rect(620,510,210,470), SelectedLevelDescription);
}

function ShowUsers()
{
	selected = 0;

	userViewVector = GUI.BeginScrollView (Rect (50, 120, 550, Screen.height/2 + 225), userViewVector, Rect (0, 0, 90, (UsersList.length * guiOffset)));

	var countaur = 0;

	for (var item in UsersList)
	{

		GUI.Box(Rect(0, 0 + guiOffset * countaur, 530, 55),"");

		if(GUI.Button(Rect(10,2+guiOffset*countaur, 300, 50), item["username"]))
		{
			selected = countaur;
		}

		countaur++;
	}

	GUI.EndScrollView();

	ShowLevelDescription();

}

function ShowCaseStudies()
{
	CaseStudyViewVector = GUI.BeginScrollView(Rect (50, 120, 550, Screen.height/2 + 225), CaseStudyViewVector, Rect (0, 0, 90, (activeStudies.length * guiOffset)));

	var countaur = 0;

	for (var item in activeStudies)
	{

		GUI.Box(Rect(0, 0 + guiOffset * countaur, 530, 55),"");

		if(GUI.Button(Rect(10, 2 + guiOffset * countaur, 100, 50), item["study_name"]))
		{
			selected = countaur;
		}
		if(GUI.Button(Rect(120, 2 + guiOffset * countaur, 80, 50), item["Active"].ToString()))
		{
			var studyID : int = item["STUDY_ID"];
			var studyName : String = item["study_name"];
			var isActive :boolean = item["Active"];
			ToggleCaseStudyActive(studyID, studyName, isActive);
		}
		if(GUI.Button(Rect(210, 2 + guiOffset * countaur, 50, 50), item["version_1"].ToString()))
		{
			selected = countaur;
		}
		if(GUI.Button(Rect(270, 2 + guiOffset * countaur, 50, 50), item["version_2"].ToString()))
		{
			selected = countaur;
		}
		if(GUI.Button(Rect(330, 2 + guiOffset * countaur, 50, 50), item["version_3"].ToString()))
		{
			selected = countaur;
		}

		countaur++;
	}

	GUI.EndScrollView();

	if(GUI.Button(Rect((Screen.width/2)+150, Screen.height/2+295, 125, 50), "New Study"))
	{
		addNewStudy = true;
	}

}

function ShowOther()
{
	otherViewVector = GUI.BeginScrollView(Rect (50, 120, 425, Screen.height/2 +225), otherViewVector, Rect (0, 0, 400, Mathf.Floor(3) * 100));

	//var prevMail = mailSelectionInt;

	GUI.EndScrollView();
}

function MakeTooltip(newText : String)
{
	displayTooltip = true;
	tooltipContent = new GUIContent(newText);
	var mp_x = Input.mousePosition.x - 25;
	var mp_y = -Input.mousePosition.y+700;
	tooltipPosition = new Point(mp_x, mp_y);
}

function DisplayTooltip()
{
	GUI.BeginGroup(Rect(tooltipPosition.X, tooltipPosition.Y, 150, 100), tooltipContent, "dialog");
	if(GUI.Button(Rect(100, 50, 40, 40), "ok", "greenSquare"))
	{
		displayTooltip = false;
		tooltipContent.text = "";
		tooltipPosition = new Point(0,0);
	}
	GUI.EndGroup();
}

function GetUsers()
{
	var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/getUser.php?userid=ALL");
	yield www;

	//Load Games into levelNames
	var users = Array();
	var userQuerey : String[] = www.text.Split(";"[0]);

	//var i = 0;
	for(var newRow in userQuerey)
	{
		if (newRow != "")
		{
			var row : String[] = newRow.Split(","[0]);
			var weirdObject = {};
			weirdObject["username"] = row[0];
			weirdObject["version"] = parseInt(row[1]);
			weirdObject["current_study_id"] = parseInt(row[2]);

			users.Add(weirdObject);
		}
	}

	UsersList = users;

}

function GetCaseStudies()
{
	var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/getCaseStudies.php");
	yield www;

	//Load Games into levelNames
	var studies = Array();
	var studiesQuerey : String[] = www.text.Split(";"[0]);

	//var i = 0;
	for(var newRow in studiesQuerey)
	{
		if (newRow != "")
		{
			var row : String[] = newRow.Split(","[0]);
			var weirdObject = {};
			weirdObject["STUDY_ID"] = parseInt(row[0]);
			weirdObject["study_name"] = row[1];

			if (parseInt(row[2]) > 0)
			{
				weirdObject["Active"] = true;
			}
			else
			{
				weirdObject["Active"] = false;
			}

			weirdObject["version_1"] = parseInt(row[3]);
			weirdObject["version_2"] = parseInt(row[4]);
			weirdObject["version_3"] = parseInt(row[5]);

			studies.Add(weirdObject);
		}
	}

	activeStudies = studies;
}

function AddNewCaseStudyWindow()
{
	GUI.Label(Rect(15, 25, 100, 25), "STUDY NAME:");
	newStudyName = GUI.TextField(Rect(110, 25, 75, 25), newStudyName, 8);

	if (newStudyName != "ERROR" && GUI.Button(Rect(115, 65, 75, 25), "ADD"))
	{
		Debug.Log("Adding a New Study");
		AddNewCaseStudy(newStudyName);


	}
	if (GUI.Button(Rect(15, 65, 75, 25), "BACK"))
	{
		addNewStudy = false;
	}
}

function AddNewCaseStudy(studyName : String)
{
	var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/addCaseStudy.php?studyName=" + studyName);
	yield www;

	if (www.text == "SUCCESS")
	{
		addNewStudy = false;
		Debug.Log("Studdy Added");
		GetCaseStudies();
	}
	else
	{
		Debug.Log("Error Adding Study");
		newStudyName = "ERROR";
	}


}

function ToggleCaseStudyActive(studyID : int, studyName : String, studyActive : boolean)
{
	Debug.Log("Setting case study '" + studyName + "' isActive to: " + !studyActive);

	var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/setUserStudyActive.php?studyID=" + studyID + "&isActive=" + !studyActive);
	yield www;

	Debug.Log("Returned: " + www.text);

	GetCaseStudies();
}

function JoinStudy(studyName : String)
{
//	Debug.Log("Trying to join case study: " + studyName);
//
//	for(i = 0; i < activeStudies.length; i++)
//	{
//		if (studyName == activeStudies[i]["study_name"])
//		{
//			Debug.Log("Study Found, Attempting to add user to study");
//			yield AssignUserToStudy(activeStudies[i]["STUDY_ID"]);
//			return;
//		}
//	}
}

function AssignUserToStudy(study_id : int)
{
	var www : WWW = WWW(dm.location + "drupal-6.2/scripts/bots/setUserStudy.php?userid=" + GLOBALS.USER_ID + "&studyid=" + study_id);
	yield www;

	if (www.text == "Success")
	{
		Debug.Log("User added to case study");
		//InitializeUser();
		//CheckForActiveStudy();
	}
	else
	{
		Debug.Log("Error adding user to case study");
		//ShowStudyGUI = true;
	}
}
