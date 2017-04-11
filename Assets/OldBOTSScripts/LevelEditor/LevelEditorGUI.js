var myLevelNames = new Array();

var target : Transform;
var distance = 15.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

private var x = 0.0;
private var y = 0.0;
private var scrollPosition : Vector2;

static var cam1 : boolean = false;
var showWindow : boolean = false;
var showItemWindow : boolean = false;
var showUploadWindow : boolean = false;
var showNameSameWindow : boolean = false;
var showNotSubmittableWindow : boolean = false;
var showWallpaper : boolean = false;

var levelIsSubmittable : boolean = false;

var submit : boolean = false;
var goBack : boolean = false;
var resetLevel : boolean = false;

var toggleBool : Array[];
var gridSize :int;

var rowToggle : boolean;
var colToggle : boolean;
var patToggle : boolean;

//CopyModel
var dragModel: GameObject;
var endLocation: GameObject;
var startLocation: GameObject;
//var BlueSwitch : GameObject;
//var RedSwitch : GameObject;
var pickUp: GameObject;
var heavyBox: GameObject;
var heightFactor: float;

var startFlag : boolean;
var endFlag : boolean;
var BlueSwitchFlag : boolean;
//var RedSwitchFlag : boolean;
//var pickUpFlag : boolean;
var heavyBoxFlag : boolean;

var hit_x : int;
var hit_z: int;
var hit_y : float;

//Move&Rotate
var p1Mesh : Mesh;
var isRotating : boolean = false;
var previousMousePos : Vector2;
var newFacing = 0;
var clickTime : double;

//InitLevelEditor
var cube_prefab : LevelLoaderBox;
var my_camera : Camera;

var column_selected : boolean;
var selected_x : int;
var current_y : int;
var selected_z : int;

var init_y : int;

var LevelArray = new Array(10);

var Home : Vector3;
var spacing = .1;

Home = new Vector3(3,0,3);

var boxes = new Array();

var clicked : boolean = false;

var levelName : String = "My New Level";
var levelDescription : String = "A level made by me!";
var loading = false;
var puzzleID : String;
var startRotation :int = 0;

private var count : int = 0;

var Bot :Texture;
var End :Texture;
var Heavy :Texture;
var crate :Texture;
//var choice :Texture;
//var Producer :Texture;

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

//booleans for wallpaper that has been selected
private var pickCol : int = 0;

var dflt : Material;
var dm : DataManager;

//var scrollPosition : Vector2 = Vector2.zero;
var tutorialNode : XMLNode;

//@script AddComponentMenu("Camera-Control/Editor GUI")
function Awake()
{
	dm = GameObject.Find("DataManager").GetComponent(DataManager);

	colorArray = [red, orange, yellow, green, blue, purple];
	spaceArray = [space, planet1, planet2, star];
	seaArray = [water, fish, turtle, jellyfish];
	seasonsArray = [fall, winter, spring, summer];

	Debug.Log("creating...");
	column_selected = false;
	selected_z = -1;
	selected_x = -1;

}

function Start () {
	gridSize = 3;
	InitSelect();

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;


	//CopyModel
	startFlag = false;
	endFlag = false;
	//BlueSwitchFlag = false;
	//RedSwitchFlag = false;
	pickUpFlag = false;
	heavyBoxFlag = false;

	for(i = 0; i < 10; i++)
	{
		LevelArray[i] = new Array(10);
		for(j=0; j<10; j++)
		{
			LevelArray[i][j] = 0;
		}
	}

	if(dm.gameplayMode == "edit")
	{
		yield LoadXML(dm.filenameToLoad);
		/*puzzleID = GLOBALS.CURRENT_LEVEL_ID+"";
		puzzleID = puzzleID.Replace('0', ' ');
		puzzleID = puzzleID.Trim() +".xml";
		Debug.Log(puzzleID);*/

		var parsedID = parseInt(dm.levelToLoad+"");
		puzzleID = parsedID+"";
		puzzleID = puzzleID.Trim() +".xml";
		Debug.Log(puzzleID);
	}
	else
		GetMyLevels();

	CraftLevel();
	SetSkin(pickCol);

}

function LoadXML(filename : String)
{
	//var sourceFile = System.IO.File.ReadAllText(Application.dataPath + "/LevelXML/BOTS-Level1.xml");
	var www = WWW(dm.location + 'scripts/bots/getLevel.php?file=' + filename);
	Debug.Log(filename);
	yield www;
	Debug.Log(www.text);
	var sourceFile = www.text;
	var parser : XMLParser = new XMLParser();
	if (!sourceFile)
	{
		return;
	}

	var node : XMLNode = parser.Parse(sourceFile);
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
			Debug.Log("Loaded Skin: " + node["skin"][0]["@id"]);
			pickCol = parseInt(node["skin"][0]["@id"]);
		}
	}
	else
	{
		pickCol = 0;
	}

}

