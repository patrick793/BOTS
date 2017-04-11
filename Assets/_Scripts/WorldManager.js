import System.Collections.Generic;
import System.Xml;

//World max size variables
static var worldMaxX : int;
static var worldMaxY : int;
static var worldMaxZ : int;

//Build min size variables
static var buildMinX : int;
static var buildMinY : int;
static var buildMinZ : int;

static var buildMaxX : int;
static var buildMaxY : int;
static var buildMaxZ : int;

//Array that handles the world building
static var block : BlockType[,,];
static var movableList : List.<MovableType>;
static var botsList : List.<BotType>;

//information variables
static var levelName : String = "";
static var levelDescription : String = "";
static var author : String = "";
static var skinName : String = "";

var levelToLoad : TextAsset;
var levelToLoadString : String;

static var dm : DataManager;

//Class to remember specific block information
class BlockType{

	//Mutable variables
	public var hasCollision : boolean = false;
	public var hasBlock : boolean = false;
	public var canBeWalkedOn : boolean = false;
	
	//used for edit mode only
	public var hasBeenWalkedOn : boolean = false;
	
	//Object variable, getter, and setter
	private var blockObject : GameObject = null;
	function getObject(){
		return blockObject;
	}
	function setObject( obj : GameObject ){
		blockObject = obj;
	}
}
class MovableType{

	//Object and starting position
	public var obj : GameObject = null;
	public var name : String;
	public var startPos : Vector3;
	public var startAng : int;
	
	//Constructor
	function MovableType( objName : String, pos : Vector3, ang : int ){
		name = objName;
		startPos = pos;
		startAng = ang;
	}

}
class BotType{
	
	//Variables
	public var obj : GameObject = null;
	public var startPos : Vector3;
	public var startAng : int;
	
	//Constructor
	function BotType( pos : Vector3, ang : int ){
		startPos = pos;
		startAng = ang;
	}
	
}

function Awake () {

	
	dm = GameObject.Find("DataManager").GetComponent(DataManager);

	//Initialize location variables
	var x : int;
	var y : int;
	var z : int;
	
	//Bot variables
	skinName = "Gray";
	botSpeed = 0.5;

	//Initiate the world stuff
	worldMaxX = 16;
	worldMaxY = 16;
	worldMaxZ = 16;
	
	buildMinX = 0;
	buildMinY = 0;
	buildMinZ = 0;
	
	buildMaxX = 0;
	buildMaxY = 0;
	buildMaxZ = 0;
	
	//if I'm editing, everything needs to be larger
	if(dm.gameplayMode.Contains("Edit"))
	{
		worldMaxX = 21;
		worldMaxY = 18;
		worldMaxZ = 21;
		
		buildMinX = 10;
		buildMinY = 8;
		buildMinZ = 10;
		
		buildMaxX = 10;
		buildMaxY = 8;
		buildMaxZ = 10;
	}
	
	var block;
	InitBlockArray();
	movableList = new List.<MovableType>();
	botsList = new List.<BotType>();

	//Build the world
	if(dm.levelXML && dm.levelXML != "")
	{
		Debug.Log("Loaded Full Level");
		Debug.Log(GLOBALS.SOURCEFILE);
		LoadFromText(dm.levelXML, false);
	}
	else
	{
		Debug.Log("Loaded Blank Level");
		LoadFromText(levelToLoad.text, true);
	}
	BuildWorld();
	ResetWorld();
	//Path drawer
	if( PathDrawer.paths != null )
		PathDrawer.getInstance().drawPaths();

}

function Update()
{
	//CleanupMovList();
}

static function InitBlockArray()
{
        block = new BlockType[worldMaxX,worldMaxY,worldMaxZ];
		Debug.Log("I want to build a world that is " + worldMaxX + " " + worldMaxY + " " + worldMaxZ + " "); 
		for( x = 0; x < worldMaxX; x++ )
			for( y = 0; y < worldMaxY; y++ )
				for( z = 0; z < worldMaxZ; z++ )
					block[x,y,z] = new BlockType();
}

