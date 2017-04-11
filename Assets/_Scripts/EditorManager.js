#pragma strict


//Raycast information
enum ObjType { NONE, BLOCK, BOT, MOVABLE, LOCATION }
@HideInInspector var hit : RaycastHit;
@HideInInspector var hitType : ObjType;
@HideInInspector var hitBot : Bot;
@HideInInspector var hitMovable : MovableObject;

//Selection
var selectionQuad : GameObject;
var selectionBox : GameObject;
private var clickTimer : float;

//Mode
enum EditModes { ADD, ERASE, BLOCK }
@HideInInspector var mode : EditModes;

//Informantion timer
var mouseTimer : MouseTimer;

//If we can raycast
public var canRaycast : boolean = true;

//Carry objects
@HideInInspector public var carryMov : MovableType = null;
@HideInInspector public var carryBot : BotType = null;

function Start () {
	mouseTimer = MouseTimer.Get();

	//Mode setup
	if(WorldManager.dm.gameplayMode != "blockEdit")
		mode = EditModes.ADD;
	else
		mode = EditModes.BLOCK;

	//Carry setup
	carryMov = null;
	carryBot = null;

}

function Update () {


	//Raycast for pointing to blocks
	if( canRaycast ){
		performRaycast();
	
	
		//Adding and removing blocks
		handleBlocks();
		
		//Adding and removing movables
		handleMovables();
		
		//Adding and removing bots
		handleBots();
		
		//Carrying objects
		handleCarry();
	
	}
	canRaycast = true;

	//Misc
	if( clickTimer > 0 )
		clickTimer -= Time.deltaTime;
	
	
	if( Input.GetKeyDown(KeyCode.Space) )
		Debug.Log("Saved: \n"+WorldManager.worldToString());
		
	if( Input.GetKeyDown(KeyCode.X))
	{
		Debug.Log("Undo!");
		undoBuildingBlock();
	}
		

}






/**
This method performs the raycast to the mouse pointer position
*/
function performRaycast() : void{

	//Perform the raycast
	hitType = ObjType.NONE;
	selectionQuad.renderer.active = false;
	selectionBox.renderer.active = false;
	var ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	var rayHit = Physics.Raycast( ray, hit, 100 );
	
	//Set the hit type
	if( rayHit && !Input.GetButton("Fire2") && !EditorGUIManager.muteGUI){
		hitBot = hit.transform.gameObject.GetComponent(Bot);
		hitMovable = hit.transform.gameObject.GetComponent(MovableObject);
		if( hitBot != null ){
			hitType = ObjType.BOT;
		}else if( hitMovable != null ){
			hitType = ObjType.MOVABLE;
		}else{
			hitType = ObjType.BLOCK;
		}
		
		//Check if something is being carried
		if( carryMov != null || carryBot != null ){
			if( hitType == ObjType.BLOCK ){
				hitType = ObjType.LOCATION;
			}else{
				hitType = ObjType.NONE;
			}
		}
		
	}
	
}

function newBlockAtPosition(newBlockPos : Vector3, addBlock : boolean) : boolean
{
	var canAddBlock = true;
	var blockHere = false;
	var errorCode = "ok";
	
	//Make sure there's not already a block there
	//TODO: Why?
	try{
		if( WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock )
			{
				errorCode = "block here";
				blockHere = true;
			}
	}catch(e){
		errorCode = "oob";
		canAddBlock = false;
		
	}
	
	//If I'm in BLOCK_EDIT make sure that, if this space is empty, the space under me isn't walked on
	try{
		if(!blockHere && WorldManager.block[newBlockPos.x,newBlockPos.y-1,newBlockPos.z].hasBeenWalkedOn )
		{
			errorCode = "walked on";
			canAddBlock = false;
		}
	}catch(e){
		//ok
	}
	
	//Make sure the block isn't OOB
	if(WorldManager.CheckBounds(true, false, newBlockPos.x, newBlockPos.y, newBlockPos.z) == false)
	{
		errorCode = "out of bounds";
		canAddBlock = false;
	}
		
	
	//Make sure there's not already a bot or movable there
	for( var mov in WorldManager.movableList )
		if( mov.obj != null && mov.startPos.Equals(newBlockPos) )
		{
			errorCode = "obj here";
			canAddBlock = false;
		}
	for( var bot in WorldManager.botsList )
		if( bot.startPos.Equals(newBlockPos) )
		{
			errorCode = "start here";
			canAddBlock = false;
		}
			
	//Show selection object
	if( canAddBlock ){
		mouseTimer.ShowInfoString( "Click to add a new block here." );
		if(hitType != ObjType.NONE)
		{
			selectionQuad.renderer.active = true;
			selectionQuad.transform.position = hit.transform.position + hit.normal*0.5;
			selectionQuad.transform.forward = hit.normal;
		}
		
		//Adding a new block
		if( addBlock ){
			var success = WorldManager.PlaceBlock(newBlockPos);
			WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock = success;
			WorldManager.CheckBounds(true, true, newBlockPos.x, newBlockPos.y, newBlockPos.z);
			return success;
			//WorldManager.PlaceBlock(newBlockPos);
			//WorldManager.BuildWorld();
			//WorldManager.ResetWorld();
		}					
	}
	
	if(!canAddBlock) Debug.Log(errorCode);
	return canAddBlock;
}

