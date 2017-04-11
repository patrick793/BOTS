var isCampaignMode = false;
var isStoryMode = false;
var switchLocations = Array();
var keyLocations = Array();
var startLocation = new Point(-1,-1);
var starting : GameObject;
var startRotation = 0;
var skinNumber = 0;

var levelBox : LevelLoaderBox;

var switchPrefab : GameObject;
var keyPrefab : GameObject;
var heavyKeyPrefab : GameObject;
var spacing : float = 0.1;

var myRobot : Robot;
var myProgramGUI : ProgramGUI;

var LevelName : String = "BOTS";
var AuthorName : String = "BOTS";

var size = 10;
var Home = new Vector3(0,0,0);

var LevelArray = new Array(10);
var boxes = new Array();
public var items = new Array();

var DestructionCount = 0;
	var startCount = 0;
	var endCount = 0;
	var keyCount = 0;
var myLevelNames = new Array();
var p1Mesh : Mesh;

//Tutorial
var TutorialInstructionList : TutorialInstructions;

//Wall Paper Stuff

var m : Material;
//materials for rainbow blocks
var red: Material;
var orange : Material;
var yellow : Material;
var green : Material;
var blue : Material;
var purple : Material;

//materials for the space blocks
var space : Material;
var planet1 : Material;
var planet2 : Material;
var star : Material;

//materials for under sea blocks
var water : Material;
var fish : Material;
var turtle :Material;
var jellyfish : Material;

var fall : Material;
var winter : Material;
var spring : Material;
var summer : Material;
private var colorArray : Array;
private var spaceArray : Array;
private var seaArray : Array;
private var seasonsArray: Array;
private var startIndex : int = -1;
var resetLevelFlag = false;
//booleans for wallpaper that has been selected
private var pickCol : int = 1;

var dflt : Material;
var dm : DataManager;

function Awake()
{
	dm = GameObject.Find("DataManager").GetComponent(DataManager);
}

function Start()
{
	myProgramGUI = GameObject.FindGameObjectWithTag("MainCamera").GetComponent("ProgramGUI");
	var m : Material;
	colorArray = [red, orange, yellow, green, blue, purple];
	spaceArray = [space, planet1, planet2, star];
	seaArray = [water, fish, turtle, jellyfish];
	seasonsArray = [fall, winter, spring, summer];

	InitLevelArray();

	ClearLevel();
//	Debug.Log("Currently in play mode: " + dm.gameplayMode);
	if ((dm.gameplayMode == "campaign" || dm.gameplayMode == "play" || dm.gameplayMode == "try")) {
		LoadXML(dm.filenameToLoad);
	} else {
		GetMyLevels();
	}

	CraftLevel();
	myRobot.ResetRobot();
}

function GetMyLevels()
{
	var www : WWW = WWW(dm.location + "scripts/bots/getLevels.php?userid=" + dm.user.userID + "&token=my");
	yield www;

	//Load Games into levelNames

	var levelquery : String[] = www.text.Split(";"[0]);

	for(var newRow in levelquery)
	{
		if (newRow != "")
		{
			var row : String[] = newRow.Split(","[0]);
			myLevelNames.Add(new Array(row[1], row[2]));
		}
	}
}

function GetPositionPoint() : Point
{
    var returnPoint : Point = new Point(3, 6);
    return returnPoint;
}

function IsSubmittable() : boolean
{

	//Debug.Log(endCount+":"+keyCount);
	return(endCount > 0 && (endCount <= keyCount + 1));
}

//Step
function PlaceStepAt(x, y, z)
{
	Debug.Log(x+":"+y+":"+z);

	for (var tmp : int = LevelArray[x][z] + 1; tmp <= y; tmp++) {
    	spots.Add(new Vector3(x, tmp, z));
    	Debug.Log("X:" + x + " Y:" + tmp + " Z:" + z);

  		MakeCube(Home.x + x + (x * spacing), Home.y + tmp + (tmp * spacing), Home.z + z + (z * spacing), x, z, tmp);
  		items.Add(boxes.Pop());
  		recent.renderer.material = m;
	}

  	LevelArray[x][z] = y;
}

