#pragma strict



@HideInInspector public static var paths : PathDataBean[];
var breadCrumb : GameObject;

//Singleton Constructor
private static var instance : PathDrawer;
static function getInstance() : PathDrawer{

	if( instance == null ){
		instance = GameObject.FindObjectOfType(PathDrawer);
	}
	return instance;

}



/**
* Method to draw a set of paths
*/
function drawPaths(){
	for( var p = 0; p < paths.Length; p++ ){
		
		
		for( var b = 0; b < WorldManager.botsList.Count; b++ ){
			var bot : GameObject = WorldManager.botsList[b].obj;
		
			var follower : GameObject = new GameObject();
			var drawPath : boolean = false;
			var oldPos : Vector3;
		
		
			follower.transform.position = bot.transform.position;
			follower.transform.eulerAngles = bot.transform.eulerAngles;
			for( var i = 0; i < paths[p].botPaths[b].commandList.Length; i++ ){
				oldPos = follower.transform.position;
				
				switch( paths[p].botPaths[b].commandList[i] ){
					case "Forward":
						follower.transform.position += follower.transform.forward.normalized;
					break;
					case "Backward":
						follower.transform.position -= follower.transform.forward.normalized;
					break;
					case "TurnRight":
						follower.transform.eulerAngles += Vector3(0,90,0);
					break;
					case "TurnLeft":
						follower.transform.eulerAngles -= Vector3(0,90,0);
					break;
					case "Jump":
						var forPos : Vector3 = WorldManager.WorldToBlocks(follower.transform.position+follower.transform.forward.normalized);
						if( WorldManager.block[forPos.x,forPos.y,forPos.z].canBeWalkedOn ){
							follower.transform.position += follower.transform.forward.normalized + Vector3.up;
						}else{
							follower.transform.position += follower.transform.forward.normalized;
							oldPos = makeBreadCrumb(follower,oldPos);
							while( forPos.y >= 0 ){
								if( WorldManager.block[forPos.x,forPos.y,forPos.z].canBeWalkedOn ){
									follower.transform.position = WorldManager.BlocksToWorld(forPos+Vector3.up);
									break;
								}
								forPos.y -= 1;
							}
						}
					break;
				}
				follower.transform.position = Vector3( Mathf.FloorToInt(follower.transform.position.x)+0.5f, Mathf.FloorToInt(follower.transform.position.y)+0.5f, Mathf.FloorToInt(follower.transform.position.z)+0.5f );
				follower.transform.eulerAngles = Vector3( 0, Mathf.FloorToInt(follower.transform.eulerAngles.y/90+0.5f) * 90, 0 );
				oldPos = makeBreadCrumb(follower,oldPos);
				
			}
			
		}
		
	}
	paths = null;

}


private function makeBreadCrumb( follower : GameObject, oldPos : Vector3 ){
	var crumb : GameObject = GameObject.Instantiate(breadCrumb);
	crumb.transform.position = follower.transform.position;
	//crumb.name = "_Path: "+p+" Command " +i+": '"+paths[p].botPaths[b].commandList[i]+"'";
	if( follower.transform.position != oldPos ){
		var line : LineRenderer= crumb.GetComponent(LineRenderer);
		if( line != null ){
			line.SetPosition(0,oldPos);
			line.SetPosition(1,follower.transform.position);
		}
	}
	//colorMaterials(crumb,bot.GetComponent(Bot).color);
	return follower.transform.position;
}

private function colorMaterials( o : GameObject, c : Color ){
	var r : Renderer = o.renderer;
 	r.material = new Material(r.material);
 	r.material.SetColor("_Color",c);
 	r.material.SetColor("_Emission",c);
 	for( var i = 0; i < o.transform.childCount; i++ ){
 		colorMaterials( o.transform.GetChild(i).gameObject, c );
 	}
} 