/**
This method will handle the logic for adding/removing blocks in the scene
*/
function handleBlocks(){
	if( hitType == ObjType.BLOCK ){
		
		//Add Mode
		if( mode == EditModes.ADD){
			selectionQuad.renderer.material.color = Color(0,1,0,1);
		
			//Get the possible new position
			var newBlockPos = WorldManager.WorldToBlocks(hit.transform.position + hit.normal);
			newBlockAtPosition(newBlockPos, Input.GetButtonDown("Fire1"));
			/*var canAddBlock = true;
			
			//Make sure there's not already a block there
			try{
				if( WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock )
					canAddBlock = false;
			}catch(e){
				canAddBlock = false;
			}
			
			//Make sure the block isn't too high
			if( newBlockPos.y >= WorldManager.worldMaxY-1 )
				canAddBlock = false;
			
			//Make sure there's not already a bot or movable there
			for( var mov in WorldManager.movableList )
				if( mov.startPos.Equals(newBlockPos) )
					canAddBlock = false;
			for( var bot in WorldManager.botsList )
				if( bot.startPos.Equals(newBlockPos) )
					canAddBlock = false;
			
			//Show selection object
			if( canAddBlock ){
				mouseTimer.ShowInfoString( "Click to add a new block here." );
				selectionQuad.renderer.active = true;
				selectionQuad.transform.position = hit.transform.position + hit.normal*0.5;
				selectionQuad.transform.forward = hit.normal;
				
				//Adding a new block
				if( Input.GetButtonDown("Fire1") ){
					WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock = true;
					WorldManager.BuildWorld();
					WorldManager.ResetWorld();
				}
					
				
			}
			
			*/
		
		//Erase Mode
		}else if( mode == EditModes.ERASE ){
			selectionBox.renderer.material.color = Color(1,0,0,1);
			
			//Make sure it's not the last block
			var blockPos = WorldManager.WorldToBlocks(hit.transform.position);
			var canRemoveBlock = false;
			for( var x = 0; x < WorldManager.worldMaxX; x++ )
				for( var y = 0; y < WorldManager.worldMaxY; y++ )
					for( var z = 0; z < WorldManager.worldMaxZ; z++ ){
						if( !Vector3(x,y,z).Equals(blockPos) && WorldManager.block[x,y,z].hasBlock )
							canRemoveBlock = true;
					}
					
			//Make sure there's nothing on top of it
			for( var mov in WorldManager.movableList )
				if( mov.startPos.Equals(blockPos+Vector3(0,1,0)) )
					canRemoveBlock = false;
			for( var bot in WorldManager.botsList )
				if( bot.startPos.Equals(blockPos+Vector3(0,1,0)) )
					canRemoveBlock = false;
			
			if( canRemoveBlock ){
				mouseTimer.ShowInfoString( "Click to remove this block." );
			
				//Show the selection box
				selectionBox.renderer.active = true;
				selectionBox.transform.position = hit.transform.position;
				
				//Removing the block
				if( Input.GetButtonDown("Fire1") ){
					WorldManager.block[blockPos.x,blockPos.y,blockPos.z].hasBlock = false;
					WorldManager.BuildWorld();
										WorldManager.ResetWorld();

				}
			
			}
			
		}
	
	
	
	}
}