function DecendAt(x, z) {
	curr = LevelArray[x][z];
	for (n in spots)
		Debug.Log(n[0]+":"+n[1]+":"+n[2]);

	if (curr > 0) {
		LevelArray[x][z] -= 1;
		Debug.Log(spots.length +":"+items.length);
		for (i = 0; spots.length > i; i++) {
			var dim = spots[i];
				Debug.Log(dim[0]+":"+dim[1]+":"+dim[2]);
			if (dim[0] == x && dim[2] == z && dim[1] == curr) {
				Debug.Log(dim[0]+":"+dim[1]+":"+dim[2]);
				des = items[i];
				items.Remove(des);
				spots.RemoveAt(i);
				GameObject.Destroy(des.gameObject);
			}
		}
	}
}

var recent;
var spots = new Array();

function DestroyAdditions()
{
	//for (i = 0; spots.length != 0; i++) {
	for (i = 0; items.length != 0; i++)
	{
		GameObject.Destroy(items.Pop().gameObject);
		//working below
	}

	for (i = 0; spots.length != 0; i++) {
		spots.Pop();
	}

	for (x = 0; x < LevelArray.length; x++)
	{
		for(y = 0; y < LevelArray[x].length; y++)
		{
			LevelArray[x][y] = 0;
			//Debug.Log(LevelArray[x][y]);
		}
	}

	keyCount = 0;
	endCount = 0;
		//var dim = spots.Pop();

		//LevelArray[dim[0]][dim[2]] = dim[1];
	//}
}

function InitLevelArray()
{
	for(i = 0; i < size; i++)
	{
		LevelArray[i] = new Array(size);
		for(j=0; j<size; j++)
		{
			LevelArray[i][j] = 0;
		}
	}
}

function CraftLevel()
{
	for(i = 0; i < size; i++)
	{
		for(j=0; j<size; j++)
		{
			MakeColumn(i,j);
		}
	}

	SetSkin(pickCol);
}

function MakeColumn(i, j)
{
	for(k=0;k<=LevelArray[i][j];k++)
	{
		MakeCube(Home.x + i + (i * spacing), Home.y+k + (k*spacing), Home.z+j + (j*spacing), i, j, k);
	}
}

function SpawnBox(x : int, z : int)
{
	spots.Add(new Vector3(x, LevelArray[x][z], z));
	MakeItem("PickUp", x, z);
}

function SpawnHeavyBox(x : int, z : int)
{
	spots.Add(new Vector3(x, LevelArray[x][z], z));
	MakeItem("HeavyBox", x, z);
}

function SpawnSwitch(x : int, z : int)
{
	spots.Add(new Vector3(x, LevelArray[x][z], z));
	MakeItem("End", x, z);
}

function SpawnHere(x : int, z : int, f : int)
{
	startRotation = f;
	MakeItem("Start", x, z);
}


function MakeCube(x, y, z, i, j, k)
{
	var newCube = Instantiate(levelBox, new Vector3(x,y,z), Quaternion.identity);
	newCube.level_x = i;
	newCube.level_y = k;
	newCube.level_z = j;
	boxes.Add(newCube);
	recent = newCube;
}

