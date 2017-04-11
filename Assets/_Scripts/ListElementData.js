#pragma strict
import UnityEngine;
import UnityEngine.UI;
import System.Collections;

public class ListElementData extends MonoBehaviour
{
	var level : LevelData;
	private var dm : DataManager;
	private var playBtnClicked;
	private	var showBestPopup;
	//Visual elements
	var playBtn : Button;
	var bestBtn : Button;
	var levelName : Text;
	var author : Text;
	var yourScore : Text;
	var windowRect : Rect;
	var medal : Image;
	var blank : Sprite;
	var bronze : Sprite;
	var silver : Sprite;
	var gold : Sprite;
	var platinum : Sprite;

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
	
	function unlockLevel()
	{
		playBtn.GetComponentInChildren(Text).text = "Play";
		playBtn.GetComponentInChildren(Text).color = Color.green;
    	playBtn.colors.normalColor = Color.white;
	}
	
	function lockLevel()
	{
		playBtn.GetComponentInChildren(Text).text = "Locked";
		playBtn.GetComponentInChildren(Text).color = Color.red;
    	playBtn.colors.normalColor = Color.red;
    	playBtn.colors.highlightedColor = Color.red;
    	playBtn.colors.pressedColor = Color.red;
	}
	
	function SetFields(lvl : LevelData)
	{
		level = lvl;
		playBtnClicked = false;
		showBestPopup = false;
		//assign function to the buttons
	    playBtn.onClick.AddListener(PlayLevel);
	    bestBtn.onClick.AddListener(ActivateBestScorePopup);
	    //assign Play Button text and color
	    playBtn.GetComponentInChildren(Text).text = "Play";
		playBtn.GetComponentInChildren(Text).color = Color.green;
    	playBtn.colors.normalColor = Color.white;
	    //level name and author are set
		levelName.text = level.puzzle;
		author.text = "created by: " + level.author;
		//configure Best Score Popup
		bestBtn.GetComponentInChildren(Text).text = "Best\nScore:\n" + level.hiscore;
		//set your score for this level
		yourScore.text = "Your\nScore:\n" + level.myhiscore;
		//set medal
		medal.sprite = blank;
		if(level.myhiscore && level.hiscore)
		{
				medal.sprite = bronze;
				if(level.myhiscore <= (level.hiscore * 2))
				{
					medal.sprite = silver;
				}
				if(level.myhiscore <= (level.hiscore * 1.5))
				{
					medal.sprite = gold;
				}
				if(level.myhiscore <= (level.hiscore))
				{
					medal.sprite = platinum;
				}
		}
	}
	
	function OnGUI()
	{
		if(playBtnClicked)
		{
			if(!dm.IsBusy())
			{
				Application.LoadLevel("_GameWorld");	
			}
		}
		if(showBestPopup)
		{
     		windowRect = GUI.Window(0, new Rect(Screen.width/2 - Screen.width/6, Screen.height/2 - Screen.height/10, Screen.width/3, Screen.height/5), ShowBestScorePopup, "Best Score");
		}
	}
	
	function PlayLevel ()
	{
		if(playBtn.GetComponentInChildren(Text).text.Equals("Play"))
		{
			playBtnClicked = true;
			dm.selectedLevel = level;
			var filename = "error.xml";
			filename = parseInt(level.PUZZLE_ID) + ".xml";
			dm.levelToLoad = level.PUZZLE_ID;
			dm.filenameToLoad = filename;
			dm.gameplayMode = "play";
			dm.LoadLevel(filename);
		}
	}
	
	function ActivateBestScorePopup()
	{
		showBestPopup = true;
	}
	
	function ShowBestScorePopup (windowID : int)
	{	
		//generate string
		var champ = level.champ ? level.champ : "nobody!";
		var encouragementString = "Complete the level to earn Bronze!";
		if (level.myhiscore && level.myhiscore > 0 && level.hiscore && level.hiscore > 0)
		{
					encouragementString = "Use " + (level.hiscore * 2) + " or less commands to earn Silver!";
				if (level.myhiscore && (level.hiscore * 2) >= level.myhiscore)
					encouragementString = "Use " + parseInt(level.hiscore * 1.5) + " or less commands to earn Gold!"; //silver
				if (level.myhiscore && (level.hiscore * 1.5) >= level.myhiscore)
					encouragementString = "Match or beat the Champ's score to earn Platinum!"; //gold
				if (level.myhiscore == level.hiscore)
					encouragementString = "You have the Platinum score!"; 
		}
		var myscorestring = (level.myhiscore && level.myhiscore > 0) ? "You used " + level.myhiscore + " commands." : "You haven't completed this level."; 	
		//draw the GUI elements
		GUI.Label(new Rect(5, windowRect.height/8, windowRect.width, windowRect.height), 
		level.puzzle + "'s current champ is " + champ + " who used only " + level.hiscore + " commands!" +
		'\n' + '\n' + myscorestring + '\n' + encouragementString);
		if (GUI.Button(new Rect(windowRect.width * 5/12, windowRect.height * 3/4, windowRect.width/6, windowRect.height/8), "OK"))
        {
        	showBestPopup = false;
        }
	}
}