/**
* This method will handle the logic for adding/removing movable objects in the scene
*/
function handleMovables(){
	if( hitType == ObjType.MOVABLE ){
	
		//Find the movable type in the world manager list
		var hitPos : Vector3 = WorldManager.WorldToBlocks( hit.transform.position );
		var mov : MovableType;
		for( mov in WorldManager.movableList )
			if( mov.startPos.Equals(hitPos) )
				break;

		//Add Mode
		if( mode == EditModes.ADD ){
			mouseTimer.ShowInfoString("Click once to rotate the object, or hold and drag to move it to a new location.");
		
			//Show the selection box
			selectionBox.renderer.material.color = Color(0,1,0,1);
			selectionBox.renderer.active = true;
			selectionBox.transform.position = hit.transform.position;
			
			//Inputs
			if( Input.GetButtonDown("Fire1") )
				clickTimer = 0.1;
			if( Input.GetButtonUp("Fire1") && clickTimer > 0 ){
				rotateObjectSmooth( hit.transform.gameObject );
				mov.startAng = (mov.startAng+1) % 4;
			}
			if( Input.GetButton("Fire1") )
				if( carryMov == null && clickTimer <= 0 ){
					pickUpMov(mov);
				}
		

		//Erase Mode
		}else if( mode == EditModes.ERASE ){
			mouseTimer.ShowInfoString("Click to remove this object from the scene.");
		
			//Show the selection box
			selectionBox.renderer.material.color = Color(1,0,0,1);
			selectionBox.renderer.active = true;
			selectionBox.transform.position = hit.transform.position;
				
			//Remove the object then update the world
			if( Input.GetButtonDown("Fire1") ){	
				DestroyObject(hit.transform.gameObject);
				WorldManager.movableList.Remove(mov);
				WorldManager.BuildWorld();
									WorldManager.ResetWorld();

			}
		
		}


	}
}





/**
* This method will handle the logic for adding/removing blots in the scene
*/
function handleBots(){
	if( hitType == ObjType.BOT ){
	
		//Find the movable type in the world manager list
		var hitPos : Vector3 = WorldManager.WorldToBlocks( hit.transform.position );
		var bot : BotType;
		for( bot in WorldManager.botsList )
			if( bot.startPos.Equals(hitPos) )
				break;

		//Add Mode
		if( mode == EditModes.ADD ){
			mouseTimer.ShowInfoString("Click once to rotate the bot, or hold and drag to move it to a new location.");
		
			//Show the selection box
			selectionBox.renderer.material.color = Color(0,1,0,1);
			selectionBox.renderer.active = true;
			selectionBox.transform.position = hit.transform.position;
			
			//Inputs
			if( Input.GetButtonDown("Fire1") )
				clickTimer = 0.1;
			if( Input.GetButtonUp("Fire1") && clickTimer > 0 ){
				rotateObjectSmooth( hit.transform.gameObject );
				bot.startAng = (bot.startAng+1) % 4;
			}
			if( Input.GetButton("Fire1") )
				if( carryBot == null && clickTimer <= 0 ){
					pickUpBot(bot);
				}
		

		//Erase Mode
		}else if( mode == EditModes.ERASE ){
			mouseTimer.ShowInfoString("Click to remove this object from the scene.");
		
			//Show the selection box
			selectionBox.renderer.material.color = Color(1,0,0,1);
			selectionBox.renderer.active = true;
			selectionBox.transform.position = hit.transform.position;
				
			//Remove the object then update the world
			if( Input.GetButtonDown("Fire1") ){	
				DestroyObject(hit.transform.gameObject);
				WorldManager.botsList.Remove(bot);
				WorldManager.BuildWorld();
				WorldManager.ResetWorld();

			}
		
		}


	}
}