//Functions for converting world coordinates and block coordinates
static function BlocksToWorld( oldPos : Vector3 ) : Vector3{
	var newPos : Vector3;
	newPos.x = oldPos.x - (worldMaxX>>1) + 0.5;
	newPos.y = oldPos.y - (worldMaxY>>1) + 0.5;
	newPos.z = oldPos.z - (worldMaxZ>>1) + 0.5;
	return newPos;
}
static function WorldToBlocks( oldPos : Vector3 ) : Vector3{
	var newPos : Vector3;
	newPos.x = Mathf.FloorToInt(oldPos.x + (worldMaxX>>1));
	newPos.y = Mathf.FloorToInt(oldPos.y + (worldMaxY>>1));
	newPos.z = Mathf.FloorToInt(oldPos.z + (worldMaxZ>>1));
	return newPos;
}

static function CleanupMovList()
{
	for (var i=0; i < movableList.Count; i++)
	{
		var obj : MovableType = movableList[i];
		if( obj == null || obj.obj == null ){
			Debug.Log("removed an object at " + i );
			movableList.RemoveAt(i);
			i--;
		}
	}
}

//A function that builds the game world based on the
//data in the block array
static function BuildWorld () {

	//Initialize location variables
	var i : int;
	var x : int;
	var y : int;
	var z : int;
	
	//Build the world
	for( x = 0; x < worldMaxX; x++ )
		for( y = 0; y < worldMaxY; y++ )
			for( z = 0; z < worldMaxZ; z++ )
			{
				//DestroyObject(block[x,y,z].getObject());
				if( block[x,y,z].hasBlock )
				{
					PlaceBlock(x,y,z);
				}
				else
				{
					if( block[x,y,z].getObject() != null )
					{
						DestroyObject(block[x,y,z].getObject());
						//AARON: nullify the object at that coordinate
					}
					block[x,y,z].hasCollision = false;
					block[x,y,z].canBeWalkedOn = false;
				}
			}
	
	

}

//A function to update a block position based on what's there
static function UpdatePosition( x : int, y : int, z : int ){

	try{
		if( !block[x,y,z].hasBlock ){
			block[x,y,z].hasCollision = false; //TODO: IS THIS CHECK NEEDED?
			block[x,y,z].canBeWalkedOn = false;
			for( var obj in  movableList ){
				if( obj.obj != null ){
					
					var objX : int = WorldToBlocks(obj.obj.transform.position).x;
					var objY : int = WorldToBlocks(obj.obj.transform.position).y;
					var objZ : int = WorldToBlocks(obj.obj.transform.position).z;
				
					if( x == objX && y == objY && z == objZ ){
						var mov = obj.obj.GetComponent(MovableObject);
						
						if( mov != null ){
							if( mov.hasCollision ){
								//if (dm.gameplayMode.Contains("Edit") == false) //can move thru blocks in edit mode?
									block[x,y,z].hasCollision = true;
							}
							if( mov.canBeWalkedOn )
								block[x,y,z].canBeWalkedOn = true;
						}
					}
				
				
				}
			}
		}
	}catch(e){}
	

}

