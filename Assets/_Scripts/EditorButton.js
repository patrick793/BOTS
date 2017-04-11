#pragma strict

private var dm : DataManager;
public var type : String;
function Awake()
{
	//find and get the DataManager to assign it to "dm"
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
	if(type.Equals("ClickEditor") && dm.user.username != "admin")
	{
		this.gameObject.SetActive(false);
	}
	if(type.Equals("ProgramEditor") && dm.user.username != "admin" && parseInt(dm.user.userID) % 2 == 0)
	{
		this.gameObject.SetActive(false);		
	}
	if(type.Equals("BlockEditor") && dm.user.username != "admin" && parseInt(dm.user.userID) % 2 == 1)
	{
		this.gameObject.SetActive(false);		
	}
}
	
function OpenEditorScene()
{
	if(type.Equals("ClickEditor"))
	{
		dm.gameplayMode = "clickEdit";
		Application.LoadLevel("_WorldEditor");
	}
	if(type.Equals("ProgramEditor"))
	{
		dm.gameplayMode = "progEdit";
		Application.LoadLevel("_GameWorld");
	}
	if(type.Equals("BlockEditor"))
	{
		dm.gameplayMode = "blockEdit";
		Application.LoadLevel("_WorldEditor");
	}
}