/**
* This function handles the carrying and placing of movables and bots
*/
function handleCarry(){

	//Check if the selected object can be placed
	var canPlace : boolean = false;
	var blockPos : Vector3;
	if( hitType == ObjType.LOCATION ){
		canPlace = true;
		blockPos = WorldManager.WorldToBlocks( hit.transform.position );
		if( WorldManager.block[blockPos.x,blockPos.y+1,blockPos.z].hasBlock )
			canPlace = false;
		for( var mov in WorldManager.movableList )
			if( !mov.Equals(carryMov) )
				if( mov.startPos.Equals(blockPos+Vector3(0,1,0)) )
					canPlace = false;
		for( var bot in WorldManager.botsList )
			if( !bot.Equals(carryBot) )
				if( bot.startPos.Equals(blockPos+Vector3(0,1,0)) )
					canPlace = false;
		
		if( canPlace ){
			selectionQuad.renderer.material.color = Color(0,1,0,1);
			selectionQuad.renderer.active = true;
			selectionQuad.transform.position = hit.transform.position + Vector3(0,0.5,0);
			selectionQuad.transform.forward = Vector3.down;
		}
	}
	
	//Movable carrying
	if( carryMov != null ){
	
		/**
		//Carry position
		if( canPlace ){
			carryMov.obj.transform.position = hit.transform.position + Vector3(0,1,0);
		}else{
			carryMov.obj.transform.position = WorldManager.BlocksToWorld( carryMov.startPos );
		}
		*/
	
		//Placing
		if( !Input.GetButton("Fire1")){
			if( canPlace ){
				carryMov.startPos = blockPos + Vector3(0,1,0);
			}else{
				WorldManager.movableList.Remove(carryMov);
			}
			DestroyObject(carryMov.obj);
			carryMov = null;
			WorldManager.BuildWorld();
			WorldManager.ResetWorld();

		}
			
	
	//Bot Carrying
	} else if( carryBot != null ){
	
		/**
		//Carry position
		if( canPlace ){
			carryBot.obj.transform.position = hit.transform.position + Vector3(0,1,0);
		}else{
			carryBot.obj.transform.position = WorldManager.BlocksToWorld( carryBot.startPos );
		}
		*/
	
		//Placing
		if( !Input.GetButton("Fire1")){
			if( canPlace ){
				carryBot.startPos = blockPos + Vector3(0,1,0);
			}else{
				WorldManager.botsList.Remove(carryBot);
			}
			DestroyObject(carryBot.obj);
			carryBot = null;
			WorldManager.BuildWorld();
			WorldManager.ResetWorld();

		}
			
	
	}
	
	
	
	

}






/**
* This function will pick up a movable object to carry
*/
function pickUpMov( mov : MovableType ){
	carryMov = mov;
	hideWithChildren(carryMov.obj);
	carryMov.obj.collider.enabled = false;
}

/**
* This function will pick up a bot to carry
*/
function pickUpBot( bot : BotType ){
	carryBot = bot;
	hideWithChildren(carryBot.obj);
	carryBot.obj.collider.enabled = false;
}




/**
* This function recursively hides all children of a game object
*/
static function hideWithChildren( obj : GameObject ){
	if( obj.renderer != null )
		obj.renderer.enabled = false;
	for( var i = 0; i < obj.transform.childCount; i++ )
		hideWithChildren( obj.transform.GetChild(i).gameObject );
}

/**
* This funcion will smoothly rotate an object 90 degrees
*/
function rotateObjectSmooth( obj : GameObject ){

	var origAng = obj.transform.eulerAngles.y;
	var newAng = 0;
	obj.transform.eulerAngles = Vector3( obj.transform.eulerAngles.x, origAng + 90, obj.transform.eulerAngles.z );

}

/**
* This function will add a building block
*/