function MakeItem(name, x : int, z : int)
{
	//sits on the ground
	var y : int = LevelArray[x][z];
	var offset : float;
	var newItem ;

	switch(name)
	{
		case "Start":
			newItem = Instantiate(startLocation, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_ROBOT;
			newItem.transform.position.y += offset;
			newItem.transform.LookAt(newItem.transform.position + FacingToDirection(startRotation));
			startFlag = true;
			break;
		case "End":
			newItem = Instantiate(endLocation, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_SWITCH;
			newItem.transform.position.y += offset;
			break;
		case "PickUp":
			newItem = Instantiate(pickUp, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_KEY;
			newItem.transform.position.y += offset;
			break;
		case "HeavyBox":
			newItem = Instantiate(heavyBox, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_KEY;
			newItem.transform.position.y += offset;
			break;
		/*case "BlueSwitch":
			newItem = Instantiate(BlueSwitch, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_SWITCH;
			newItem.transform.position.y += offset;
			break;
		case "RedSwitch":
			newItem = Instantiate(RedSwitch, ToSpaceCoordinates(x,y,z), Quaternion.identity);
			offset = GLOBALS.HEIGHT_FACTOR_SWITCH;
			newItem.transform.position.y += offset;
			break;*/
		default:
			Debug.Log("error: invalid item type");
			return;
	}

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

//	if (name == "Start")
//		return;
	if(!newItem.GetComponent("LevelItemData"))
		newItem.AddComponent("LevelItemData");

	var info = newItem.GetComponent("LevelItemData");
	info.offset = offset;
	info.x = x;
	info.y= y;
	info.z = z;
	info.init_x = x;
	info.init_y= y;
	info.init_z = z;
	info.itemName = name;

}

function ToSpaceCoordinates(i, j, k) : Vector3
{
	i = parseInt(i);
	j = parseInt(j);
	k = parseInt(k);
	return new Vector3(Home.x + i + (i * spacing), Home.y+j + (j*spacing), Home.z+k + (k*spacing));
}

function MakeLevelArray(levelString : String)
{

	Debug.Log(levelString);
	var LevelTime = levelString.Split(","[0]);
	size = Mathf.Floor(Mathf.Sqrt(LevelTime.length));
	Debug.Log(size);
	LevelArray = new Array(size);
	for(i = 0; i < size; i++)
	{
		LevelArray[i] = new Array(size);
		for(j=0; j<size; j++)
		{
			LevelArray[i][j] = parseInt(LevelTime[j + (size * i)]);
		}
	}
}


function InitSelect()
{
	rowToggle = false;
 	colToggle = false;
 	patToggle = true;

	toggleBool = new Array[gridSize];

	for(i = 0; i < gridSize; i++)
	{
		toggleBool[i] = new Array[gridSize];
		for(j=0; j<gridSize; j++)
		{
			toggleBool[i][j] = false;
		}
	}
	toggleBool[1][1] = true;
}

var vScrollbarValue : float = 0.0;
function OnGUI()
{
	if(loading)
		return;

	var button_text = "Camera Mode";
 	var select_text = "Select...";
 	var item_text = "Items";
 	var wallpaper_text = "Wallpapers";

	if (cam1)
		button_text = "Edit Mode";
	if (showWindow)
		select_text = "Hide";
	if(showItemWindow)
		item_text = "Hide";
	if(showWallpaper)
		wallpaper_text = "Hide";

	if(GUI.Button(Rect(10,0,110,20),button_text))
    {
        SetCam1Toggle(cam1);
    }

    if(cam1)
    {
    	if(GUI.Button(Rect(120,0,20,20),"+"))
        {
         distance -= 1;
        }
        if(GUI.Button(Rect(140,0,20,20),"-"))
        {
         distance += 1;
        }

        showItemWindow = false;
        showWindow = false;

    }

	if(GUI.Button(Rect(Screen.width-360,Screen.height-20,110,20),"Save/Submit"))
	{
		levelIsSubmittable = IsSubmittable();
		showUploadWindow = !showUploadWindow;
	}
    goBack = GUI.Button(Rect(Screen.width-240,Screen.height-20,110,20),"Quit");
	resetLevel = GUI.Button(Rect(Screen.width-120,Screen.height-20,110,20),"Clear Level");


    if(GUI.Button(Rect(Screen.width-140,0,130,20),select_text))
    {
    	if(select_text.Equals("Select..."))
    	{
        	showWindow = true;
        	cam1 = false;
        }
        else
        	showWindow = false;
    }

    if(GUI.Button(Rect(160, 0, 110, 20), wallpaper_text))
    {
    	if(wallpaper_text.Equals("Wallpapers"))
    	{
        	showWallpaper = true;
        }
        else
        	showWallpaper = false;
    }

    if(GUI.Button(Rect(10,Screen.height-20,110,20),item_text))
    {
    	if(item_text.Equals("Items"))
    	{
        	showItemWindow = true;
        	cam1 = false;
        }
        else
        	showItemWindow = false;
    }

    if (showWindow)
    {
    	GUI.Window (0, Rect(Screen.width-140,20,130,200), ShowSelect, "Selection Tool");
    }

	//CopyModel
	if(showItemWindow)
	{
    	GUI.Window (1, Rect(10,Screen.height-370,140,344), ShowItem, "Level Items");
	}

	if(showUploadWindow)
	{
		GUI.Window(9002, Rect(Screen.width/2-57, Screen.height-195, 298, 174), ShowUpload, "Upload Level");
		GUI.FocusWindow(9002);
	}

	if(showNameSameWindow)
	{
		NameSameWindow();
	}
	if(showNotSubmittableWindow)
	{
		NotSubmittableWindow();
	}

	if(showWallpaper)
	{
		GUI.Window(2, Rect(160, 20,200,375), ShowWallpaperList, "Select your wallpaper");

	}

	if(resetLevel)
	{
		startFlag = false;
		endFlag = false;
		pickUpFlag = false;
		heavyBoxFlag = false;
		//RedSwitchFlag = false;
		//BlueSwitchFlag = false;
	}
}
var notOpen : GUIStyle;
var open : GUIStyle;
function ShowWallpaperList()
{
	if(GUI.Button (Rect (10, 25, 175, 22), "Red", open))
	{
		pickCol = 1;
		m = colorArray[0];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 45, 175, 22), "Orange", open))
	{
		pickCol = 2;
		m = colorArray[1];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 65, 175, 22), "Yellow", open))
	{
		pickCol = 3;
		m = colorArray[2];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 85, 175, 22), "Green", open))
	{
		pickCol = 4;
		m = colorArray[3];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 105, 175, 22), "Blue", open))
	{
		pickCol = 5;
		m = colorArray[4];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 125, 175, 22), "Purple", open))
	{
		pickCol = 6;
		m = colorArray[5];
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 145, 175, 22), "Rainbow", open))
	{
		pickCol = 7;
		var zz : int;
		for(zz = 0; zz <boxes.length; zz++)
		{
			var bx = boxes[zz];
			m = colorByLevel(bx.level_x, bx.level_z, bx.level_y);
			//Debug.Log(bx.level_x + ", " + bx.level_z);
			bx.renderer.material = m;
		}
	}
	else if(GUI.Button (Rect (10, 165, 175, 22), "Rainbow Stripes", open))
	{
		pickCol = 8;
		for(u =0; u < boxes.length; u++)
		{
			var box = boxes[u];
			m = horizontalStripes(box.level_z);
			box.renderer.material = m;
		}
	}
	else if(GUI.Button (Rect (10, 185, 175, 22), "Space", open))
	{
		pickCol = 9;
		var t :int;
		for(t =0; t < boxes.length; t++)
		{
			//Debug.Log(m);
			m = randomColor(9); //space
			changeSingleBoxMat(m);
		}
	}
	else if(GUI.Button (Rect (10, 205, 175, 22), "Under the Sea", open))
	{
		pickCol = 10;
		var w :int;
		for(w =0; w < boxes.length; w++)
		{
			m = randomColor(10); //water
			changeSingleBoxMat(m);
		}
	}
	else if(GUI.Button (Rect (10, 225, 175, 22),"Fall", open))
	{
		pickCol = 11;
		m = seasonsArray[0];//fall
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 245, 175, 22), "Winter", open))
	{
		pickCol = 12;
		m = seasonsArray[1]; //winter
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 265, 175, 22), "Spring", open))
	{
		pickCol = 13;
		m =seasonsArray[2]; //spring
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 285, 175, 22), "Summer", open))
	{
		pickCol = 14;
		m = seasonsArray[3]; //summer
		changeBoxMat(m);
	}
	else if(GUI.Button (Rect (10, 305, 175, 22), "Minecraft", notOpen))
	{
		pickCol = 15;
	}
	else if(GUI.Button (Rect (10, 325, 175, 22), "City", notOpen))
	{
		pickCol = 16;
	}
	else if(GUI.Button(Rect (10, 345, 175, 22), "Default", open))
	{
		pickCol = 0;
		m = dflt;
		changeBoxMat(m);
	}
}

