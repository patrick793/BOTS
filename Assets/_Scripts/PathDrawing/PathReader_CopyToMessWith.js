#pragma strict
import System.Collections.Generic;

@script RequireComponent(PathDrawer_Copy);

/**
* This script will read in path data from a CSV file (in Barry Datacord format) and prompt the user which level
* to view paths for. It will then send the information to a PathDrawer_CopyToMessWith and a World Manager for visualization
*/


var pathSource : TextAsset;
var boxStyle : GUIStyle;
var listStyle : GUIStyle;
var scrollSkin : GUISkin;

//Screen positions
private var boxPos : Rect;
private var listContPos : Rect;
private var listPos : Rect;

//The path drawer
@HideInInspector var pathDrawer : PathDrawer_Copy;

//Paths
@HideInInspector var paths : PathDataBean[];

//Level list
private var levList : List.<int>;
var levStrList : List.<String>;
private var levelStrings : String[];
private var levelList : EditorList;
private var hasSelectedLevel : boolean = false;


function Start () {
	pathDrawer = GetComponent(PathDrawer_Copy);
	paths = readPaths(pathSource);
	
	EditorGUIManager.muteGUI = false;
	listPos = Rect( Screen.width*0.5f-128, Screen.height*0.5f-125, 256, 250 );
	listContPos = Rect( Screen.width*0.5f-140, Screen.height*0.5f-128, 280, 256 );
	boxPos = Rect( Screen.width*0.5f-192, Screen.height*0.5f-192, 384, 384 );
	
	//Setup the level list
	levList = new List.<int>();
	levStrList = new List.<String>();
	for( var i = 0; i < paths.Length; i++ ){
		if( !levList.Contains(paths[i].levelID) )
			for( var j = 0; j <= levList.Count; j++ )
				if( j == levList.Count || paths[i].levelID < levList[j] ){
					levList.Insert( j, paths[i].levelID );
					levStrList.Insert( j, "          "+paths[i].levelID );
					break;
				}

	}
	levelList = new EditorList( levStrList.ToArray(), listPos, listStyle, scrollSkin );
	
	

}

function OnGUI(){
	if( !hasSelectedLevel ){
	
		//Box
		GUI.Box( boxPos, "Select the level to view paths for", boxStyle );
		
		//List
		GUI.Box( listContPos, "", boxStyle );
		var sel : String = levelList.draw();
		if( sel != null ){
			var levToLoad : int = levList[levStrList.IndexOf(sel)];
			hasSelectedLevel = true;
			loadLevel(levToLoad);
		}
		
	}

}


private function loadLevel( levID : int ){
	yield GameObject.Find("DataManager").GetComponent(DataManager).LoadLevel(levID);
	var pathList : List.<PathDataBean> = new List.<PathDataBean>();
	for( var i = 0; i < paths.Length; i++ ){
		if( paths[i].levelID == levID )
			pathList.Add(paths[i]);
	}
	PathDrawer.paths = pathList.ToArray();
	gameObject.AddComponent(WorldManager);
	Destroy(this);
}

/**
* This method will read a text file of level paths and return an array of all levels that have paths for them
*/
static function readPaths( pathSource : TextAsset ) : PathDataBean[]{
	
	var lines : String[] = pathSource.text.Split("\n"[0]);
	var pathList : List.<PathDataBean> = new List.<PathDataBean>();
	for( var l = 0; l < lines.Length-1; l++ ){
		var line : String = lines[l];
		var i : int = 0;
	
		//Parse the UID
		var uid : String;
		while( line[i] != ","[0] ){
			uid = uid + line[i];
			i++;
		}
		
		//Parse the level ID
		i++;
		var level : int;
		var levStr : String;
		while( line[i] != ","[0] ){
			levStr = levStr + line[i];
			i++;
		}
		level = int.Parse(levStr);
		
		
		//Parse the commands
		i++;
		var depth : int = 0;
		var commands : PathDataBean.BotPath[];
		var cmdList : List.< List.<String> > = new List.< List.<String> >();
		var j : int = -1;
		var k : int = 0;
		while( line[i] != ","[0] || depth > 0 ){
			if( line[i] == "["[0] ){
				depth++;
				j++;
				k = 0;
				cmdList.Add(new List.<String>());
				cmdList[j].Add("");
			}else if( line[i] == "]"[0] ){
				
				depth--;
			}else if( line[i] == ","[0] ){
				k++;
				cmdList[j].Add("");
			}else if( line[i] != "'"[0] && line[i] != "\""[0] && line[i] != " "[0] ){
				cmdList[j][k] = cmdList[j][k] + line[i];
			}
			i++;
		}
		commands = new PathDataBean.BotPath[cmdList.Count];
		var s = "";
		for( j = 0; j < cmdList.Count; j++ ){
			commands[j] = new PathDataBean.BotPath( cmdList[j].ToArray() );
		}
		
		
		
		//Parse the path completion
		i++;
		var completion : PathDataBean.Completion;
		var comStr : String = "";
		while( i < line.Length && line[i] != "\n"[0] ){
			comStr = comStr + line[i];
			i++;
		}
		if( comStr.Equals("COMPLETED") ){
			completion = PathDataBean.Completion.COMPLETE;
		}else if( comStr.Equals("ERROR") ){
			completion = PathDataBean.Completion.ERROR;
		}else{
			completion = PathDataBean.Completion.INCOMPLETE;
		}
		
		
		
		//Create the data bean
		pathList.Add( new PathDataBean( uid, level, commands, completion ) );
		
	}
	
	return pathList.ToArray();
	
	
}






