function canAddBuildingBlock(block : BuildingBlock, botPos : Vector3, rot : int) : boolean
{
	//blocks
//	Debug.Log(block.blockName);
	//gotta get the current botpos
	var newBlockPos = botPos;
	//rotate points
	var myPoints : List.<Vector3> = block.RotatePoints(rot);
	var myClearance : List.<Vector3> = block.RotateClearance(rot);
	var myItems : List.<Vector3> = block.RotateItems(rot);
	
	//test all blocks to place
	for(point in myPoints)
	{		
		newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		
		//if I can't place the block, fail
		if(!newBlockAtPosition(newBlockPos, false))
		{
			Debug.Log(newBlockPos);
			return false;
		}
		
		//if there is currently a block DIRECTLY ABOVE the block I want to place (and not a block above this one in the current list), fail
		var uh_oh = true;
		for(point_2 in myPoints)
		{
			if(point_2.x == point.x && point_2.z == point.z)
			{
				if(point_2.y == point.y + 1.0f)
				{
					Debug.Log("we k");
					uh_oh = false;
					break;
				}
			}
		}
				
		if(uh_oh) //i am the top of column, need to see if there is a spot here or not
		{
			newBlockPos = new Vector3(point.x + botPos.x, point.y + botPos.y, point.z + botPos.z);
			if(WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock)
			{
				Debug.Log(newBlockPos);
				return false;
			}
			for (newMov in WorldManager.movableList)
			{
				if (newMov.obj != null && newMov.obj.transform.position == WorldManager.BlocksToWorld(newBlockPos))
				{
					Debug.Log(newBlockPos);
					return false;
				}
			}
		}
	}

	//make sure extra clearance is empty
	for (point in myClearance)
	{
		newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		//if(!newBlockAtPosition(newBlockPos, false))
		//{
		//	Debug.Log(newBlockPos);
		//	return false;
		//}
		
		//if there is currently a block in any of the extra clearance, fail
		if(WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock)
		{
			Debug.Log(newBlockPos);
			return false;
		}
	}
	
	//make sure object points are empty
	for (point in myItems)
	{
		newBlockPos = new Vector3(point.x + botPos.x, point.y + botPos.y, point.z + botPos.z);
		//if I can't place the block, fail
		if(!newBlockAtPosition(newBlockPos, false))
		{
			Debug.Log(newBlockPos);
			return false;
		}
		
		//if there is currently a block in any of the extra spots, fail
		if(WorldManager.block[newBlockPos.x,newBlockPos.y,newBlockPos.z].hasBlock)
		{
			Debug.Log(newBlockPos);
			return false;
		}
	}
	
	return true;
}

//need to implement undo functionality: list of points, clearance, and items added by each block.
var undoListPoints = new List.<List.<Vector3> >();
var undoListClearance = new List.<List.<Vector3> >();
var undoListItems = new List.<List.<Vector3> >();
var undoListBotPos = new List.<Vector3>();
var undoListRot = new List.<int>();
var undoListToggle = new List.<boolean>();

function undoBuildingBlock()
{
	var botPos = undoListBotPos[undoListBotPos.Count -1]; //most recent
	var myPoints = undoListPoints[undoListPoints.Count -1]; //most recent
	var myClearance = undoListClearance[undoListClearance.Count -1]; //most recent
	var myItems = undoListItems[undoListItems.Count -1]; //most recent
	var rot = undoListRot[undoListRot.Count -1]; //most recent
	
	//also mark any clearance places as "walked on" so they won't be filled
	for (point in myClearance)
	{
		var newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		WorldManager.block[newBlockPos.x, newBlockPos.y, newBlockPos.z].hasBeenWalkedOn = false;
	}
	
	for (point in myItems)
	{
		var blockPos = new Vector3(point.x + botPos.x, point.y + botPos.y, point.z + botPos.z);
		DestroyObject(WorldManager.block[blockPos.x,blockPos.y,blockPos.z].getObject());
		WorldManager.block[blockPos.x,blockPos.y,blockPos.z].setObject(null);
		
		//dirty hack that makes me angry
		for( var mov in WorldManager.movableList )
		if( mov.obj != null && mov.startPos.Equals(blockPos) )
		{
			mov.obj = null;		
		}
	}
	
	WorldManager.CleanupMovList();
	
	for (point in myPoints)
	{
		blockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		WorldManager.block[blockPos.x,blockPos.y,blockPos.z].hasBlock = false;
		WorldManager.block[blockPos.x, blockPos.y, blockPos.z].hasBeenWalkedOn = false;
		DestroyObject(WorldManager.block[blockPos.x,blockPos.y,blockPos.z].getObject());
		WorldManager.CheckBounds(true, true, blockPos.x, blockPos.y, blockPos.z);
	}
	
	if (undoListToggle[undoListToggle.Count -1])
	{
		EditorGUIManager.blockToggle = !EditorGUIManager.blockToggle;
	}
	
	//put bot at botPos and rot
	var newBotPos = botPos;
	var bot = WorldManager.botsList[0];
	
	bot.obj.transform.position = WorldManager.BlocksToWorld(newBotPos);
	bot.obj.GetComponent(Bot).SetAngle(rot % 4);
	
	//pop everything
	undoListPoints.RemoveAt(undoListPoints.Count -1);
	undoListClearance.RemoveAt(undoListClearance.Count -1);
	undoListItems.RemoveAt(undoListItems.Count -1);
	undoListBotPos.RemoveAt(undoListBotPos.Count -1);
	undoListRot.RemoveAt(undoListRot.Count -1);
	undoListToggle.RemoveAt(undoListToggle.Count -1);
	
	//check bounds?!
	WorldManager.ResetBuildBounds();

}

