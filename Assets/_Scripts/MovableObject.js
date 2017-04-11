#pragma strict

enum WinCondition { NONE, STAND_ON }
@HideInInspector var canBeLifted : boolean = false;
@HideInInspector var hasCollision : boolean = false;
@HideInInspector var canBeWalkedOn : boolean = false;
@HideInInspector var isHeavy : boolean = false;   //Determines if a bot can jump while carrying the object
@HideInInspector var liftWidth : float = 1.0;
@HideInInspector var heightBoost : float = 0.0;
@HideInInspector var winCondition : WinCondition = WinCondition.NONE;
@HideInInspector var mainTexture : Material;
var secondaryTexture : Material;

function Awake(){

	//Factory for creating movable blocks
	if( renderer != null )
		mainTexture = renderer.material;
	switch( gameObject.name ){
		
		case "Box(Clone)":
			canBeLifted = true;
			hasCollision = true;
			liftWidth = 0.6;
		break;
		
		case "Heavy Box(Clone)":
			canBeLifted = true;
			hasCollision = true;
			canBeWalkedOn = true;
			isHeavy = true;
		break;
		
		case "Switch(Clone)":
			heightBoost = 0.05;
			winCondition = WinCondition.STAND_ON;
		break;
	
	}

}

function Initiate(){
	var x = Mathf.Floor(transform.position.x + (WorldManager.worldMaxX>>1));
	var y = Mathf.Floor(transform.position.y + (WorldManager.worldMaxY>>1));
	var z = Mathf.Floor(transform.position.z + (WorldManager.worldMaxZ>>1));
	WorldManager.UpdatePosition(x,y,z);
}

function CheckWinCondition() : boolean{
		
	
	var switchPos = WorldManager.WorldToBlocks(transform.position);
	switch( winCondition ){
	
		
		case WinCondition.NONE:
			return true;
		break;
			
		case WinCondition.STAND_ON:
			var pressed = false;
			for( var bot in WorldManager.botsList ){
				var botPos = WorldManager.WorldToBlocks(bot.obj.transform.position);
				if( botPos == switchPos )
					pressed = true;
			}
			for( var obj in WorldManager.movableList ){
				if( obj.obj != gameObject ){
					var objPos = WorldManager.WorldToBlocks(obj.obj.transform.position);
					if( objPos == switchPos )
						pressed = true;
				}
			}
			if( pressed ){
				renderer.material = secondaryTexture;
				return true;
			}else{
				renderer.material = mainTexture;
				return false;
			}
		break;
	
	}
	
	return false;
}
