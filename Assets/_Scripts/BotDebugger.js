#pragma strict
import System.Collections.Generic;


/**
This addes twitch control and some functionality to all bots
*/
var debugActive : boolean = false;
private var curBotObj : GameObject;
private var curBotVar : Bot;

private var infoString : String = "DEBUGGER EXISTS! \n\n"+
"Press 'up' to move bot forward \n"+
"Press 'down' to move bot backward \n"+
"Press 'right' to turn bot right \n"+
"Press 'left' to turn bot left \n"+
"Press 'space' to climb up a block \n"+
"Press 'left-control' to climb down a block \n"+
"Press 'enter' to pick up a movable \n"+
"Press 'right-shift' to put down a movable \n" +
"Press 'w' to wait \n" +
"Press 'backspace' to remove a command";

private var timer : WorldTimer;
function Awake () {

	//Destroy itself if it's not active
	if( !debugActive )
		DestroyObject(gameObject);

	//Find the timer to use
	timer = WorldTimer.GetInstance();
	
}

function Update () {

	//Select a bot
	var newBot = Bot.BotClicked();
	if( newBot != null ){
		curBotObj = newBot;
		curBotVar = newBot.GetComponent(Bot);
		Debug.Log("Selected bot for debuging");
	}
	
	//Twitch gameplay for bots
	if( curBotObj != null ){
		if( Input.GetKeyDown("up") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Forward","MoveForward") );
		}
		if( Input.GetKeyDown("right") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Right","TurnRight") );
		}
		if( Input.GetKeyDown("down") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Back","MoveBackward") );
		}
		if( Input.GetKeyDown("left") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Left","TurnLeft") );
		}
		if( Input.GetKeyDown("space") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Climb","ClimbUp") );
		}
		if( Input.GetKeyDown("left ctrl") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Fall","ClimbDown") );
		}
		if( Input.GetKeyDown("return") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Lift","PickUp") );
		}
		if( Input.GetKeyDown("right shift") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Drop","PutDown") );
		}
		if( Input.GetKeyDown("w") && !curBotVar.IsAnimating() ){
			curBotVar.program.Add( new CommandElement("Wait","Wait") );
		}
		if( Input.GetKeyDown(KeyCode.Backspace) && !curBotVar.IsAnimating() ){
			curBotVar.program.RemoveAt( curBotVar.program.Count-1 );
		}
		
	}
	
		
	
}


function OnGUI () {

	//Buttons
	GUI.depth = 0;
	GUI.Label(Rect(32,Screen.height/2,256,512),infoString);
	if( GUI.Button(Rect(32,Screen.height*0.9,96,Screen.height*0.05),"PLAY") )
		timer.Play();
	if( GUI.Button(Rect(32,Screen.height*0.95,96,Screen.height*0.05),"RESET") )
		WorldManager.ResetWorld();
		
	//Program
	if( curBotVar != null )
		for( var i : int = 0; i < curBotVar.program.Count; i++ )
			GUI.Label(Rect(Screen.width-96,Screen.height*0.5+i*24,64,24),curBotVar.program[i].name );

}