function SetSkin(x : int)
{
	//x is the PickCol from when the level was submitted

	switch(x)
	{
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			m = colorArray[x - 1];
			changeBoxMat(m);
			break;
		case 7:
			for(var zz = 0; zz <boxes.length; zz++)
			{
				var bx = boxes[zz];
				m = colorByLevel(bx.level_x, bx.level_z, bx.level_y);
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

function Update () {

	var ray: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	clicked = Input.GetMouseButton(0);

    if (target && cam1 && clicked)
    {
        x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;

 		y = ClampAngle(y, yMinLimit, yMaxLimit);

        var rotation = Quaternion.Euler(y, x, 0);
        var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;

        transform.rotation = rotation;
        transform.position = position;
    }


	//CopyModel
	if(dragModel)
	{
		if(clicked)
		{
			var intersection : float;
			var xz : Plane = new Plane(Vector3.up, new Vector3(0.0f, 1.0f, 0.0f));
			if(xz.Raycast(ray, intersection))
			{
				var loc : Vector3 = ray.GetPoint(intersection);
				loc = SnappedToGrid(loc);
				dragModel.transform.position = loc;
			}
		}
		else
		{
			PlaceModel(dragModel);
			GameObject.Destroy(dragModel);
		}
	}

	if(submit)
	{
		UploadLevel();
	}
	else if(goBack)
	{
		cam1 = false;
		dm.gameplayMode = "play";
		pickCol = 0;
		Application.LoadLevel("Start");
	}
	else if(resetLevel)
	{
		current_y = -1;
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
		var levelItems = GameObject.FindGameObjectsWithTag("Level Item");
		for (item in levelItems)
		{
			GameObject.Destroy(item);
		}
		cam1 = false;
	}
	//InitLevelEditor
	if (cam1 || dragModel)
	{
		return;
	}
	else if (clicked && !column_selected)
	{
		init_y = Input.mousePosition.y;
		var hit: RaycastHit;
		var object_struck;

		if (Physics.Raycast(ray, hit))
		{
			if(hit.transform.name.Contains("level"))
			{
				column_selected = true;
				object_struck = hit.collider.gameObject;
				selected_x = object_struck.GetComponent(LevelLoaderBox).level_x;
				selected_z = object_struck.GetComponent(LevelLoaderBox).level_z;

				Debug.Log(selected_x + ", " + selected_z);
			}
		}
	}
	else if (column_selected)
	{
		if(!clicked)
		{
			column_selected = false;
			selected_x = -1;
			selected_z = -1;
			return;
		}

		var difference = init_y - Input.mousePosition.y;
		if (Mathf.Abs(difference) > 10)
		{
			init_y = Input.mousePosition.y;
			if (difference < 0)
			{
				RaiseSelected(selected_x, selected_z);
			}
			else if (difference > 0)
			{
				LowerSelected(selected_x, selected_z);
			}
		}
	}

		//Move&Rotate Model

	var itemRay = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hitbot : RaycastHit;
	var items_struck = GameObject.FindGameObjectsWithTag("Level Item");
	var item_struck : GameObject;

	if(clicked && isRotating)
	{
		isRotating = false;
	}
	else if (clicked)
	{
		if(Physics.Raycast(itemRay, hitbot))
		{

			if(hitbot.transform.name.Contains("polySurface1") && startFlag)
			{
				clickTime = Time.time;
			}
			else if(hitbot.transform.name.Contains("pCube2") && startFlag)
			{
				heightFactor = 1;
				if(GameObject.Find("CuteBotFBX(Clone)"))
				{
					dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, startLocation);
					dragModel.transform.rotation = GameObject.Find("CuteBotFBX(Clone)").transform.rotation;
					GameObject.Destroy(GameObject.Find("CuteBotFBX(Clone)"));
				}
				else
				{
					dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, startLocation);
					dragModel.transform.rotation = GameObject.Find("CuteBotFBX(Clone)(Clone)").transform.rotation;
					GameObject.Destroy(GameObject.Find("CuteBotFBX(Clone)(Clone)"));
				}
			}
			else if(hitbot.transform.name.Contains("PickUp") && !dragModel)
			{
				heightFactor = .85;
				dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, pickUp);
				GameObject.Destroy(hitbot.collider.gameObject);
			}
			else if(hitbot.transform.name.Contains("HeavyBox") && !dragModel)
			{
				heightFactor = 1;
				dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, heavyBox);
				GameObject.Destroy(hitbot.collider.gameObject);
			}
			else if(hitbot.transform.name.Contains("End") && !dragModel)
			{
				heightFactor = .49;
				dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, endLocation);
				GameObject.Destroy(hitbot.collider.gameObject);
			}
			/*else if(hitbot.transform.name.Contains("RedSwitch") && !dragModel)
			{
				heightFactor = .49;
				dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, RedSwitch);
				GameObject.Destroy(hitbot.collider.gameObject);
			}
			else if(hitbot.transform.name.Contains("BlueSwitch") && !dragModel)
			{
				heightFactor = .49;
				dragModel = CreateModel(hitbot.transform.position.x, hitbot.transform.position.z, BlueSwitch);
				GameObject.Destroy(hitbot.collider.gameObject);
			}*/
		}
	}
	else if(!clicked && Time.time - clickTime < .08)
	{
		isRotating = true;
	}

	//Rotating
	if(isRotating && Input.mousePosition.x - previousMousePos.x > 100)
	{
		for (thing in items_struck)
		{
			if (thing.transform.name.Contains("Cute"))
			{
				item_struck = thing;
				newFacing += 5;
				newFacing = newFacing % 4;
				item_struck.transform.LookAt(item_struck.transform.position + FacingToDirection(newFacing));
				previousMousePos = Input.mousePosition;
			}
		}
	}
	else if(isRotating && previousMousePos.x - Input.mousePosition.x > 100)
	{
		for (thing in items_struck)
		{
			if (thing.transform.name.Contains("Cute"))
			{
				item_struck = thing;
				newFacing += 3;
				newFacing = newFacing % 4;
				item_struck.transform.LookAt(item_struck.transform.position + FacingToDirection(newFacing));
				previousMousePos = Input.mousePosition;
			}
		}
	}
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