static function ResetWorld(){

	if(dm.gameplayMode.Contains("Edit"))
	{
		
	}
	
	if(dm.gameplayMode == "progEdit")
	{		
		buildMinX = 10;
		buildMinY = 8;
		buildMinZ = 10;
		
		buildMaxX = 10;
		buildMaxY = 8;
		buildMaxZ = 10;
		
		BuildWorld();
		for( obj in movableList ){
		if( obj.obj != null ){
			DestroyObject(obj.obj);
			obj.obj = null;
			}
			}
		movableList = new List.<MovableType>();
		
		
	}
	
	for( x = 0; x < worldMaxX; x++ )
		for( y = 0; y < worldMaxY; y++ )
			for( z = 0; z < worldMaxZ; z++ )
				if(block[x,y,z] && !block[x,y,z].hasBlock ){
					block[x,y,z].hasCollision = false;
					block[x,y,z].canBeWalkedOn = false;
					block[x,y,z].hasBeenWalkedOn = false;
				}

	//Add movable objects
	for( obj in movableList ){
		if( obj.obj != null ){
			var movPos = WorldToBlocks(obj.obj.transform.position);
			//obj.obj.transform.position = Vector3(-1000,-1000,-1000);
			
			DestroyObject(obj.obj);
			obj.obj = null;
			
			UpdatePosition(movPos.x,movPos.y,movPos.z);
		}
		try{
			obj.obj = Instantiate(Resources.Load("World/"+skinName+"/"+obj.name) as GameObject);
		}catch(e){
			obj.obj = Instantiate(Resources.Load("World/Gray/"+obj.name) as GameObject);
		}
		obj.obj.transform.parent = null;
		obj.obj.transform.position = BlocksToWorld( obj.startPos );
		obj.obj.transform.eulerAngles.y = obj.startAng*90;
		UpdatePosition(Mathf.FloorToInt(obj.startPos.x),Mathf.FloorToInt(obj.startPos.y),Mathf.FloorToInt(obj.startPos.z));
	}
	
	//Add bots
	var tempProgram;
	var botNum : int = 0;
	for( bot in botsList ){
		if( botNum < 6 ){
			if( bot.obj != null){
				var pos = WorldToBlocks(bot.obj.transform.position);
				UpdatePosition( pos.x, pos.y, pos.z );
				UpdatePosition( pos.x, pos.y+1, pos.z );
				tempProgram = bot.obj.GetComponent(Bot).program;
				
				DestroyObject(bot.obj);
				bot.obj = null;
			}
			Debug.Log("try and load bot " + (botNum + 1));
			bot.obj = Instantiate(Resources.Load( "Bots/Bot" + (botNum+1).ToString() ) as GameObject);
			if( tempProgram != null )
				bot.obj.GetComponent(Bot).program = tempProgram;
			if( !Application.loadedLevelName.Equals( "_GameWorld" ) )
				bot.obj.GetComponent(Bot).enabled = false;
			bot.obj.transform.parent = null;
			bot.obj.transform.position = BlocksToWorld( bot.startPos );
			
			if(dm.gameplayMode == "progEdit")
			{
				Debug.Log("I have published a block underneath all my robots!");
				PlaceBlock(bot.startPos.x,bot.startPos.y-1,bot.startPos.z);
				block[bot.startPos.x,bot.startPos.y-1,bot.startPos.z].hasBeenWalkedOn = true;
			}
			
			bot.obj.transform.eulerAngles.y = bot.startAng*90;
			tempProgram = null;
			try{
				var hat : GameObject = Instantiate(Resources.Load("World/"+skinName+"/BotHat")as GameObject);
				hat.transform.parent = bot.obj.GetComponent(Bot).limbHead.transform;
				hat.transform.localPosition = Vector3.zero;
				hat.transform.localEulerAngles = Vector3.zero;
				BotHatMaterial.changeAllMaterials( hat, bot.obj.GetComponent(Bot) );
			}catch(e){
			}
		}
		botNum += 1;
	}

}



//Function for getting the height boost of a block position
static function GetHeightBoost( blockPos : Vector3 ) : float{

	var heightBoost : float = 0 ;
	for( obj in movableList )
		if( WorldToBlocks(obj.obj.transform.position) == blockPos ){
			var mov = obj.obj.GetComponent(MovableObject);
			if( mov.heightBoost > heightBoost )
				heightBoost = mov.heightBoost;
		}
			
	return heightBoost;
}

