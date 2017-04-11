#pragma strict
import UnityEngine;
import UnityEngine.UI;
import System.Collections;

public class PopulateScrollList extends MonoBehaviour {
	private var currentListElements :  List.<GameObject> = new List.<GameObject>();
	private var dm : DataManager;
	private var selectedCollection :  List.<GameObject> = new List.<GameObject>();
	private var popUpCollection : List.<LevelData>;
	private var loadedLevels;
	private var showCongratsPopup;
	private var campaignLevels : List.<GameObject> = new List.<GameObject>();
	private var officialLevels : List.<GameObject> = new List.<GameObject>();
	private var customLevels : List.<GameObject> = new List.<GameObject>();
	private var myLevels : List.<GameObject> = new List.<GameObject>();
	private var unfinishedLevels : List.<GameObject> = new List.<GameObject>();
	private var myLevelsNotPlat : List.<GameObject> = new List.<GameObject>();
	private var otherLevelsNotPlat : List.<GameObject> = new List.<GameObject>();
	private var platLevels : List.<GameObject> = new List.<GameObject>();
	private var goldLevels : List.<GameObject> = new List.<GameObject>();
	private var silverLevels : List.<GameObject> = new List.<GameObject>();
	private var bronzeLevels : List.<GameObject> = new List.<GameObject>();
	public var contentPanel : Transform;
	public var loadingText : Text;
	public var listElement : GameObject;
	public var listPanel : GameObject;
	public var searchBar : InputField;
	public var campaignTab : Button;
	public var officialTab : Button;
	public var customTab : Button;
	public var myTab : Button;
	public var unfinishedTab : Button;
	public var myLevelsNotPlatBtn : Button;
	public var otherPlayersLevelsNotPlatBtn : Button;
	public var platLevelsBtn : Button;
	public var goldLevelsBtn : Button;
	public var silverLevelsBtn : Button;
	public var bronzeLevelsBtn : Button;
	public var windowRect : Rect;
	
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
	}
	
	//builds a filtered custom levels list
	function FilteredList(searchStr : String)
	{
		//remove elements from the list
		contentPanel.transform.DetachChildren();
		for (var element in selectedCollection)
		{
			if(element.GetComponent(ListElementData).level.author.ToLower().Contains(searchStr.ToLower())
				|| element.GetComponent(ListElementData).level.puzzle.ToLower().Contains(searchStr.ToLower()))
			{
				element.gameObject.transform.SetParent (contentPanel.gameObject.transform);
			}
		}		
	}
	
	function Start()
	{	
		loadedLevels = false;
		showCongratsPopup = false;
		GetLevels();
		popUpCollection = dm.platLevelContents;
		dm.ResetLevelToLoad();
		searchBar.onEndEdit.AddListener(function() {FilteredList(searchBar.text);});
	}
	
	function OnGUI()
	{
		//loads the default list of levels when it can
		if(!dm.IsBusy())
		{
			loadingText.text = "";
			if(dm.user.campaignProgress == 13 && !showCongratsPopup)
			{
				dm.user.campaignProgress = 12;
				showCongratsPopup = true;
			}
			if(showCongratsPopup)
			{
				windowRect = GUI.Window(0, new Rect(Screen.width/2 - Screen.width/6, Screen.height/2 - Screen.height/10, Screen.width/3, Screen.height/7), ShowCongratsPopup, "Congratulations!");
			}
			if(!loadedLevels)
			{
				loadLevels();
			}
		}
		else
		{
			loadingText.text = "Loading...";
		}
	}
	
	function GetLevels()
	{
		if(!dm.loaded)
		{
			yield dm.GetMyLevels();
			yield dm.GetFriendsLevelsAndCampaign();
		}
	}
	
	function SetCollection(collection : List.<GameObject>)
	{
		selectedCollection = collection;
	}
	
	function loadLevels()
	{
    	var listElementClone : GameObject;
    	//create tabs levels
		for(var i = 0; i < dm.user.campaignLevels.Count; i++)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(dm.user.campaignLevels[i]);
			if(i < dm.user.campaignProgress)
			{
				listElementClone.GetComponent(ListElementData).unlockLevel();
			}
			else
			{
				listElementClone.GetComponent(ListElementData).lockLevel();
			}
			//add to list
			campaignLevels.Add(listElementClone);
		}
		for (var level in dm.systemLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			officialLevels.Add(listElementClone);
		}
		for (var level in dm.friendsLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			customLevels.Add(listElementClone);
		}
		for (var level in dm.myLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			myLevels.Add(listElementClone);
		}
		for (var level in dm.mySavedLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			unfinishedLevels.Add(listElementClone);
		}
		//generate medals levels
		for(var level in myLevels)
		{
			if(level.GetComponent(ListElementData).level.medal < 4)
			{
				myLevelsNotPlat.Add(level);
			}
		}
		for(var level in customLevels)
		{
			if(level.GetComponent(ListElementData).level.medal != 4 && level.GetComponent(ListElementData).level.medal != 0)
			{
				otherLevelsNotPlat.Add(level);
			}
		}
		for (var level in dm.platLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			platLevels.Add(listElementClone);
		}
		for (var level in dm.goldLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			goldLevels.Add(listElementClone);
		}
		for (var level in dm.silverLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			silverLevels.Add(listElementClone);
		}
		for (var level in dm.bronzeLevelContents)
		{
			listElementClone = Instantiate(listElement);
			//set the fields for the new List Element
			listElementClone.GetComponent(ListElementData).SetFields(level);
			//add to list
			bronzeLevels.Add(listElementClone);
		}
		//set a list for default view
		for (var element in campaignLevels)
		{
			element.gameObject.transform.SetParent (contentPanel.gameObject.transform);
		}
		selectedCollection = campaignLevels;
		loadedLevels = true;		
	}
	
	public function PopulateList (tab : String) {
		//remove current list elements
		contentPanel.transform.DetachChildren();
		//assign collection based on tab
		switch (tab)
    	{
    	case "campaign_levels":
			selectedCollection = campaignLevels;
			campaignTab.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
   		case "official_levels":
			selectedCollection = officialLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "custom_levels":
			selectedCollection = customLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "my_levels":
			selectedCollection = myLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "unfinished_levels":
			selectedCollection = unfinishedLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "my_levels_not_plat":
			selectedCollection = myLevelsNotPlat;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "other_levels_not_plat":
			selectedCollection = otherLevelsNotPlat;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "plat_levels":
			selectedCollection = platLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "gold_levels":
			selectedCollection = goldLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "silver_levels":
			selectedCollection = silverLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
			bronzeLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
        	break;
    	case "bronze_levels":
			selectedCollection = bronzeLevels;
			campaignTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			officialTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			customTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			unfinishedTab.colors.normalColor = Color(0.25, 0.25, 0.25, 1);
			myLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			otherPlayersLevelsNotPlatBtn.colors.normalColor = Color(1, 1, 1, 1);
			platLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			goldLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			silverLevelsBtn.colors.normalColor = Color(1, 1, 1, 1);
			bronzeLevelsBtn.colors.normalColor = Color(0.47, 0.47, 0.47, 1);
        	break;
    	default:
			Debug.Log("Tab not recognized");
        	break;
    	}
    	//make sure all levels are unlocked if looking at custom levels
		if(selectedCollection.Equals(customLevels))
		{
			//unlock all custom levels
			for(var level in selectedCollection)
			{
				level.GetComponent(ListElementData).unlockLevel();
			}
		}

		//make sure certain levels are locked if looking at campaign levels
		if(campaignLevels.Count > 0 && selectedCollection.Equals(campaignLevels))
		{
			for(var i = 0; i < dm.user.campaignProgress; i++)
			{
				campaignLevels[i].GetComponent(ListElementData).unlockLevel();
			}
			for (var element in campaignLevels)
			{
				element.gameObject.transform.SetParent (contentPanel.gameObject.transform);
			}
		}
		else
		{
			//populate list with collection sorted from newest to oldest if not campaign
			for (i = (selectedCollection.Count - 1); i >= 0; i--)
			{
				selectedCollection[i].gameObject.transform.SetParent (contentPanel.gameObject.transform);
			}
		}
	}
	
	public function ShowCongratsPopup(windowID : int)
	{
		GUI.Label(new Rect(5, windowRect.height/4, windowRect.width, windowRect.height), 
		"Great job, " + dm.user.username + "! You have completed the campaign!");
		if (GUI.Button(new Rect(windowRect.width * 5/12, windowRect.height * 3/4, windowRect.width/6, windowRect.height/7), "OK"))
        {
        	showCongratsPopup = false;
        }
	}
}