function UploadLevel()
{
	// Create a Web Form
		var URL;


		if(dm.gameplayMode == "edit")		{
			Debug.Log("Updating....");
			URL = dm.location + "scripts/bots/updateLevel.php";
		}else {
			URL = dm.location + "scripts/bots/saveLevel.php";
		}
		var form = new WWWForm();

		var levelname = levelName;
		var description = levelDescription;

		var itemString = "<items> \n";
		var li = GameObject.FindGameObjectsWithTag("Level Item");
		for (item in li)
		{
			var name =  item.GetComponent("LevelItemData").itemName;
			itemString += "<item name=\"" + name + "\" x=\"" + Mathf.Round((item.transform.position.x - 3.0f ) / 1.1f) + "\" z=\"" + Mathf.Round((item.transform.position.z - 3.0f) / 1.1f);
			if (name == "Start")
				itemString += "\" rot =\"" + newFacing % 4;
			itemString += "\" /> \n";
		}
		itemString += "</items> \n";
		Debug.Log(itemString);

		var skinString = "<skin id=\"" + pickCol + "\" /> \n";

		form.AddField("user", dm.user.username);
		form.AddField("userid", dm.user.userID);
		if(dm.gameplayMode == "edit")		{
			Debug.Log("Still Updating..."+ dm.levelToLoad);
			form.AddField("puzzleid", dm.levelToLoad);
    		form.AddField("filename", puzzleID);
		}
		form.AddField("puzzle", levelname);
		form.AddField("file","<author>"+dm.user.username+"</author>\n<name>"+levelname+"</name>\n<level>" + LevelArray.ToString() + "</level> \n" + itemString + skinString);
		form.AddField("description",description);
		if (dm.user.version == 1)
			form.AddField("published",1);
		else
			form.AddField("published",0);

		form.AddField("version", dm.user.version);

		loading = true;

		//Working
		//Debug.Log("User:" + GLOBALS.USERNAME);//Returns "admi"n
		//Debug.Log("UserID:" + GLOBALS.USER_ID);//Returns "1".
		//Debug.Log("Puzzle ID:" + GLOBALS.CURRENT_LEVEL_ID);//Causes an error, says the value is null.
		//Debug.Log("FileName:" + puzzleID);// Seems to return an empty string, does not throw an error.
		//Debug.Log("Puzzle:" + levelname);//Returns "My New Level".
		//Debug.Log("File:" + "<author>"+GLOBALS.USERNAME+"</author>\n<name>"+levelname+"</name>\n<level>" + LevelArray.ToString() + "</level> \n" + itemString + skinString);//Not sure how to debut this field.
		//Debug.Log("Description:" + description);//Returns "A level made by me!".
		//Debug.Log("Published:");//Not sure how to debug this field.
		//Debug.Log("Version:" + GLOBALS.VERSION_NUM);//Returns "0".
		//Not sure if all fields have been debugged, are any missing?

		// Upload to a php script
		var w = WWW(URL, form);
		yield w;

		loading = false;
		if (w.error != null)
		{
			levelname=w.error;
			Debug.Log(w.error);
			showUploadWindow = false;
		}
		else
		{
			Debug.Log("Finished Uploading Level");
			showUploadWindow = false;
			Application.LoadLevel("Start");
		}

		dm.RefreshLevels();
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


static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}