//
static function CheckBounds(edit : boolean, update : boolean, x : int, y : int, z : int) : boolean
{
	if(edit)
	{
		//check edit bounds
		if(x > (buildMinX + 9) || y > (buildMinY + 7) || z > (buildMinZ + 9))//TODO: MAGIC NUMBERS
		{
			Debug.Log("out of build bounds");
			return false;
		}
		//check other edit bounds
		if(x < (buildMaxX - 9) || y < (buildMaxY - 7) || z < (buildMaxZ - 9))//TODO: MAGIC NUMBERS
		{
			Debug.Log("out of build bounds");
			return false;
		}
		
		if(!update)
			return true;
				
		//update edit bounds
			if(x < buildMinX) buildMinX = x;
			if(y < buildMinY) buildMinY = y;
			if(z < buildMinZ) buildMinZ = z;
			
			if(x > buildMaxX) buildMaxX = x;
			if(y > buildMaxY) buildMaxY = y;
			if(z > buildMaxZ) buildMaxZ = z;

		
		//Debug.Log("New Mins: " + buildMinX + ", " + buildMinY + ", "+ buildMinZ + ", ");
	}
	else
	{
		//check edit bounds
		if(x > (worldMaxX) || y > (worldMaxY) || z > (worldMaxZ))
		{
			Debug.Log("out of build bounds");
			return false;
		}
		//check other edit bounds
		if(x < 0 || y < 0 || z < 0)//TODO: MAGIC NUMBERS
		{
			Debug.Log("out of build bounds");
			return false;
		}
	}
	return true;
}

static function ResetBuildBounds()
{
		//worldMaxX = 21;
		//worldMaxY = 18;
		//worldMaxZ = 21;
		var newMinX = 100;
		var newMinY = 100;
		var newMinZ = 100;
		var newMaxX = 0;
		var newMaxY = 0;
		var newMaxZ = 0;
		
		for(var i = 0; i < worldMaxX; i++)
		{
			for(var j = 0; j < worldMaxY; j++)
			{
				for(var k = 0; k < worldMaxZ; k++)
				{
					if(block[i,j,k].hasBlock)
					{
						if(i<newMinX) newMinX = i;
						if(j<newMinY) newMinY = j;
						if(k<newMinZ) newMinZ = k;
						
						if(i>newMaxX) newMaxX = i;
						if(j>newMaxY) newMaxY = j;
						if(k>newMaxZ) newMazZ = k;
					}
				}
			}
		}
		
		buildMinX = newMinX;
		buildMinY = newMinY;
		buildMinZ = newMinZ;
		
		buildMaxX = newMaxX;
		buildMaxY = newMaxY;
		buildMaxZ = newMaxZ;
}

//function for placing a block in edit mode
static function PlaceBlock(vector : Vector3) : boolean
{
	return PlaceBlock(vector.x, vector.y, vector.z);
}

static function PlaceBlock(x :int, y: int, z: int) : boolean
{
	Debug.Log("Place Block");
	//Place a block at the given position if possible
	//Do not place a block if out of bounds
	//Do not place a block if it would cross the robot's previous path
	if(CheckBounds(dm.gameplayMode.Contains("Edit"), true, x, y, z) == false)
		return false;
	
	//return true if the block was placed, false if not
	if( block[x,y,z].getObject() == null && (y == 0 || !block[x,y-1,z].hasBeenWalkedOn))
	{
		try{
			block[x,y,z].setObject(Instantiate(Resources.Load( "World/"+skinName+"/Block" ) as GameObject));
		}catch(e){
			block[x,y,z].setObject(Instantiate(Resources.Load( "World/Gray/Block" ) as GameObject));
		}

	}
	else if (block[x,y,z].getObject() != null)
	{
		var obj = block[x,y,z].getObject();
		if(obj.name.Contains("Ghost"))
		{
			Debug.Log("I won't place a block there bFecause there is an object.");
			return false;
		}
		else{
			//keep going?
		}
	}
	else{
		Debug.Log("I won't place a block there because it has been walked on.");
		return false;
	}
		//other errors will catch this. maybe issues with clarity?
		
	block[x,y,z].getObject().transform.position = BlocksToWorld(Vector3(x,y,z));
	block[x,y,z].hasCollision = true;
	block[x,y,z].canBeWalkedOn = true;
		
	return true;
}

