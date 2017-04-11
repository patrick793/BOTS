//Button Selection Variables
//******************************************************************
//Main Menu for Campaign
//******************************************************************
var isQuitButton=false;
var isCampaignButton=false;
var isStoryButton=false;
var dm : DataManager;

function Awake()
{
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
}

//Mouse Detection
function OnMouseEnter () 
{
	renderer.material.color = Color.red;
}

function OnMouseExit () 
{
	renderer.material.color = Color.white;
}
//Menu Selections
function OnMouseUp ()
{
	//Exit
	if(isQuitButton)
	{
		//quit game
		Application.Quit();
	}
	if(isCampaignButton)
	{
		//Enter Campaign Mode
		dm.gameplayMode = "campaign";
		Application.LoadLevel("Tutorial");
	}
	else if(isStoryButton)
	{
		//Enter Story Mode
		dm.gameplayMode = "story";
		Application.LoadLevel("Story");
	}
	else
	{
		//Enter Free Play
		dm.gameplayMode = "";
		//Application.LoadLevel("Start");
		Application.LoadLevel("_NewFreePlayMenu");
	}
	
}