#pragma strict

class WorldTimer {

	//Animation Timer
	var animSpeed : float = 3.0; //1.2
	var finalAnimSpeed : float = 3.0;
	var playing = false;
	static var hasWon : boolean = false;

	//Singleton creation
	private static var instance : WorldTimer;
	public static function GetInstance() : WorldTimer{
		if( instance == null )
			instance = new WorldTimer();
		return instance;
	}
	
	//Function for bots no notify the timer when they're done animating
	function BotReady(){
		//Debug.Log("Ready!");
		var readyToGo = true;
		var bot : BotType;
		for( bot in WorldManager.botsList )
			if( bot.obj.GetComponent(Bot).IsAnimating() && !bot.obj.GetComponent(Bot).HasError() ){
				readyToGo = false;
				break;
			}

		if( readyToGo )
			for( bot in WorldManager.botsList ){
				//if ANY bot is past their last index, slow down
				if(!bot.obj.GetComponent(Bot).FastMode())
				{
					animSpeed = 2.5;
					finalAnimSpeed = 2.5;
				}
				bot.obj.GetComponent(Bot).RunCommand();
			}
	
	}
	
	//Function to run the programs of all bots in the scene
	function Play(){
		Debug.Log("Playing?");
		playing = true;
		BotReady();
	}
	
	//Function to step the scene by one command
	function Step(){
		playing = false;
		BotReady();
	}
	
	function Reset( botObj : GameObject ) : GameObject{
	
		hasWon = false;
		playing = false;
		Variables.Get().reset();
		var botIndex = -1;
		if( botObj != null )
			for( var i=0; i<WorldManager.botsList.Count; i++ )
				if( WorldManager.botsList[i].obj == botObj ){
					botObj.GetComponent(Bot).ResetIndex();
					botIndex = i;
				}
		
		//Reset the world
		finalAnimSpeed = 2.5;
		animSpeed = finalAnimSpeed;
		WorldManager.ResetWorld();
		
		if( botIndex >= 0 ){
			return WorldManager.botsList[botIndex].obj;
			
		}else{
			return null;
		}
	}
	
	//Function to stop animation when there's an error
	function Pause(){
		animSpeed = 0;
	}
	
	function Win(){
		if( hasWon )
			return;
		hasWon = true;
		
		GUIManager.Get().ActivatePopUp( PopUpType.WIN );
	}
	
	function Save(){
		if( hasWon )
			return;
		hasWon = true;
		
		GUIManager.Get().ActivatePopUp( PopUpType.PROG_EDIT_SAVE );
	}

}