//function for stepping on a block in edit mode
static function StepOnBlock(x : int, y: int, z : int)
{
	block[x,y,z].hasBeenWalkedOn = true;
	//could use this function to draw particles for the bot's path
}

//function for placing a box in edit mode
static function PlaceBox(x : int, y: int, z : int, ghost : boolean) : boolean
{
	if(block[x,y-2,z].hasBeenWalkedOn)
		return false;
		//need to return a specific error here
	
	Debug.Log("Place Box");
	if(!PlaceBlock(x, y-1, z))
	{
		//if(block[x,y,z].getObject() != null)
			Debug.Log("Did This Happen?");
			return false;
			
			//need a specific error for this
	}
	
	if (!ghost)
	{
		Debug.Log("Adding a non-ghost block");
		var newObj = new MovableType("Box", Vector3(x,y,z), 0);	
		movableList.Add(newObj);
		try{
				newObj.obj = Instantiate(Resources.Load("World/"+skinName+"/"+newObj.name) as GameObject);
			}
		catch(e){
				newObj.obj = Instantiate(Resources.Load("World/Gray/"+newObj.name) as GameObject);
			}
		newObj.obj.transform.position = BlocksToWorld(Vector3(x,y,z));
		StepOnBlock(x,y-1,z);
	
	}
	else{
	
		//set up a spooky ghost box
		var ghostObj = new MovableType("GhostBox", Vector3(x,y,z), 0); //Weird thing
		var ghostBox : GameObject = Instantiate(Resources.Load("World/Gray/Box"));
		ghostBox.renderer.material.shader = Shader.Find("Transparent/Bumped Specular");
		ghostBox.renderer.material.color.a = 0.3f;
		ghostBox.transform.position = BlocksToWorld(Vector3(x,y,z));;
		ghostBox.transform.localScale -= Vector3(0.05,0.05,0.05);
		ghostBox.name = "GhostBox";
		ghostObj.obj = ghostBox;
		var mov = ghostBox.GetComponent("MovableObject");
		mov.hasCollision = false;
		mov.canBeLifted = false;
		mov.heightBoost = 0.0;
		movableList.Add(ghostObj);
		//WorldManager.block[ WorldManager.WorldToBlocks(clickedObjectPos).x,
		//WorldManager.WorldToBlocks(clickedObjectPos).y,
		//WorldManager.WorldToBlocks(clickedObjectPos).z].setObject(ghostBox);

	}

	UpdatePosition(x,y,z);
	return true;
}

//function for placing a switch in edit mode
static function PlaceSwitch(x: int, y: int, z: int) : boolean
{
	Debug.Log("Place Switch");
	if(!PlaceBlock(x, y-1, z))
	{
		if(block[x,y-2,z].hasBeenWalkedOn || block[x,y,z].hasCollision)
			return false;
		//need a specific error for this
	}
	
	var newObj = new MovableType("Switch", Vector3(x,y,z), 0);
	
	movableList.Add(newObj);
	try{
			newObj.obj = Instantiate(Resources.Load("World/"+skinName+"/"+newObj.name) as GameObject);
		}
	catch(e){
			newObj.obj = Instantiate(Resources.Load("World/Gray/"+newObj.name) as GameObject);
		}
	newObj.obj.transform.position = BlocksToWorld(Vector3(x,y,z));
	StepOnBlock(x,y-1,z);
	UpdatePosition(x,y,z);
	return true;
}