static function SetCam1Toggle(toggle : boolean)
{
	if(toggle)
	 cam1 = false;
	else
	 cam1 = true;

}

//var DragButton : DraggableButton;
function ShowSelect()
{
	GUI.skin.toggle.contentOffset.x = 10;
	GUI.skin.toggle.clipping = TextClipping.Overflow;
	GUI.skin.toggle.alignment = TextAnchor.MiddleLeft;

	rowToggle = GUI.Toggle(Rect (10, 25, 22, 22), rowToggle, "Entire Row");
	if(rowToggle)
	{
		colToggle = false;
		patToggle = false;
	}

	colToggle = GUI.Toggle(Rect (10, 50, 22, 22), colToggle, "Entire Column");
	if(colToggle)
	{
		rowToggle = false;
		patToggle = false;
	}

	patToggle = GUI.Toggle(Rect (10, 75, 22, 22), patToggle, "Pattern");
	if(patToggle)
	{
		colToggle = false;
		rowToggle = false;
	}

	for(var i = 0; i<gridSize; i++)
	{
		for(var j = 0; j < gridSize; j++)
		{
			toggleBool[i][j]= GUI.Toggle (Rect (75-20*i, 140-20*j, 20, 20), toggleBool[i][j], "");
		}
	}

	if(GUI.Button(Rect(10, 170, 110, 20), "reset"))
	{
		InitSelect();
	}
}