function addBuildingBlock(block : BuildingBlock, botPos : Vector3, rot : int) : int
{
	//first we must TEST everything. If EVERY test passes, then we DO everything. Otherwise, we do NOTHING.
	if(!canAddBuildingBlock(block, botPos, rot))
		return 1;
		
	//blocks
	Debug.Log(block.blockName);
	var bot = WorldManager.botsList[0];
	//gotta get the current botpos
	var newBlockPos = botPos;
	//rotate points
	var myPoints : List.<Vector3> = block.RotatePoints(rot);
	var myVerifiedPoints = new List.<Vector3>();
	var myClearance : List.<Vector3> = block.RotateClearance(rot);
	var myVerifiedClearance = new List.<Vector3>();
	var myItems : List.<Vector3> = block.RotateItems(rot);
	
	//offset is just so that if we place ANY block, we place the robot one space above the finish. 
	//Otherwise we do not move the robot, but might rotate him.
	var offset = 0;
	
	//first, go through the list of coordinates (relative to the robot) and try to add those blocks
	for(point in myPoints)
	{
		offset = 1;
		
		newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		if (!WorldManager.block[newBlockPos.x, newBlockPos.y, newBlockPos.z].hasBlock)
		{
			myVerifiedPoints.Add(point);
		}
		else
		{
			Debug.Log("boopus");
		}
		newBlockAtPosition(newBlockPos, true);
	}
	
	//then mark the top of each of these blocks as "walked on" so no new blocks will be placed there
	for(point in myPoints)
	{
		newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		WorldManager.block[newBlockPos.x, newBlockPos.y, newBlockPos.z].hasBeenWalkedOn = true;
	}
	//also mark any clearance places as "walked on" so they won't be filled
	for (point in myClearance)
	{
		newBlockPos = new Vector3(point.x + botPos.x, -1 + point.y + botPos.y, point.z + botPos.z);
		if(!WorldManager.block[newBlockPos.x, newBlockPos.y, newBlockPos.z].hasBeenWalkedOn)
		{
			WorldManager.block[newBlockPos.x, newBlockPos.y, newBlockPos.z].hasBeenWalkedOn = true;
			myVerifiedClearance.Add(point);
		} 
	}
	
	//then go through the movable list and put em down
	
	var index = 0;
	for(point in myItems)
	{
		var objStr = block.objNames[index];
		var newMov = new MovableType( objStr, Vector3(point.x + botPos.x, point.y + botPos.y, point.z + botPos.z), 0 );
		WorldManager.movableList.Add(newMov);
		
		try{
			newMov.obj = Instantiate(Resources.Load("World/"+WorldManager.skinName+"/"+newMov.name) as GameObject);
		}
		catch(e){
			newMov.obj = Instantiate(Resources.Load("World/Gray/"+newMov.name) as GameObject);
		}
		newMov.obj.transform.position = WorldManager.BlocksToWorld(Vector3(point.x + botPos.x, point.y + botPos.y, point.z + botPos.z));
		WorldManager.block[point.x + botPos.x, point.y + botPos.y, point.z + botPos.z].setObject(newMov.obj);
		//WorldManager.StepOnBlock(point.x, point.y - 1, point.z);
		//WorldManager.UpdatePosition(point.x, point.y, point.z);
		index++;
	}
	
	var myFinish = block.RotateFinish(rot);
	var newBotPos = new Vector3(myFinish.x + botPos.x, myFinish.y + botPos.y, myFinish.z + botPos.z);
	bot.obj.transform.position = WorldManager.BlocksToWorld(newBotPos);
	bot.obj.GetComponent(Bot).SetAngle((rot + block.facing) % 4);
	//then, add any new objects to the field
	
	undoListPoints.Add(myVerifiedPoints);
	undoListClearance.Add(myVerifiedClearance);
	undoListItems.Add(myItems);
	undoListBotPos.Add(botPos);
	undoListRot.Add(rot);
	undoListToggle.Add(block.toggle);
	//finally, move the robot to the new position
	return 0;
}