//A function that loads an XML file and builds a world based on iReRt (this was static and I don't know why?)
static function LoadFromText ( worldData : String, local : boolean ) {

	//Temporary variables
	var x : int;
	var y : int;
	var z : int;
	var angle : int;
	var str : String;
	var build;
	var itemList;
	var mov;
	var bot;

	//Set up nodes and parsing information
	var node : XMLNode;
	if (local)
		node = dm.parser.Parse( worldData );
	else
	    node = dm.GetLevelNode();
	
	
	
	//New verion of bots
	if( node["version2"] ){
	
		//Load the blocks
		if( node["colls"] ){
			try{
				var collList = node["colls"][0];
				for( var coll in collList["coll"] ){
					x = parseInt(coll["@x"]);
					z = parseInt(coll["@z"]);
					str = coll["@build"];
					build = str.Split(","[0]);
					//Debug.Log("I wanna build a column that is " + build.Length);
					for( y=0; y<build.Length; y++ ){
						if( parseInt(build[y]) == 1 )
							block[x,y,z].hasBlock = true;
					}
				}
			} catch(error) {
				Debug.LogError("Invalid block data during world load");
			}
		}
		WorldCamera.centerX = 0;
		WorldCamera.centerY = 0;
		WorldCamera.centerZ = 0;
		
		//Load the items
		if( node["items"] ){
			try{
			
				itemList = node["items"][0];
				
				//Load the movables
				for( mov in itemList["movable"] ){
					x = parseInt(mov["@x"]);
					y = parseInt(mov["@y"]);
					z = parseInt(mov["@z"]);
					angle = parseInt(mov["@angle"]);
					str = mov["@type"];
					movableList.Add(new MovableType( str, Vector3(x,y,z), angle ));
				}
				
				//Load the bots
				for( bot in itemList["bot"] ){
					x = parseInt(bot["@x"]);
					y = parseInt(bot["@y"]);
					z = parseInt(bot["@z"]);
					angle = parseInt(bot["@angle"]);
					botsList.Add(new BotType( Vector3(x,y,z), angle ));
				}
			
			}catch(error){
				Debug.LogError("Invalid movable or bot data during world load");
			}
		}
		
		//Set the information
		if( node["author"] )
			author = node["author"][0]["_text"];
		if( node["name"] )
			levelName = node["name"][0]["_text"];
		if( node["description"] )
			levelDescription = node["description"][0]["_text"];
		if( node["skin"] )
			skinName = node["skin"][0]["_text"];
		
	
	//Old version of bots compatability
	}else{
		Debug.Log("Entering OLD_BOTS_XML mode");
		
		//raise the Y cap and re-init block array
		worldMaxX = 10;
		worldMaxY = 16;
		worldMaxZ = 10;
		InitBlockArray();
		
		//Load the level info
		if( node["author"] )
			author = node["author"][0]["_text"];
		if( node["name"] )
			levelName = node["name"][0]["_text"];
	
		//Load the blocks
		var levelSize : int = 0;
		if( node["level"] ){
			try{
				build = node["level"][0]["_text"].Split(","[0]);
				levelSize = Mathf.Sqrt( build.Length );
				var iterator = 0;
				for( z=0; z<levelSize; z++ )
					for( x=0; x<levelSize; x++ ){
						for( y = 0; y<=parseInt(build[iterator]); y++ ){
							block[z,y,x].hasBlock = true;//DREW EDIT: I am transposing this to see if it corrects something.
						}
						iterator++;
					}
			}catch(error){
				Debug.Log(error);
				Debug.LogError("Invalid block data during world load");
			}
		}
		WorldCamera.centerX = (levelSize>>1) - (worldMaxX>>1);
		WorldCamera.centerY = -3;
		WorldCamera.centerZ = (levelSize>>1) - (worldMaxZ>>1);
			
		//Load the Items
		if( node["items"] ){
			try{
				itemList = node["items"][0];
				for( mov in itemList["item"] ){
				
					//position
					x = parseInt(mov["@x"]);
					z = parseInt(mov["@z"]);
					y = 0;
					while( block[x,y,z] && block[x,y,z].hasBlock )
						y++;
						
					//type
					switch( mov["@name"] ){	
						case "Start":
							Debug.Log("Start");
							try {rot = parseInt(mov["@rot"]);} //capture the bot's rotation if it exists
							catch(e){rot = 0;}
							botsList.Add(new BotType( Vector3(x,y,z), rot));
						break;
						case "End":	
							Debug.Log("End");
							movableList.Add(new MovableType( "Switch", Vector3(x,y,z), 0 ));
						break;
						case "PickUp":
							Debug.Log("PickUp");
							movableList.Add(new MovableType( "Box", Vector3(x,y,z), 0 ));
						break;
						case "HeavyBox":
							Debug.Log("HeavyBox");
							movableList.Add(new MovableType( "Heavy Box", Vector3(x,y,z), 0 ));
						break;
					}
					
				}
			}catch(error){
				Debug.Log(error);
				Debug.Log(x + "," + y + "," + z);
				Debug.LogError("Invalid movable or bot data during world load");
			}
		}
		
	
	}


}