function ShowItem()
{


	scrollPosition = GUI.BeginScrollView (Rect (0,0,130, Screen.height),
	scrollPosition, Rect (0, 0, 130 , 1.3* Screen.height ), false, true);

	if(!startFlag)
	{

		if (dragModel)
		{
		GUI.Button(new Rect(22,25, 65, 65), "Robot");

		}
		else if (GUI.RepeatButton(Rect(22,25, 65, 65), "Robot") && clicked)
		{
			heightFactor = 1;
			dragModel = CreateModel(1.0f, 30.0f, startLocation);
		}
	}

	if (dragModel)
	{
		GUI.Button(Rect(22,100, 65, 65), "Goal");
	}
	else if (GUI.RepeatButton(Rect(22,100, 65, 65), "Goal") && clicked)
	{
		heightFactor = .49;
		dragModel = CreateModel(1.0f, 30.0f, endLocation);
	}

	if (dragModel)
	{
		GUI.Button(Rect(22,175, 65, 65), "Crate");
	}
	else if (GUI.RepeatButton(Rect(22,175, 65, 65), "Crate") && clicked)
	{
		heightFactor = .85;
		dragModel = CreateModel(1.0f, 30.0f, pickUp);
	}
	if (dragModel)
	{
		GUI.Button(Rect(22,250, 65, 65), "Block");
	}
	else if (GUI.RepeatButton(Rect(22,250, 65, 65), "Block") && clicked)
	{
		heightFactor = 1;
		dragModel = CreateModel(1.0f, 30.0f, heavyBox);
	}
	if (dragModel)
	{
		GUI.Button(Rect(22,325, 65, 65), "Choice");
	}
	//Not finish
	/*else if (GUI.RepeatButton(Rect(22,325, 65, 65), "Choice") && clicked)
	{
		heightFactor = .49;
		dragModel = CreateModel(1.0f, 30.0f, RedSwitch);
	}
	if (dragModel)
	{
		GUI.Button(Rect(22,400, 65, 65), "Producer");
	}
	else if (GUI.RepeatButton(Rect(22,400, 65, 65), "Producer") && clicked)
	{
		heightFactor = .49;
		dragModel = CreateModel(1.0f, 30.0f, BlueSwitch);
	}*/
	GUI.EndScrollView();
}