function LoadXML(filename : String)
{
	/*//Debug.Log(filename);
	//var sourceFile = System.IO.File.ReadAllText(Application.dataPath + "/LevelXML/BOTS-Level1.xml");
	var www = WWW(dm.location + 'drupal-6.2/scripts/bots/getLevel.php?file=' + filename);
	yield www;
	//Debug.Log(www.text);
	var sourceFile = www.text;
	*/
	var parser : XMLParser = new XMLParser();
	//Debug.Log("Level " + dm.levelXML);
	if (!dm.levelXML)
	{
		InitLevelArray();
		return;
	}

	var node : XMLNode = parser.Parse(dm.levelXML);
	var author = node["author"];
	var name = node["name"];
	var levelLayout = node["level"][0]["_text"];

	MakeLevelArray(levelLayout);

	var itemList = node["items"][0];
	for (var item in itemList["item"])
	{
		if(item["@rot"]!=null)
		{
			try{
				startRotation = parseInt(item["@rot"]) % 4;
				}catch (FormatException)
				{
					startRotation = 0;
				}
		}
		MakeItem(item["@name"], parseInt(item["@x"]), parseInt(item["@z"]));
	}
	if(node["skin"])
	{
		if(node["skin"][0]["@id"])
		{
			//Debug.Log("Loaded Skin: " + node["skin"][0]["@id"]);
			pickCol = parseInt(node["skin"][0]["@id"]);
		}
	}
	else
	{
		pickCol = 0;
	}

	if(node["TutorialInstructions"])
	{
		var tutorialList = node["TutorialInstructions"][0];
		for (var item in tutorialList["TutorialInstruction"])
		{
			TutorialInstructionList.AddStyle(item["@Style"]);
			TutorialInstructionList.AddTargetWindow(item["@Window"]);

			if(item["@WinID"])
				TutorialInstructionList.AddTargetWindowID(parseInt(item["@WinID"]));

			TutorialInstructionList.AddTargetIndex(parseInt(item["@Target"]));
			TutorialInstructionList.AddButtonIndex(parseInt(item["@ButtonIndex"]));
			TutorialInstructionList.AddInstruction(item["@Instruction"]);
		}
		Debug.Log("Level has tutorial instructions");
	}

	if(node["ObjectLimits"])
	{
		var objectLimits = node["ObjectLimits"][0];
		for (var item in objectLimits["Limits"])
		{
			TutorialInstructionList.SetFunctionLimit(parseInt(item["@FunctionLimit"]));
			TutorialInstructionList.SetForLoopLimit(parseInt(item["@ForLoopLimit"]));
		}
		//Debug.Log("Level has object limits");
	}
	else
	{
		//Debug.Log("Level has standard object limits");
	}
	//note: add "loading complete" here, for use in ProgramGUI
}