//assumes 0,0,0 is bottom corner
static function worldToString() : String{
return worldToString(0,0,0);
}

//uses offsets from editor
static function worldToString(withOffsets : boolean) : String{
if(!withOffsets)
	return worldToString();
else
	return worldToString(buildMinX, buildMinY, buildMinZ);
}

//takes in the x,y,z value of the bottom corner (origin)
static function worldToString(xOffset : int, yOffset: int, zOffset : int) : String{

	//Introduction
	var s : String = "";
	s += "<author>" + dm.user.username + "</author>\n";
	s += "<name>" + levelName + "</name>\n";
	s += "<description>" + "Made With Program Editor" + "</description>\n";
	s += "<version2></version2>\n\n";
	
	//Blocks
	s += "<colls>\n";
	for( z = zOffset; z < zOffset + 16 && z < worldMaxZ; z++ ) //magic number for WorldMaxZ
		for( x = xOffset; x < xOffset + 16 && x < worldMaxX; x++ ){ //magic number for WorldMaxX
		
			var addLine : boolean = false;
			var columnString : String = "";
			for( y = yOffset; y < yOffset + 8 && y < worldMaxY; y++ ){ //magic number for WorldMaxY
				if( y > yOffset )
					columnString += ",";
				var thing_here = block[x,y,z].getObject();
				if(thing_here && thing_here.name.Contains("Block") ){
					columnString += "1";
					addLine = true;
				}else{
					columnString += "0";
				}
			}
			if( addLine )
				s += "\t<coll x=\"" + (x - xOffset) + "\" z=\"" + (z - zOffset) + "\" build=\"" + columnString + "\" />\n";
		
		
		}
	s += "</colls>\n\n";
	
	
	//Items
	s += "<items>\n";
	for( obj in movableList ){
		if (obj.name.Contains("Ghost")) continue;
		s += "\t<movable type=\""  + obj.name + "\"";
		s += " x=\"" + (Mathf.FloorToInt(obj.startPos.x) - xOffset) + "\"";
		s += " y=\"" + (Mathf.FloorToInt(obj.startPos.y) - yOffset) + "\"";
		s += " z=\"" + (Mathf.FloorToInt(obj.startPos.z) - zOffset) + "\"";
		s += " angle=\"" + obj.startAng + "\"";
		s += " />\n";
	}
	for( bot in botsList ){
		s += "\t<bot";
		s += " x=\"" + (Mathf.FloorToInt(bot.startPos.x) - xOffset) + "\"";
		s += " y=\"" + (Mathf.FloorToInt(bot.startPos.y) - yOffset) + "\"";
		s += " z=\"" + (Mathf.FloorToInt(bot.startPos.z) - zOffset) + "\"";
		s += " angle=\"" + bot.startAng + "\"";
		s += " />\n";
	}
	s += "</items>\n";


	return s;
}