function ShowUpload()
{
	if (levelIsSubmittable)
	{
		TextSanitizer.AlphaNumeric();
		GUI.Label(Rect (10, 30, 100, 25), "Level Name:");
		levelName =  GUI.TextField (Rect (110, 30, 175, 25), levelName, 25);
		GUI.Label(Rect (10, 65, 100, 25), "Level Details:");
		levelDescription =  GUI.TextField (Rect (110, 65, 175, 25),  levelDescription, 25);

		if (GUI.Button(new Rect(35, 105, 100, 50), "Submit!"))
		{
			if(levelName == "")
			{
				showNameSameWindow = true;
				return;
			}
			if(dm.gameplayMode == "create")
			{
				for(var level in myLevelNames)
				{
					if(level[0] == levelName)
					{
						Debug.Log("Level Names Are The Same");
						showNameSameWindow = true;
						return;
					}
				}
				UploadLevel();
			}
			else
				UploadLevel();

		}
		else if (GUI.Button(new Rect(165, 105, 100, 50), "Not Yet..."))
			showUploadWindow = false;
	}
	else
	{
		showNotSubmittableWindow = true;
		showUploadWindow = false;
//		GUI.Label(Rect (10, 30, 300, 20), "Sorry... this isn't submittable yet.");
//
//		if (GUI.Button(new Rect(70,70, 50, 50), "OK"))
//			showUploadWindow = false;
	}
}

function NameSameWindow()
{
	showNameSameWindow = ShowMessageWindow("You have another level with the same name or have a blank name. Please rename the new level.");
}

function NotSubmittableWindow()
{
	showNotSubmittableWindow = ShowMessageWindow("Sorry... this isn't submittable yet.");
}

function ShowMessageWindow(message : String) : boolean
{
	var flag : boolean = true;
	GUI.Box(new Rect(350, 350, 300, 200), "Message");
	GUI.Label(Rect (375, 375, 275, 100), message);

	if (GUI.Button(new Rect(475, 450, 50, 50), "OK"))
		flag = false;

	return flag;
}


function CreateModel(x:float, y:float, model:GameObject ) : GameObject
{
	var newModel : GameObject = Instantiate(model) as GameObject;
	var z = Home.y+(hit_y+heightFactor) + ((heightFactor+hit_y)*spacing);
	newModel.transform.localPosition = new Vector3(x, z, y);
	return newModel;
}

function PlaceModel(fl:GameObject)
{
	Debug.Log(fl.name);
	if(fl.transform.position.x <= 13 &&
		fl.transform.position.x >= 3 &&
		fl.transform.position.z <= 13 &&
		fl.transform.position.z >= 3)
	{

		var gos: GameObject[] = GameObject.FindGameObjectsWithTag("Level Item");

		for (var go : GameObject in gos)
		{
			var d :float = Vector2.Distance(new Vector2(fl.transform.position.x, fl.transform.position.z), new Vector2(go.transform.position.x, go.transform.position.z));
			if (go!=dragModel && d < 1)
			{
				Debug.Log("I am deleting, I see conflict with " + go.transform.name + " in "+d);
				return;
			}
			Debug.Log(d);

		}

		var testModel : GameObject = CreateModel(fl.transform.position.x, fl.transform.position.z, dragModel);

		testModel.tag = "Level Item";
		testModel.AddComponent("LevelItemData");
		testModel.GetComponent("LevelItemData").offset = heightFactor;
		testModel.GetComponent("LevelItemData").itemName = SetFlag(testModel.name);
		if(dragModel.transform.name.Contains("Cute"))
		{
			(testModel.transform.Find("polySurface1").gameObject.AddComponent(MeshCollider) as MeshCollider).sharedMesh = p1Mesh;
			testModel.transform.Find("group1").gameObject.transform.Find("group2").gameObject.transform.Find("group4").gameObject.transform.Find("pCube2").gameObject.AddComponent(BoxCollider);
		}
		if(dragModel.transform.name.Contains("PickUp"))
			testModel.AddComponent(SphereCollider);
		if(dragModel.transform.name.Contains("HeavyBox"))
			testModel.AddComponent(SphereCollider);
		if(dragModel.transform.name.Contains("End"))
			testModel.AddComponent(BoxCollider);
	}
	else if(fl.name.Contains("Bot"))
	{
		startFlag = false;
	}

}

function SnappedToGrid(vec:Vector3) : Vector3
{
	var ray2: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit: RaycastHit;
	if (Physics.Raycast(ray2, hit))
	{
		if(hit.transform.name.Contains("level"))
		{
			hit_x = hit.collider.gameObject.GetComponent(LevelLoaderBox).level_x;
			hit_z = hit.collider.gameObject.GetComponent(LevelLoaderBox).level_z;

			hit_y = LevelArray[hit_x][hit_z];

			vec.x = Home.x+(hit_x) + (hit_x)*spacing;
			vec.z = Home.z+(hit_z) + (hit_z)*spacing;
			vec.y = Home.y+(hit_y+heightFactor) + ((heightFactor+hit_y)*spacing);

		}
	}

	return vec;
}