function MakeItem(name, x : int, z : int)
{
	//sits on teh ground
	var y : int = LevelArray[x][z];
	var offset : float;
	var newItem;

	switch(name)
	{
		case "Start":
			SetStartLocation(x, y, z);
			if (dm.gameplayMode == "edit") {
				newItem = Instantiate(starting, ToSpaceCoordinates(x,y,z), Quaternion.identity);
				if (myRobot.gameObject != starting.gameObject) {GameObject.Destroy(starting.gameObject);}
				starting = newItem;
				offset = GLOBALS.HEIGHT_FACTOR_ROBOT;
				newItem.transform.localScale.x = myRobot.transform.localScale.x * .75;
				newItem.transform.localScale.y = myRobot.transform.localScale.y * .75;
				newItem.transform.localScale.z = myRobot.transform.localScale.z * .75;
				newItem.transform.position.y += offset;
				newItem.transform.LookAt(newItem.transform.position + FacingToDirection(startRotation));

				if (startIndex != -1)
					items.RemoveAt(startIndex);

				startIndex = items.length;
				startFlag = true;
			}
		break;
		case "End":
			newItem = Instantiate(switchPrefab, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_SWITCH;
			newItem.transform.position.y += offset;
			endCount ++;
		break;
		case "PickUp":
			newItem = Instantiate(keyPrefab, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_KEY;
			newItem.transform.position.y += offset;
			keyCount ++;
		break;
		case "HeavyBox":
			newItem = Instantiate(heavyKeyPrefab, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_KEY + .2;
			newItem.transform.position.y += offset;
			keyCount ++;
		break;
		default:
			Debug.Log("error: invalid item type");
		return;
	}

	if (newItem) {
		newItem.tag = "Level Item";
		if(newItem.transform.name.Contains("Cute"))
		{
			(newItem.transform.Find("polySurface1").gameObject.AddComponent(MeshCollider) as MeshCollider).sharedMesh = p1Mesh;
			newItem.transform.Find("group1").gameObject.transform.Find("group2").gameObject.transform.Find("group4").gameObject.transform.Find("pCube2").gameObject.AddComponent(BoxCollider);
		}
		if(newItem.transform.name.Contains("PickUp"))
			newItem.AddComponent(SphereCollider);
		if(newItem.transform.name.Contains("HeavyBox"))
			newItem.AddComponent(SphereCollider);
		if(newItem.transform.name.Contains("End"))
			newItem.AddComponent(BoxCollider);

		if(!newItem.GetComponent("LevelItemData"))
			newItem.AddComponent("LevelItemData");

		var info = newItem.GetComponent("LevelItemData");
		info.offset = offset;
		info.x = x;

			info.y = y;

		info.z = z;
		info.init_x = x;
		info.init_y= y;
		info.init_z = z;
		info.itemName = name;
		items.Add(newItem);
	}

	//Debug.Log("Building a " + name + " at " + x + ", " + y + ".");
}

function FacingToDirection(direction : int) : Vector3
{
	var temp : Point;
	switch (direction)
	{
		case 0:
			temp = new Point(0,1);
			break;
		case 1:
			temp = new Point(1,0);
			break;
		case 2:
			temp = new Point(0,-1);
			break;
		case 3:
			temp = new Point(-1,0);
			break;
		default:
			Debug.Log("error: somehow facing is wrong");
			temp = new Point(0,1);
			break;
	}
	return new Vector3(temp.X, 0, temp.Y);
}

function MakeLevelArray(levelString : String)
{

	//Debug.Log(levelString);
	var LevelTime = levelString.Split(","[0]);
	size = Mathf.Floor(Mathf.Sqrt(LevelTime.length));
	LevelArray = new Array(size);
	for(i = 0; i < size; i++)
	{
		LevelArray[i] = new Array(size);
		for(j=0; j<size; j++)
		{
			LevelArray[i][j] = parseInt(LevelTime[j + (size * i)]);
			//if(LevelArray[i][j] != 0)
				//Debug.Log(LevelArray[i][j]);
		}
	}
}

//get real coordinates from a vector in board coordinates
function ToSpaceCoordinates(item : Vector3) : Vector3
{
	return ToSpaceCoordinates(item.x, item.y, item.z);
}

//get real coordinates from a vector in board coordinates (note: the point is (x, z) in board coordinates; the height is in the level array
function ToSpaceCoordinates(item : Point, bool : boolean) : Vector3
{
	//Debug.Log("To Space " + item.X + " " + item.Y);
	return ToSpaceCoordinates(item.X, item.Y, bool, item);
}

function ToSpaceCoordinates(i, k, considerObjects : boolean, targetSpot : Point) : Vector3
{
	var target = targetSpot;
	var objects = GetObjectsAt(target);
	//Debug.Log("Target:" + target);
	if(!resetLevelFlag)
	{
		i = parseInt(i);
		k = parseInt(k);

		if(considerObjects)
		{
			var counter = 0;
			for (var item in objects)
			{
				if (item.GetComponent("LevelItemData").itemName == "HeavyBox")
				{
					counter++;
				}
			}
			j = LevelArray[i][k] + counter;
			//Debug.Log("J + counter:" + j);
		}
		else
		{
			j = LevelArray[i][k];
			//Debug.Log("J - counter:" + j);
		}
	}
	else
	{
		i = parseInt(i);
		k = parseInt(k);
		j = LevelArray[i][k];
		resetLevelFlag = false;
	}
	return new Vector3(Home.x + i + (i * spacing), Home.y+j + (j*spacing), Home.z+k + (k*spacing));
	//return new Vector3(1,1,1);
}

function ToSpaceCoordinates(i, j, k) : Vector3
{
	i = parseInt(i);
	j = parseInt(j);
	k = parseInt(k);
	return new Vector3(Home.x + i + (i * spacing), Home.y+j + (j*spacing), Home.z+k + (k*spacing));
}

function SetStartLocation(x,y,z)
{
	startLocation = new Point(x,z);
}

//gets the location of the robot's spawn point using real coordinates rather than board coordinates
function GetStartLocationSpace() : Vector3
{
	return ToSpaceCoordinates(startLocation.X, LevelArray[startLocation.X][startLocation.Y] + GLOBALS.HEIGHT_FACTOR_ROBOT, startLocation.Y);
}

//function InsideLevelBoundaries(p2: Point) : boolean
//{
//	return !(p2.X > size-1 || p2.Y > size-1 || p2.X < 0 || p2.Y < 0);
//}

//finds if a robot can move between two points on the map. Also finds if an object can be DROPPED at that point on the map.
function IsLegalMove(p1 : Point, p2 : Point) : boolean
{
	//must stay inside level boundaries.
	if (!InBounds(p2))
	{
		return false;
	}
	//two points must be level
	/*if (!(LevelArray[p1.X][p1.Y] == LevelArray[p2.X][p2.Y]))
	{
		Debug.Log("From:" + LevelArray[p1.X][p1.Y] + " To:" + LevelArray[p2.X][p2.Y]);
		return false;
	}
	//see if you collide with any non-steppable items
	for (var item in GetObjectsAt(p2))
	{
		Debug.Log("Stuff in the way");
		if (item.GetComponent("LevelItemData").itemName == "PickUp"
		|| item.GetComponent("LevelItemData").itemName == "HeavyBox")
		{
			return false;
		}
	}	*/
	//the conditions have been cleared
	return true;
}

//finds if a robot can move between two points on the map. Also finds if an object can be DROPPED at that point on the map.
function IsLegalJump(p1 : Point, p2 : Point) : boolean
{
	//must stay inside level boundaries.
	if (!InBounds(p2))
		return false;
	//see if you collide with any non-steppable items
	for (var item in GetObjectsAt(p2))
	{
		//Debug.Log("i'm looking");
		var info = item.GetComponent("LevelItemData");
		if (info.itemName == "HeavyBox")
			return true;
		if (info.itemName == "PickUp")
			return false;
	}



	for (var item in GetObjectsAt(p1))
	{
		//Debug.Log("i'm looking");
		info = item.GetComponent("LevelItemData");
		if (info.itemName == "HeavyBox")
			return true;
	}

	//two points must be offset by one level OR second point is lower
	if ((LevelArray[p1.X][p1.Y] + 1 != LevelArray[p2.X][p2.Y]) && (LevelArray[p1.X][p1.Y] + 1 <= LevelArray[p2.X][p2.Y]))
		return false;
	//Redundant atm
	/*for (var item in GetObjectsAt(p2))
	{
		//Debug.Log("i'm looking");
		var info = item.GetComponent("LevelItemData");
		if (info.itemName == "HeavyBox")
			return true;
	}*/
	//the conditions have been cleared
	return true;
}

//finds if a robot can move between two points on the map. Also finds if an object can be DROPPED at that point on the map.
function IsLegalPickUp(p1 : Point, p2 : Point) : boolean
{
	//must stay inside level boundaries.
	if (!InBounds(p2))
	{
		return false;
	}

	//two points must be level
	//if (LevelArray[p1.X][p1.Y] < LevelArray[p2.X][p2.Y])
	//{
	//	return false;
	//}

	//for (var item in GetObjectsAt(p2))
	//{
		//Debug.Log("i'm looking");
		//info = item.GetComponent("LevelItemData");
		//if (info.itemName == "PickUp")
			//return false;
	//}

	return true;
}

//??? I feel like we will need some more work over here
function GetHeight(p2 : Point) : int
{

	var target = p2;
	var objects = GetObjectsAt(target);
	//Debug.Log("Target:" + target);

	if(InBounds(target))
	{
		if(!resetLevelFlag)
		{
			var heavyCounter = 0;
			var pickUpCounter = 0;

			for (var item in objects)
			{
				if (item.GetComponent("LevelItemData").itemName == "HeavyBox")
				{
					heavyCounter++;
					//item.GetComponent("LevelItemData").y +=1;
				}
				else if (item.GetComponent("LevelItemData").itemName == "PickUp")
				{
					//item.GetComponent("LevelItemData").y +=1;
					pickUpCounter++;
				}
			}
			//return LevelArray[p2.X][p2.Y] + heavyCounter;
			return LevelArray[p2.X][p2.Y];
			//Debug.Log("J + counter:" + j);
		}
		else
		{
			return LevelArray[p2.X][p2.Y];
			resetLevelFlag = false;
		}
	}
	else
	myRobot.ErrorOut("This position is out of bounds!");
}

function GetObjectsAt(p2 : Point) : Array
{
	var ObjectList = Array();
	var any : boolean = false;
	//must be inside level boundaries
	if (!InBounds(p2))
		return null;

	//see if anything is there
	for (var item in items)
	{
		var info = item.GetComponent("LevelItemData");
		//Debug.Log(info.x + ", " + info.y + " contains a " + info.itemName);
		if (info && !info.held && info.x == p2.X && info.z == p2.Y)
		{
			ObjectList.Add(item);
			any = true;
		}
	}
	if (any)
		return ObjectList;
	else
		return null;
}

function ClearLevel() {
	for(z = 0; z<10; z++)
	{
		for(i = 0; i<10; i++)
		{
			for(j=0; j<10; j++)
			{
				LowerColumn(i,j);
			}
		}
	}

	//Remove level Items
	/*for (item in items)
	{
		//GameObject.Destroy(item);
	}*/

	DestroyAdditions();

	items = new Array();

	keyCount = 0;
	endCount = 0;
	startFlag = false;
	endFlag = false;
	pickUpFlag = false;
	heavyBoxFlag = false;
}

function LevelAsArray() : Array {
	return LevelArray;
}

function LowerColumn(i,j)
{
	k = LevelArray[i][j];
	LevelArray[i][j] = LevelArray[i][j] - 1;


	if (LevelArray[i][j] < 0)
	{
		LevelArray[i][j] = 0;
		return;
	}

	var levelItems = GameObject.FindGameObjectsWithTag("Level Item");
	Debug.Log("lower");
	for(item in levelItems)
	{
	Debug.Log(item);
		if(item.transform.position.x == (Home.x + i + (i * spacing)) && item.transform.position.z == (Home.z+j + (j*spacing)) )
		{
			var offset = item.GetComponent("LevelItemData").offset;
			item.transform.position.y = (Home.y+k-1+offset + ((k-1+offset)*spacing));
		}
	}

	for (val = 0; val < boxes.length; val++)
	{
		myBox = boxes[val].GetComponent(LevelLoaderBox);
		if (myBox.level_x == i && myBox.level_z == j && myBox.level_y >= k)
		{
			Destroy(boxes[val].gameObject);
			boxes.RemoveAt(val);
			//currentPos--;
		}
	}

}

function GetDefault() : Material {
	return dflt;
}

function ResetLevel()
{
	resetLevelFlag = true;
	//removes all items and flattens the level if we're in the level editor
	//if(GLOBALS.EDIT)
		//DestroyAdditions();

	for (var item in items)
	{
		//Debug.Log("i'm looking");
		item.transform.parent = null;
		item.transform.position.x  = 1;
  		item.transform.position.z  = 1;

		var info = item.GetComponent("LevelItemData");
		info.ResetPosition();

		item.transform.position = ToSpaceCoordinates(info.GetPositionPoint(), false);
		item.transform.position.y += info.offset;
		info.SetHeld(false);
	}
	myRobot.ResetRobot();
}

function CheckCompletion() : boolean
{
	if (myRobot.running)
		return false;

	//Debug.Log("checking items");
	for (var item in items)
	{
		var info = item.GetComponent("LevelItemData");
//		Debug.Log(info.itemName);
		//CHECK IF EACH END PLACE IS SATISFIED
		if (info.itemName == "End")
		{
			var satisfied = false;
			if (Point.isEqual(myRobot.boardPosition, info.GetPositionPoint()))
			{
//				Debug.Log("satisfied!");
				satisfied = true;
			}
			else
			{
				for (var other_item in items)
				{
					var info2 = other_item.GetComponent("LevelItemData");
//					Debug.Log(typeof(info2.GetPositionPoint()));
//					Debug.Log(typeof(info.GetPositionPoint()));
//					Debug.Log("aaaa" + Point.Add(info2.GetPositionPoint(), info.GetPositionPoint()).toString());
					if (info2 && info2.itemName == "PickUp" || info2 && info2.itemName == "HeavyBox")
					{
						if(Point.isEqual(info2.GetPositionPoint(), info.GetPositionPoint()))
						{
							satisfied = true;
//							Debug.Log("Satisfied!");
							break;
						}
					}
				}
			}
			if (!satisfied)
				return false;
		}
	}

	Debug.Log("hunky dory!");
	return true;
}

function SetSkin(x : int)
{
	//x is the PickCol from when the level was submitted
	//var m : Material;

	switch(x)
	{
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			m = colorArray[x - 1];
			Debug.Log("I set the skin to color number " + x );
			changeBoxMat(m);
			break;
		case 7:
			for(var zz = 0; zz <boxes.length; zz++)
			{
				var bx = boxes[zz];
				m = colorByLevel(bx.level_x, bx.level_z, bx.level_y);
				//Debug.Log(bx.level_x + ", " + bx.level_z);
				bx.renderer.material = m;
			}
			break;
		case 8:
			for(var u =0; u < boxes.length; u++)
			{
				var box = boxes[u];
				m = horizontalStripes(box.level_z);
				box.renderer.material = m;
			}
			break;
		case 9:
		case 10:
			for(var w =0; w < boxes.length; w++)
			{
				m = randomColor(x);
				changeSingleBoxMat(m);
			}
			break;
		case 11:
		case 12:
		case 13:
		case 14:
			m = seasonsArray[x - 11];//fall
			changeBoxMat(m);
			break;
		default:
			m = dflt;
			changeBoxMat(m);
			break;
	}
}

function GetBoxes() : Array {
	return boxes;
}

function colorByLevel(i, j, k):Material
{
	switch(k)
	{
		case 1:
			m = rainbow(i,j);
			break;
		case 2:
			m = rainbow(i+1,j);
			break;
		case 3:
			m = rainbow(i+2,j);
			break;
		case 4:
			m = rainbow(i+3,j);
			break;
		case 5:
			m = rainbow(i+4,j);
			break;
		default:
			m= rainbow(i+5,j);
			break;
	}
	return m;
}

/*slct should be the number that corresponds with the wallpaper */
function randomColor(slct : int) : Material
{
	var randomnumber : float;
	randomnumber = Random.value;
	//Debug.Log("Random #: " + randomnumber);
	if(randomnumber > .95)
	{
		switch(slct)
		{
			case 9:
				m = spaceArray[1]; //star;
				break;
			case 10:
				m = seaArray[1]; //fish
				break;
			default:
				break;
		}
	}
	else if(randomnumber < .05)
	{
		switch(slct)
		{
			case 9:
				m = spaceArray[2]; //planet1;
				break;
			case 10:
				m= seaArray[2]; //turtle
				break;
			default:
				break;
		}
	}
	else if( randomnumber > .45  && randomnumber < .50)
	{
		switch(slct)
		{
			case 9:
				m = spaceArray[3]; //planet2
				break;
			case 10:
				m = seaArray[3]; //jellyfish
				break;
			default:
				break;
		}
	}
	else
	{
		switch(slct)
		{
			case 9:
				m = spaceArray[0];
				break;
			case 10:
				m = seaArray[0];
				break;
			default:
				break;
		}
	}
	return m;

}

function rainbow(i, j) : Material
{
	if(i >= 6)
	{
		i =i-6;
	}
	if(j >= 6)
	{
		j = j -6;
	}
	//Debug.Log("i: " + i);
	//Debug.Log("j: " + j);

	switch(i)
	{
		case 0:
		case 6:
			switch(j)
			{
				case 0:
					m = colorArray[1];
					break;
				case 1:
					m = colorArray[2];
					break;
				case 2:
					m = colorArray[3];
					break;
				case 3:
					m = colorArray[4];
					break;
				case 4:
					m = colorArray[5];
					break;
				default:
					m = colorArray[0];
					break;
			}
			break;
		case 1:
		case 7:
			switch(j)
			{
				case 0:
					m = colorArray[2];
					break;
				case 1:
					m = colorArray[3];
					break;
				case 2:
					m = colorArray[4];
					break;
				case 3:
					m = colorArray[5];
					break;
				case 4:
					m = colorArray[0];
					break;
				default:
					m = colorArray[1];
					break;
			}
			break;
		case 2:
		case 8:
			switch(j)
			{
				case 0:
					m = colorArray[3];
					break;
				case 1:
					m = colorArray[4];
					break;
				case 2:
					m = colorArray[5];
					break;
				case 3:
					m = colorArray[0];
					break;
				case 4:
					m = colorArray[1];
					break;
				default:
					m = colorArray[2];
					break;
			}
			break;
		case 3:
		case 9:
			switch(j)
			{
				case 0:
					m = colorArray[4];
					break;
				case 1:
					m = colorArray[5];
					break;
				case 2:
					m = colorArray[0];
					break;
				case 3:
					m = colorArray[1];
					break;
				case 4:
					m = colorArray[2];
					break;
				default:
					m = colorArray[3];
					break;
			}
			break;
		case 4:
			switch(j)
			{
				case 0:
					m = colorArray[5];
					break;
				case 1:
					m = colorArray[0];
					break;
				case 2:
					m = colorArray[1];
					break;
				case 3:
					m = colorArray[2];
					break;
				case 4:
					m = colorArray[3];
					break;
				default:
					m = colorArray[4];
					break;
			}
			break;
		default:
			switch(j)
			{
				case 0:
					m = colorArray[0];
					break;
				case 1:
					m = colorArray[1];
					break;
				case 2:
					m = colorArray[2];
					break;
				case 3:
					m = colorArray[3];
					break;
				case 4:
					m = colorArray[4];
					break;
				default:
					m = colorArray[5];
					break;
			}
			break;
	}
	return m;
}


function horizontalStripes(j : int): Material
{
	switch(j)
	{
		case 0:
		case 6:
			m = colorArray[4];
			break;
		case 1:
		case 7:
			m = colorArray[3];
			break;
		case 2:
		case 8:
			m = colorArray[1];
			break;
		case 3:
		case 9:
			m = colorArray[5];
			break;
		case 4:
			m = colorArray[0];
			break;
		default:
			m = colorArray[2];
			break;
	}
	return m;
}
/*Changes the material of all the boxes in play to a single color :(*/
function changeBoxMat(mat)
{
	for(i = 0; i < boxes.length; i++)
	{
		var newCube : LevelLoaderBox;
		newCube = boxes[0];
		boxes.RemoveAt(0);
		newCube.renderer.material = mat;
		boxes.Add(newCube);
	}
}

function changeSingleBoxMat(mat)
{
	var newCube : LevelLoaderBox;
	newCube = boxes[0];
	boxes.RemoveAt(0);
	newCube.renderer.material = mat;
	//Debug.Log(newCube);
	boxes.Add(newCube);
}

function InBounds(point : Point)
{
	return (point.X >= 0 && point.X < 10 && point.Y >=0 && point.Y < 10);
}