function SetFlag(s : String) : String
{
	if(s.Contains(startLocation.name))
	{
		startFlag = true;
		return "Start";
	}
	else if (s.Contains(endLocation.name))
	{
		endFlag = true;
		return "End";
	}
	else if (s.Contains(pickUp.name))
	{
		pickUpFlag = true;
		return "PickUp";
	}
	else if (s.Contains(heavyBox.name))
	{
		heavyBoxFlag = true;
		return "HeavyBox";
	}
	/*else if (s.Contains(RedSwitch.name))
	{
		RedSwitchFlag = true;
		return "Choice";
	}
	else if (s.Contains(BlueSwitch.name))
	{
		BlueSwitchFlag = true;
		return "BlueSwitch";
	}*/
	return "ERR";
}

///InitLevelEditor
function CraftLevel()
{
	for(i = 0; i < 10; i++)
	{
		for(j=0; j<10; j++)
		{
			MakeColumn(i,j);
		}
	}
}

function MakeColumn(i, j)
{

	for(k=0;k<=LevelArray[i][j];k++)
	{
		MakeCube(Home.x + i + (i * spacing), Home.y+k + (k*spacing), Home.z+j + (j*spacing), i, j, k, m);
	}
}

function RaiseSelected(i,j)
{
	//Row Selected
	if(rowToggle)
	{
		for(v = 0; v < 10; v++)
		{
			RaiseColumn(i,v);
		}
	}
	//Coloumn Selected
	else if(colToggle)
	{
		for(u = 0; u < 10; u++)
		{
			RaiseColumn(u,j);
		}
	}
	//Pattern Selected
	else
	{
		for(y = 0; y < 3; y++)
		{
			for(x = 0; x < 3; x++)
			{
				if(toggleBool[y][x] == true)
				{
					RaiseColumn(i+(x-1),j+(y-1));
				}
			}
		}

	}

}

function LowerSelected(i,j)
{
	//Row Selected
	if(rowToggle)
	{
		for(v = 0; v < 10; v++)
		{
			LowerColumn(i,v);
		}
	}
	//Column Selected
	else if(colToggle)
	{
		for(u = 0; u < 10; u++)
		{
			LowerColumn(u,j);
		}
	}
	//Pattern Selected
	else
	{
		for(y = 0; y < 3; y++)
		{
			for(x = 0; x < 3; x++)
			{
				if(toggleBool[y][x] == true)
					LowerColumn(i+(x-1),j+(y-1));
			}
		}
	}

}

var cnt : int =0;

function RaiseColumn(i,j)
{
	LevelArray[i][j] = LevelArray[i][j] + 1;
	k = LevelArray[i][j];


	//Debug.Log("Col Height: " + LevelArray[i][j]);
	if (LevelArray[i][j] > 9)
	{
		LevelArray[i][j] = 10;

		return;
	}
	if (k == 0)
	{
		return;
	}

	var levelItems = GameObject.FindGameObjectsWithTag("Level Item");
	for(item in levelItems)
	{
		var offset = item.GetComponent("LevelItemData").offset;
		if(item.transform.position.x == (Home.x + i + (i * spacing)) && item.transform.position.z == (Home.z+j + (j*spacing)) )
		{
			item.transform.position.y = Home.y+k+offset + ((k+offset)*spacing);
		}
	}
	if(pickCol == 7)
	{
		colorByLevel(i,j, k);
	}
	if(pickCol == 8)
	{
		horizontalStripes(j);
	}
	MakeCube(Home.x + i + (i * spacing), Home.y+k + (k*spacing), Home.z+j + (j*spacing), i, j, k, m);

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
	for(item in levelItems)
	{
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

function MakeCube(x, y, z, i, j, k, m)
{
	var newCube : LevelLoaderBox = Instantiate(cube_prefab, new Vector3(x,y,z), Quaternion.identity);
	newCube.level_x = i;
	newCube.level_y = k;
	newCube.level_z = j;
	newCube.renderer.material = m;
	boxes.Add(newCube);
}

function IsSubmittable() : boolean
{
	var startCount = 0;
	var endCount = 0;
	var keyCount = 0;
	var levelItems = GameObject.FindGameObjectsWithTag("Level Item");
	for(item in levelItems)
	{
		switch(item.GetComponent("LevelItemData").itemName)
		{
			case "Start": startCount++; break;
			case "End": endCount++; break;
			case "PickUp": keyCount++; break;
			case "HeavyBox": keyCount++; break;
			default: Debug.Log("something weird is going down"); break;
		}
	}


	return(startCount >= 1 && endCount > 0 && endCount <= keyCount + 1);
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
