#pragma strict

var oldPos : Vector3;
var coordinatesList : List.<Vector3>;
var breadCrumb : GameObject;
var clickedObjectPos : Vector3;
var clickedObject : GameObject;
var carryingBox : boolean;
var boxCarried : GameObject;
static var ghostBot : GameObject;
var colorList : List.<Color>;
var currentColor : Color;

var arrowType : int;
var movesList : List.<int>;
var botArrowList : List.<Arrow>;
var boxArrowList : List.<Arrow>;
var lastCarriedBoxList : List.<GameObject>;
var lastGhostBoxList : List.<GameObject>;
var climberCrumbList : List.<GameObject>;

//Singleton Constructor
private static var instance : PathDrawer_Copy;
static function getInstance() : PathDrawer_Copy{

	if( instance == null ){
		instance = GameObject.FindObjectOfType(PathDrawer_Copy);
	}
	return instance;
}

function Awake(){
	colorList.Add(Color.red);
	colorList.Add(Color(1,0.6470,0,1)); //orange
	colorList.Add(Color.yellow);
	colorList.Add(Color.green);
	colorList.Add(Color.cyan);
	colorList.Add(Color.blue);
	colorList.Add(Color.magenta);
	colorList.Add(Color(0.6274,0.1254,0.9411,1)); //purple
	colorList.Add(Color.red);
	colorList.Add(Color(1,0.6470,0,1)); //orange
	colorList.Add(Color.yellow);
	colorList.Add(Color.green);
	colorList.Add(Color.cyan);
	colorList.Add(Color.blue);
	colorList.Add(Color.magenta);
	colorList.Add(Color(0.6274,0.1254,0.9411,1)); //purple

}

function LateUpdate(){

	if(oldPos == Vector3.zero && WorldManager.botsList != null){
	
		//stores BOT position in the array and set as starting position
        oldPos = WorldManager.botsList[0].obj.transform.position; 
        
        //creates a new transparent bot to stand on starting position
        ghostBot = Instantiate(Resources.Load("Bots/Bot2"));
        ghostBot.transform.position = oldPos;
        ghostBot.AddComponent("BotCompass");
        
        var shader : Shader = Shader.Find("Transparent/Bumped Specular");
        GameObject.Find("Bot2(Clone)/BotBody/BotHead").GetComponent(MeshRenderer).materials[0].shader = shader;
        GameObject.Find("Bot2(Clone)/BotBody/BotHead").GetComponent(MeshRenderer).materials[1].shader = shader;
        GameObject.Find("Bot2(Clone)/BotBody").GetComponent(MeshRenderer).materials[0].shader = shader;
        GameObject.Find("Bot2(Clone)/BotBody").GetComponent(MeshRenderer).materials[1].shader = shader;
        GameObject.Find("Bot2(Clone)/BotArmR").GetComponent(MeshRenderer).materials[0].shader = shader;
        GameObject.Find("Bot2(Clone)/BotArmR").GetComponent(MeshRenderer).materials[1].shader = shader;
        GameObject.Find("Bot2(Clone)/BotArmL").GetComponent(MeshRenderer).materials[0].shader = shader;
        GameObject.Find("Bot2(Clone)/BotArmL").GetComponent(MeshRenderer).materials[1].shader = shader;
        
        GameObject.Find("Bot2(Clone)/BotBody/BotHead").GetComponent(MeshRenderer).materials[0].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotBody/BotHead").GetComponent(MeshRenderer).materials[1].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotBody").GetComponent(MeshRenderer).materials[0].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotBody").GetComponent(MeshRenderer).materials[1].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotArmR").GetComponent(MeshRenderer).materials[0].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotArmR").GetComponent(MeshRenderer).materials[1].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotArmL").GetComponent(MeshRenderer).materials[0].color.a = 0.3f;
        GameObject.Find("Bot2(Clone)/BotArmL").GetComponent(MeshRenderer).materials[1].color.a = 0.3f;
        
        /*translates Y initial position to the block bellow BOT, correcting difference
        between BOTS height and box + 1 height (where breadcrumbs are drawn). */
        oldPos.y -= (1-0.05000019);
		coordinatesList.Add(oldPos);
		
    }

	//Rays to handle mouse click
	var ray : Ray;
	var hit : RaycastHit;
	
	//Right click indicates interaction with a box
	if(Input.GetMouseButtonDown(1)){
	
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var origin : Vector3;
		var dest : Vector3;
		
		if(Physics.Raycast(ray, hit, 100)){
			
			clickedObject = hit.transform.gameObject;
			clickedObjectPos = hit.transform.gameObject.transform.position;
		
			//if not carrying a box, player can pick up one
			if (clickedObject.name == "Box(Clone)" && !carryingBox){
				if (clickedObjectPos.x != oldPos.x && clickedObjectPos.z != oldPos.z){
					//trying to pick up box in diagonal position, do nothing
				} else {
					if(clickedObjectPos.x - oldPos.x == 1 || clickedObjectPos.z - oldPos.z == 1 //allows to pick up only boxes 1 block away
			 		|| clickedObjectPos.x - oldPos.x == -1 || clickedObjectPos.z - oldPos.z == -1) {
			 		
						boxCarried = clickedObject;
						lastCarriedBoxList.Add(boxCarried);
						
						//creates new GhostBox if there's not one yet in that position
						if (WorldManager.block[ WorldManager.WorldToBlocks(clickedObjectPos).x,
						WorldManager.WorldToBlocks(clickedObjectPos).y,
						WorldManager.WorldToBlocks(clickedObjectPos).z].getObject() == null){

							//creates ghost box where the picked up box stood earlier
							var ghostBox : GameObject = Instantiate(Resources.Load("World/Gray/Box"));
							ghostBox.renderer.material.shader = Shader.Find("Transparent/Bumped Specular");
							ghostBox.renderer.material.color.a = 0.3f;
							ghostBox.transform.position = clickedObjectPos;
							ghostBox.transform.localScale -= Vector3(0.05,0.05,0.05);
							ghostBox.name = "GhostBox";
							WorldManager.block[ WorldManager.WorldToBlocks(clickedObjectPos).x,
							WorldManager.WorldToBlocks(clickedObjectPos).y,
							WorldManager.WorldToBlocks(clickedObjectPos).z].setObject(ghostBox);
							
							lastGhostBoxList.Add(ghostBox);
							
						}else {
							/*
							don't instantiate new ghostBox, there's one in that position already.
							Instead add an empty GameObject to occupy space. This is useful for undoing
							the pick up movement multiple times in the same position
							*/
							var invisibleBox : GameObject = new GameObject();
							invisibleBox.transform.position = clickedObjectPos;
							lastGhostBoxList.Add(invisibleBox);
						}
						//set to false collision in the box's old position
						WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y , 
						WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision = false;
						
						//variable used when making breadcrumb after moving
						carryingBox = true;
						
						//draw diagonal breadcrumb to represent box pick up
						dest = oldPos;
						dest.y +=2;
						currentColor = getColor(clickedObject);
						
						arrowType = 2;
						makeBreadCrumb(clickedObjectPos, dest, currentColor, true);
						movesList.Add(2); 
						
						//moves box to the position above the player after pick-up happens
						boxCarried.transform.position = dest;
						
					} else { //pick up box far away
						if (clickedObjectPos.x != oldPos.x){ //movement on the X axis
							origin = oldPos;
		 					dest = clickedObjectPos;
							if(origin.x > dest.x){
								dest.x+=1;
								if(checkClearPath(origin, dest, 0)){ //movement type 1
									moveAndPickUp(origin, dest, 0, 0.06f);
								}
							} else if (origin.x < dest.x){ //movement type 3
								dest.x-=1;
								if(checkClearPath(origin, dest, 0)){
									moveAndPickUp(origin, dest, 0, -0.06f);
								}
							}
						} else if (clickedObjectPos.z != oldPos.z){ //movement on the Z axis
							origin = oldPos;
		 					dest = clickedObjectPos;
							if(oldPos.z > clickedObjectPos.z){ //movement type 2 
								dest.z+=1;
								if(checkClearPath(origin, dest, 1)){
									moveAndPickUp(origin, dest, 1, -0.06f);
								}
							} else if (oldPos.z < clickedObjectPos.z){ //movement type 0
								dest.z-=1;
								if(checkClearPath(origin, dest, 1)){
									moveAndPickUp(origin, dest, 1, 0.06f);
								}
							}
						}
					} //end if clicked box far away
				} //end if pick up box in diagonal position
			} //end if clicked a box
			
			//if player is carrying a box and wants to put it down
			if (((clickedObject.name == "Object" && clickedObjectPos.y == oldPos.y) || (clickedObject.name == "GhostBox" || clickedObject.name == "Bot1(Clone)" || clickedObject.name == "Switch(Clone)")) && carryingBox){
				
				if (clickedObjectPos.x != oldPos.x && clickedObjectPos.z != oldPos.z){
					//trying to put down a box in diagonal position, do nothing
				} else {
					//checks if block above where the player wants to put a box is clear
					if((clickedObject.name == "Object" &&  WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y+1 , 
					WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision==false) ||
					((clickedObject.name == "Bot1(Clone)" || clickedObject.name == "Switch(Clone)" || clickedObject.name == "GhostBox") && 
					WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y , 
					WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision==false)){
					
						if((clickedObjectPos.x - oldPos.x == 1 || clickedObjectPos.z - oldPos.z == 1
				 		|| clickedObjectPos.x - oldPos.x == -1 || clickedObjectPos.z - oldPos.z == -1) ){ //allows to put down boxes only 1 block away
							
							carryingBox = false;
							
							//draw diagonal breadcrumb to represent box put down
							origin = oldPos;
							origin.y +=2;
							dest = clickedObjectPos;
							if (clickedObject.name == "Object") {
								dest.y += 1; //adjust the difference of height between blocks and goals/bot when putting down the box
							}
							
							arrowType = 3;
							makeBreadCrumb(origin, dest, currentColor, true);
							movesList.Add(3); 
							
							//moves box to the position where it shall be put down
							boxCarried.transform.position = clickedObjectPos;
							
							if(clickedObject.name == "Bot1(Clone)" || clickedObject.name == "Switch(Clone)" || clickedObject.name == "GhostBox"){
								//Need not to lift box one position, just set collision to true in new box position 
								WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y , 
								WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision = true;
							} else {
								//Lift box one position (to stay above block), set collision to true in new box position
								boxCarried.transform.position.y += 1;
								WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y+1 , 
								WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision = true;
							}
						} else {
							if(clickedGoal(clickedObjectPos)){
								if (clickedObjectPos.x != oldPos.x){ //movement on the X axis
									if(checkClearPath(oldPos, clickedObjectPos, 0)){
										
										origin = oldPos;
					 					dest = clickedObjectPos;
					 					
										if(ghostBot.transform.position.x > clickedObjectPos.x){
											/*
											movement type 1, decreasing on X axis
											parameters:
											1 - origin of the movement
											2 - destination of the movement
											3 - axis of movement (0 for X, 1 for Z)
											4 - direction offset: if X decreases, mov is type 1, pass 1
											5 - breadcrumb offset: if X decreases, mov is type 1, breadcrumb increases in Z, pass 0.06f
											*/
											moveAndDropDownBox(origin, dest, 0, 1, 0.06f);
										} else if (ghostBot.transform.position.x < clickedObject.transform.position.x){
											/*
											movement type 3, increasing on X axis
											parameters:
											1 - origin of the movement
											2 - destination of the movement
											3 - axis of movement (0 for X, 1 for Z)
											4 - direction offset: if X grows, mov is type 3, pass -1
											5 - breadcrumb offset: if X grows, mov is type 3, breadcrumb decreases in Z, pass -0.06f
											*/
											moveAndDropDownBox(origin, dest, 0, -1, -0.06f);
										}
									}
								} else if (clickedObjectPos.z != oldPos.z){ //movement on the Z axis
									if(checkClearPath(oldPos, clickedObjectPos, 1)){
										
										origin = oldPos;
					 					dest = clickedObjectPos;
					 					
										if(ghostBot.transform.position.z > clickedObjectPos.z){
										
											/*
											movement type 2, decreasing on Z axis
											parameters:
											1 - origin of the movement
											2 - destination of the movement
											3 - axis of movement (0 for X, 1 for Z)
											4 - direction offset: if Z decreases, mov is type 2, pass 1
											5 - breadcrumb offset: if Z decreases, mov is type 2, breadcrumb decreases in X, pass -0.06f
											*/
											moveAndDropDownBox(origin, dest, 1, 1, -0.06f);
											
										} else if (ghostBot.transform.position.z < clickedObject.transform.position.z){
										
											/*
											movement type 0, decreasing on Z axis
											parameters:
											1 - origin of the movement
											2 - destination of the movement
											3 - axis of movement (0 for X, 1 for Z)
											4 - direction offset: if Z increases, mov is type 0, pass -1
											5 - breadcrumb offset: if Z increases, mov is type 0, breadcrumb increases in X, pass 0.06f
											*/
											moveAndDropDownBox(origin, dest, 1, -1, 0.06f);
										}
									}
								}
							}
						} // end if put down one block away or more than one
					} //end if clicked block and space above is empty
				} //end if not trying to put box in diagonal
			} //end if clicked some place where box can be dropped
		} //end if ray hit something
	} //if mouse right click
	

	//Left click indicates movement
	if(Input.GetMouseButtonDown(0)){
		
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if(Physics.Raycast(ray, hit, 100)){
			
			clickedObjectPos = hit.transform.gameObject.transform.position;
			
			if ((WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x, //allows movement if destiny has block or hasn't collision (goal/BOT)
			WorldManager.WorldToBlocks(clickedObjectPos).y,
			WorldManager.WorldToBlocks(clickedObjectPos).z].hasBlock) ||
			(WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x,
			WorldManager.WorldToBlocks(clickedObjectPos).y,
			WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision == false)){
				
				/* If clicked BOT/box, translates Y clicked position to the block bellow BOT/box, correcting difference
        		between BOTS/box height and box + 1 height (where breadcrumbs are drawn). */
				if(WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x,
				WorldManager.WorldToBlocks(clickedObjectPos).y,
				WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision == false){
					clickedObjectPos.y -= (1-0.05000019);
				}
				
				if(WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x,
				WorldManager.WorldToBlocks(clickedObjectPos).y+1,
				WorldManager.WorldToBlocks(clickedObjectPos).z].hasBlock){
					//trying to move to a position with there's a block above, do nothing
				} else {
					 if(clickedObjectPos.x != oldPos.x && clickedObjectPos.z != oldPos.z){
						//trying to move diagonally, do nothing
					 } else {
				 		var startPos : Vector3;
					 	var endPos : Vector3;
					 		
					 	if (clickedObjectPos.y == oldPos.y){ //if movement is in the same height
					 		
					 		//if movement is in X axis
						 	if(clickedObjectPos.x != oldPos.x){
						 		if(checkClearPath(oldPos, clickedObjectPos, 0)){
							 		startPos = oldPos;
						 			endPos = clickedObjectPos;
						 			
						 			BotCompass.getInstance().orientation(startPos, endPos, 0);
						 			
						 			//applies offset to breadcrumb's position according to movement direction
						 			if (BotCompass.getInstance().getMovement() == 0){
							 			//grows x breadcrumb reference position
							 			startPos.x += 0.06f;
							 			endPos.x += 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 1){
							 			//grows z breadcrumb reference position
							 			startPos.z += 0.06f;
							 			endPos.z += 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 2){
							 			//decreases x breadcrumb ref position
							 			startPos.x -= 0.06f;
							 			endPos.x -= 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 3){
							 			//decreases z breadcrumb ref position
							 			startPos.z -= 0.06f;
							 			endPos.z -= 0.06f;
							 		}
						 			
						 			//lift positions to create breadCrumb above the clicked block.
						 			startPos.y += 1;
						 			endPos.y += 1;
						 			
						 			arrowType=0; //arrow created is type 0 (bot movement)
						 			makeBreadCrumb(startPos, endPos, Color.white, false);
						 			ghostBot.transform.position = endPos;
						 			
						 			//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
						 			if (carryingBox){
							 			startPos.y += 1;
							 			endPos.y += 1;
							 			boxCarried.transform.position = endPos;
							 			arrowType = 1; //arrow created is type 1 (box movement)
						 				makeBreadCrumb(startPos, endPos, currentColor, false);
						 				movesList.Add(1);
						 			} else {
						 				movesList.Add(0);
						 			}
						 			
						 			oldPos=clickedObjectPos;
						 			coordinatesList.Add(oldPos);
						 		}
						 	} else if(clickedObjectPos.z != oldPos.z){ //if movement is in Z axis
						 		if(checkClearPath(oldPos, clickedObjectPos, 1)){ 
							 		startPos = oldPos;
						 			endPos = clickedObjectPos;
						 			
						 			BotCompass.getInstance().orientation(startPos, endPos, 1);
						 			
						 			//applies offset to breadcrumb's position according to movement direction
						 			if (BotCompass.getInstance().getMovement() == 0){
							 			//grows x breadcrumb reference position
							 			startPos.x += 0.06f;
							 			endPos.x += 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 1){
							 			//grows z breadcrumb reference position
							 			startPos.z += 0.06f;
							 			endPos.z += 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 2){
							 			//decreases x breadcrumb ref position
							 			startPos.x -= 0.06f;
							 			endPos.x -= 0.06f;
							 		} else if (BotCompass.getInstance().getMovement() == 3){
							 			//decreases z breadcrumb ref position
							 			startPos.z -= 0.06f;
							 			endPos.z -= 0.06f;
							 		}
					 			
						 			//lift positions to create breadCrumb above the clicked block.
						 			startPos.y += 1;
						 			endPos.y += 1;
						 			
						 			arrowType=0; //arrow created is type 0 (bot movement)
						 			makeBreadCrumb(startPos, endPos, Color.white, false);
						 			ghostBot.transform.position = endPos;
						 			
						 			//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
						 			if (carryingBox){
							 			startPos.y += 1;
							 			endPos.y += 1;
							 			boxCarried.transform.position = endPos;
							 			arrowType = 1; //arrow created is type 1 (box movement)
						 				makeBreadCrumb(startPos, endPos, currentColor, false);
						 				movesList.Add(1);
						 			} else {
						 				movesList.Add(0);
						 			}
						 			
						 			oldPos=clickedObjectPos;
						 			coordinatesList.Add(oldPos);
					 			}
						 	}
					 	} else { //if movement is in a different height
					 		
					 		if ((Mathf.Abs(fix(oldPos.y) - fix(clickedObjectPos.y))>1)){// && (oldPos.y < clickedObjectPos.y)){ 
						    	
						        //Climb more than one box at a time
						        var fixedOldPos = oldPos;
						        var fixedCOP = clickedObjectPos;
						        fixedOldPos.y = fix(oldPos.y);
						        fixedCOP.y = fix(clickedObjectPos.y);
						        //checkMultipleClimb(fixedOldPos, fixedCOP);
						        if (checkMultipleClimb(fixedOldPos, fixedCOP)){
						        	multipleClimb(fixedOldPos, fixedCOP);
						        }
						        
						    } else {
						    
						 		if(oldPos.y < clickedObjectPos.y){
						 			if(clickedObjectPos.x - oldPos.x == 1 || clickedObjectPos.z - oldPos.z == 1 //allows to climb up only block right in front of BOT
							 		|| clickedObjectPos.x - oldPos.x == -1 || clickedObjectPos.z - oldPos.z == -1 ){ 
							 			startPos = oldPos;
							 			endPos = clickedObjectPos;
							 			
							 			//sends information to BotCompass about the axis of the movement when climbing (x or z)
							 			if (startPos.x != endPos.x){
							 				BotCompass.getInstance().orientation(startPos, endPos, 0);
							 			} else if(startPos.z != endPos.z){
							 				BotCompass.getInstance().orientation(startPos, endPos, 1);
							 			}
							 			
							 			//applies offset to breadcrumb's position according to movement direction
							 			if (BotCompass.getInstance().getMovement() == 0){
								 			//grows x breadcrumb reference position
								 			startPos.x += 0.06f;
								 			endPos.x += 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 1){
								 			//grows z breadcrumb reference position
								 			startPos.z += 0.06f;
								 			endPos.z += 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 2){
								 			//decreases x breadcrumb ref position
								 			startPos.x -= 0.06f;
								 			endPos.x -= 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 3){
								 			//decreases z breadcrumb ref position
								 			startPos.z -= 0.06f;
								 			endPos.z -= 0.06f;
								 		}
								 			
							 			//lift positions to create breadCrumb above the clicked block.
							 			startPos.y += 1;
							 			endPos.y += 1;
							 			climberBreadCrumb(startPos, endPos, 0, Color.white);
							 			ghostBot.transform.position = endPos;
							 			
							 			//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
							 			if (carryingBox){
								 			startPos.y += 1;
								 			endPos.y += 1;
								 			boxCarried.transform.position = endPos;
							 				climberBreadCrumb(startPos, endPos, 0, currentColor);
							 				movesList.Add(5);
							 			} else {
							 				movesList.Add(4);
							 			}
							 			oldPos=clickedObjectPos;
							 			coordinatesList.Add(oldPos);
							 			
						 			} else {
							 			//Climbing up box far away, do nothing
							 		}
						 		
						 		} else if (oldPos.y > clickedObjectPos.y){
							 		if(clickedObjectPos.x - oldPos.x == 1 || clickedObjectPos.z - oldPos.z == 1 //allows to climb down only block right in front of BOT
							 		|| clickedObjectPos.x - oldPos.x == -1 || clickedObjectPos.z - oldPos.z == -1 ){ 
								 		startPos = oldPos;
								 		endPos = clickedObjectPos;
								 		
								 		//sends information to BotCompass about the axis of the movement when climbing (x or z)
							 			if (startPos.x != endPos.x){
							 				BotCompass.getInstance().orientation(startPos, endPos, 0);
							 			} else if(startPos.z != endPos.z){
							 				BotCompass.getInstance().orientation(startPos, endPos, 1);
							 			}
								 		
								 		//applies offset to breadcrumb's position according to movement direction
								 		if (BotCompass.getInstance().getMovement() == 0){
								 			//grows x breadcrumb reference position
								 			startPos.x += 0.06f;
								 			endPos.x += 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 1){
								 			//grows z breadcrumb reference position
								 			startPos.z += 0.06f;
								 			endPos.z += 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 2){
								 			//decreases x breadcrumb ref position
								 			startPos.x -= 0.06f;
								 			endPos.x -= 0.06f;
								 		} else if (BotCompass.getInstance().getMovement() == 3){
								 			//decreases z breadcrumb ref position
								 			startPos.z -= 0.06f;
								 			endPos.z -= 0.06f;
								 		}
								 		
								 		//lift positions to create breadCrumb above the clicked block.
							 			startPos.y += 1;
							 			endPos.y += 1;
								 		climberBreadCrumb(startPos, endPos, 1, Color.white);
								 		ghostBot.transform.position = endPos;
								 		
								 		//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
								 		if (carryingBox){
								 			startPos.y += 1;
								 			endPos.y += 1;
								 			boxCarried.transform.position = endPos;
							 				climberBreadCrumb(startPos, endPos, 1, currentColor);
							 			movesList.Add(5);
							 			} else {
							 				movesList.Add(4);
							 			}
							 			
								 		oldPos=clickedObjectPos;
								 		coordinatesList.Add(oldPos);
								 		
							 		} else {
							 			//Climbing down box far away, do nothing
							 		}
						 		}
						 		
							 	
					 		}
					 	} // end if same level move
					 	
					 } //end if diagonal move
				} //end if block above hasBlock
				
			} //End if clicked a block
			
		} //if ray hit something
	} //if mouse left click
} //end function update

//this function checks if player clicked a goal despite having a ghostbox on the top of it or not
private function clickedGoal(pos: Vector3) : boolean{

	var n : int = 0;
	for(var mov : MovableType in WorldManager.movableList){
		if(mov.obj.transform.position == pos && mov.obj.name=="Switch(Clone)"){
			return true;
		}
		n ++;
	}
	return false;
}


private function moveAndPickUp(startPos : Vector3, endPos : Vector3, axis : int, breadCrumbOffset : float){
	
	var origin : Vector3 = startPos;
	var dest : Vector3 = endPos;
	
	//applies offset for the breadcrumb
	if (axis == 0){
		origin.z = (origin.z + breadCrumbOffset);
		dest.z = (dest.z + breadCrumbOffset);
	} else if (axis == 1){
		origin.x = (origin.x + breadCrumbOffset);
		dest.x = (dest.x + breadCrumbOffset);
	}
	
	//set position to create breadcrumb
	origin.y += 1;
	dest.y = origin.y;
	
	//It's needed to set the orientation for use on makeArrowDiagonal and makeArrowStraight
	BotCompass.getInstance().orientation(origin, dest, axis);
	if (axis == 0 ){
		origin.x = fix(origin.x);
		dest.x = fix(dest.x);
	} else if (axis==1){
		origin.z = fix(origin.z);
		dest.z = fix(dest.z);
	}
	
	arrowType=0; //arrow created is type 0 (bot movement)
	makeBreadCrumb(origin, dest, Color.white, false);
	
	//moves bot, saves new position to list and logs movement
	oldPos = dest;
	oldPos.x = fix(oldPos.x);
	oldPos.z = fix(oldPos.z);
	ghostBot.transform.position = oldPos;
	oldPos.y -= 1;
	coordinatesList.Add(oldPos);
	movesList.Add(0);
	
	dest.z = fix(dest.z);
	origin.z = fix (origin.z);
	
	boxCarried = clickedObject;
	lastCarriedBoxList.Add(boxCarried);
	
	//creates new GhostBox if there's not one yet in that position
	if (WorldManager.block[ WorldManager.WorldToBlocks(clickedObjectPos).x,
	WorldManager.WorldToBlocks(clickedObjectPos).y,
	WorldManager.WorldToBlocks(clickedObjectPos).z].getObject() == null){

		//creates ghost box where the picked up box stood earlier
		var ghostBox : GameObject = Instantiate(Resources.Load("World/Gray/Box"));
		ghostBox.renderer.material.shader = Shader.Find("Transparent/Bumped Specular");
		ghostBox.renderer.material.color.a = 0.3f;
		ghostBox.transform.position = clickedObjectPos;
		ghostBox.transform.localScale -= Vector3(0.05,0.05,0.05);
		ghostBox.name = "GhostBox";
		WorldManager.block[ WorldManager.WorldToBlocks(clickedObjectPos).x,
		WorldManager.WorldToBlocks(clickedObjectPos).y,
		WorldManager.WorldToBlocks(clickedObjectPos).z].setObject(ghostBox);
		
		lastGhostBoxList.Add(ghostBox);
		
	}else {
		/*
		don't instantiate new ghostBox, there's one in that position already.
		Instead add an empty GameObject to occupy space. This is useful for undoing
		the pick up movement multiple times in the same position
		*/
		var invisibleBox : GameObject = new GameObject();
		invisibleBox.transform.position = clickedObjectPos;
		lastGhostBoxList.Add(invisibleBox);
	}
	//set to false collision in the box's old position
	WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y , 
	WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision = false;
	
	//variable used when making breadcrumb after moving
	carryingBox = true;
	
	//draw diagonal breadcrumb to represent box pick up
	dest.y +=1;
	currentColor = getColor(clickedObject);
	
	arrowType = 2;
	makeBreadCrumb(clickedObjectPos, dest, currentColor, true);
	movesList.Add(2); 
	
	//moves box to the position above the player after pick-up happens
	boxCarried.transform.position = dest;
	
}

private function moveAndDropDownBox(startPos : Vector3, endPos : Vector3, axis : int, directionBackOff : int, breadCrumbOffset : float){

	var origin : Vector3 = startPos;
	var dest : Vector3 = endPos;

	if (axis == 0){
		dest.x = (dest.x + directionBackOff);
		origin.z = (origin.z + breadCrumbOffset);
		dest.z = (dest.z + breadCrumbOffset);
	} else if (axis == 1){
		dest.z = (dest.z + directionBackOff);
		origin.x = (origin.x + breadCrumbOffset);
		dest.x = (dest.x + breadCrumbOffset);
	}
	
	dest.y+=0.05000019f;
	//lift positions to create player's breadcrumb
	origin.y += 1;
	
	//It's needed to set the orientation for use on makeArrowDiagonal and makeArrowStraight
	BotCompass.getInstance().orientation(origin, dest, axis);
	if (axis == 0 ){
		origin.x = fix(origin.x);
		dest.x = fix(dest.x);
	} else if (axis==1){
		origin.z = fix(origin.z);
		dest.z = fix(dest.z);
	}
	arrowType=0; //arrow created is type 0 (bot movement)
	makeBreadCrumb(origin, dest, Color.white, false);
	
	origin.y = fix(origin.y);
	dest.y = fix(dest.y);
	
	//lift positions to create carried box's breadcrumb
	origin.y += 1;
	dest.y += 1;
	boxCarried.transform.position = dest;
	arrowType = 1; //arrow created is type 1 (box movement)
	makeBreadCrumb(origin, dest, currentColor, false);
	movesList.Add(1);
	
	//now handles the put down part
	//make arrow breadcrumb
	carryingBox = false;
	
	if (axis==0){
		dest.z = fix(dest.z);
	} else if (axis ==1){
		dest.x = fix(dest.x);
	}
	arrowType = 3;
	makeBreadCrumb(dest, clickedObjectPos, currentColor, true);
	movesList.Add(3); 
	
	//moves box to the position where it shall be put down
	boxCarried.transform.position = clickedObjectPos;
	
	//sets collision on drop down position to true
	WorldManager.block[WorldManager.WorldToBlocks(clickedObjectPos).x , WorldManager.WorldToBlocks(clickedObjectPos).y , 
	WorldManager.WorldToBlocks(clickedObjectPos).z].hasCollision = true;
	
	if(axis==0){
		clickedObjectPos.x = (clickedObjectPos.x + directionBackOff);
	} else if (axis == 1){
		clickedObjectPos.z = (clickedObjectPos.z + directionBackOff);
	}
	oldPos = clickedObjectPos;
	ghostBot.transform.position = oldPos;
	oldPos.y -=(1-0.05000019);
	coordinatesList.Add(oldPos);

}

//function to check if the path between two points is clear and can be walked on
//param 3: 0 for moving in x, 1 for moving in z
private function checkClearPath (startPoint : Vector3, endPoint : Vector3, axis : int) : boolean{
	var length : float;
	var i : float;
	var minPoint : Vector3;
	
	if (axis == 0){
		length = Mathf.Abs(startPoint.x-endPoint.x);
		
		if (Mathf.Min(startPoint.x, endPoint.x)==startPoint.x){
			minPoint = startPoint;
		} else if (Mathf.Min(startPoint.x, endPoint.x)==endPoint.x) {
			minPoint = endPoint;
		}
		
		for (i = 0 ; i <= length ; i ++){
			
			if (WorldManager.block[WorldManager.WorldToBlocks(minPoint).x + i,
			WorldManager.WorldToBlocks(startPoint).y + 1,
			WorldManager.WorldToBlocks(startPoint).z].hasCollision){
				return false;
			}
			
			if (!WorldManager.block[WorldManager.WorldToBlocks(minPoint).x + i,
			WorldManager.WorldToBlocks(startPoint).y,
			WorldManager.WorldToBlocks(startPoint).z].canBeWalkedOn){
				return false;
			}
		}
	} else if (axis == 1){
		length = Mathf.Abs(startPoint.z-endPoint.z);
		
		if (Mathf.Min(startPoint.z, endPoint.z)==startPoint.z){
			minPoint = startPoint;
		} else if (Mathf.Min(startPoint.z, endPoint.z)==endPoint.z){
			minPoint = endPoint;
		}
		
		for (i = 0 ; i <= length ; i ++){
			
			if (WorldManager.block[WorldManager.WorldToBlocks(startPoint).x,
			WorldManager.WorldToBlocks(startPoint).y + 1,
			WorldManager.WorldToBlocks(minPoint).z + i].hasCollision){
				return false;
			}
			
			if (!WorldManager.block[WorldManager.WorldToBlocks(startPoint).x,
			WorldManager.WorldToBlocks(startPoint).y,
			WorldManager.WorldToBlocks(minPoint).z + i].canBeWalkedOn){
				return false;
			} 
		}
	}
	
	return true;
}

/*
Function to check if climbing multiple boxes is possible (if the climb up or down is a 
staircase). The fix() function is called because upon climbing more than one y unit, for 
some reason the increment variable increases by more or less than 1, so the climbs do not 
happen in discrete intervals like 6.5, 7.5, 8.5, and so forth. fix() fixes this issue
*/
private function checkMultipleClimb(origin : Vector3, dest : Vector3) : boolean{
	
	if (origin.x != dest.x){
		BotCompass.getInstance().orientation(origin, dest, 0);
	} else if(origin.z != dest.z){
		BotCompass.getInstance().orientation(origin, dest, 1);
	}
	
	if((clickedObjectPos.x - oldPos.x == 1 || clickedObjectPos.z - oldPos.z == 1 //allows to climb up only block right in front of BOT
	|| clickedObjectPos.x - oldPos.x == -1 || clickedObjectPos.z - oldPos.z == -1) && origin.y > dest.y ){
		origin = oldPos;
 		dest = clickedObjectPos;
 		
 		//sends information to BotCompass about the axis of the movement when climbing (x or z)
		if (origin.x != dest.x){
			BotCompass.getInstance().orientation(origin, dest, 0);
		} else if(origin.z != dest.z){
			BotCompass.getInstance().orientation(origin, dest, 1);
		}
 		
 		//applies offset to breadcrumb's position according to movement direction
 		if (BotCompass.getInstance().getMovement() == 0){
 			//grows x breadcrumb reference position
 			origin.x += 0.06f;
 			dest.x += 0.06f;
 		} else if (BotCompass.getInstance().getMovement() == 1){
 			//grows z breadcrumb reference position
 			origin.z += 0.06f;
 			dest.z += 0.06f;
 		} else if (BotCompass.getInstance().getMovement() == 2){
 			//decreases x breadcrumb ref position
 			origin.x -= 0.06f;
 			dest.x -= 0.06f;
 		} else if (BotCompass.getInstance().getMovement() == 3){
 			//decreases z breadcrumb ref position
 			origin.z -= 0.06f;
 			dest.z -= 0.06f;
 		}
 		
 		//lift positions to create breadCrumb above the clicked block.
		origin.y += 1;
		dest.y += 1;
 		climberBreadCrumb(origin, dest, 1, Color.white);
 		dest.x = fix(dest.x);
 		dest.z = fix(dest.z);
 		ghostBot.transform.position = dest;
 		
 		//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
 		if (carryingBox){
 			origin.y += 1;
 			dest.y += 1;
 			boxCarried.transform.position = dest;
			climberBreadCrumb(origin, dest, 1, currentColor);
			movesList.Add(5);
		} else {
			movesList.Add(4);
		}
		
 		oldPos=clickedObjectPos;
 		coordinatesList.Add(oldPos);
		return false;					 		
	}
	
	var newOrigin : Vector3 = origin; 
	var i : float = 0;
	
	if (BotCompass.getInstance().getMovement()==0){
		if (origin.y < dest.y) {
		
			if(dest.y-origin.y != dest.z-origin.z){
				return false;
			}
		
			for(i = origin.y+1 ; i < dest.y+1 ; i += 1){
				newOrigin.y = i;
				newOrigin.z+=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
			
		} else if (origin.y > dest.y){
		
			if(origin.y-dest.y != dest.z-origin.z){
				return false;
			}
			
			for(i = origin.y-1 ; i > dest.y-1 ; i -= 1){
				newOrigin.y = i;
				newOrigin.z+=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
		}
		
	} else if (BotCompass.getInstance().getMovement()==1){
		if (origin.y < dest.y) {
			
			if(dest.y-origin.y != origin.x - dest.x){
				return false;
			}
		
			for(i = origin.y +1; i < dest.y+1 ; i += 1){
				newOrigin.y = i;
				newOrigin.x-=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				}
			}
			return true;//multipleClimb(origin, dest);
			
		} else if (origin.y > dest.y) {
		
			if(origin.y - dest.y != origin.x - dest.x){
				return false;
			}
		
			for(i = origin.y-1 ; i > dest.y-1 ; i -= 1){
				newOrigin.y = i;
				newOrigin.x-=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
		}
		
	} else if (BotCompass.getInstance().getMovement()==2){
		if (origin.y < dest.y) {
		
			if(dest.y-origin.y != origin.z - dest.z){
				return false;
			}
		
			for(i = origin.y+1 ; i < dest.y+1 ; i += 1){
				newOrigin.y = i;
				newOrigin.z-=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
			
		} else if (origin.y > dest.y) {
		
			if(origin.y-dest.y != origin.z - dest.z){
				return false;
			}
			
			for(i = origin.y-1 ; i < dest.y-1 ; i -= 1){
				newOrigin.y = i;
				newOrigin.z-=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
		}
		
	} else if (BotCompass.getInstance().getMovement()==3){
		if (origin.y < dest.y) {	
			
			if(dest.y-origin.y != dest.x - origin.x){
				return false;
			}
			
			for( i = origin.y +1 ; i < dest.y+1 ; i += 1){
				newOrigin.y = i;
				newOrigin.x+=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				}
			}
			return true;//multipleClimb(origin, dest);
			
		} else if (origin.y > dest.y) {
		
			if(origin.y-dest.y != dest.x - origin.x){
				return false;
			}
			
			for(i = origin.y-1 ; i > dest.y-1 ; i -= 1){
				newOrigin.y = i;
				newOrigin.x+=1;
				
				if (!WorldManager.block[WorldManager.WorldToBlocks(newOrigin).x,
				WorldManager.WorldToBlocks(newOrigin).y,
				WorldManager.WorldToBlocks(newOrigin).z].canBeWalkedOn){
					//0 - something on the way can't be walked on
					return false;
				} 
			}
			return true;//multipleClimb(origin, dest);
		}
		
	}
}

private function fix(axis : float) : float{
	var noise : float = axis - Mathf.Floor(axis);
	if(noise > 0.01f && noise < 0.24f){
		axis -= noise;
	} else if(noise > 0.25f && noise < 0.74f){
		axis -= noise;
		axis += 0.5f;
	} else if (noise  > 0.75f && noise  < 0.99f){
		axis -= noise;
		axis += 1f;
	}
	return axis;
}

private function multipleClimb(origin : Vector3, dest : Vector3){
	var startPos : Vector3 = origin;
	var endPos  : Vector3 = dest;
	var boxStartPos : Vector3;
	var boxEndPos : Vector3;
	var i : float;
	var newEndPos : Vector3;
	
	//applies offset to breadcrumb's position according to movement direction
	if (BotCompass.getInstance().getMovement() == 0){
	
		//grows x breadcrumb reference position
		startPos.x += 0.06f;
		endPos.x += 0.06f;
		if(startPos.y < endPos.y){
			for(i = startPos.y ; i < endPos.y ; i ++){
			
				//lift positions to create breadCrumb above the clicked block.
				startPos.y = i + 1;
				newEndPos = startPos;
				newEndPos.y += 1;
				newEndPos.z +=1;
				
				climberBreadCrumb(startPos, newEndPos, 0, Color.white);
				newEndPos.x = fix(newEndPos.x);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}

				startPos.z +=1;
				oldPos = Vector3(oldPos.x, startPos.y, startPos.z);
				oldPos.x = fix(oldPos.x);
				coordinatesList.Add(oldPos);
			} 
		} else if(startPos.y > endPos.y) {
			for(i = startPos.y ; i > endPos.y ; i --){
			
				//lift positions to create breadCrumb above the clicked block.
				newEndPos = startPos;
				startPos.y = i + 1;
				newEndPos.z +=1;
				
				climberBreadCrumb(startPos, newEndPos, 1, Color.white);
				newEndPos.x = fix(newEndPos.x);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}
				
				startPos.y-=2;
				startPos.z +=1;
				oldPos = Vector3(oldPos.x, startPos.y, startPos.z);
				oldPos.x = fix(oldPos.x);
				coordinatesList.Add(oldPos);
			} 
		}
	} else if (BotCompass.getInstance().getMovement() == 1){
		//grows z breadcrumb reference position
		startPos.z += 0.06f;
		endPos.z += 0.06f;
		
		if(startPos.y < endPos.y){
			for(i = startPos.y ; i < endPos.y ; i ++){
			
				//lift positions to create breadCrumb above the clicked block.
				startPos.y = i + 1;
				newEndPos = startPos;
				newEndPos.y += 1;
				newEndPos.x -=1;
				
				climberBreadCrumb(startPos, newEndPos, 0, Color.white);
				newEndPos.z = fix(newEndPos.z);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}

				startPos.x -=1;
				oldPos = Vector3(startPos.x, startPos.y, oldPos.z);
				oldPos.z = fix(oldPos.z);
				coordinatesList.Add(oldPos);
			}
		} else if ( startPos.y > endPos.y){
			for(i = startPos.y ; i > endPos.y ; i --){
			
				//lift positions to create breadCrumb above the clicked block.
				newEndPos = startPos;
				startPos.y = i + 1;
				newEndPos.x -=1;
				
				climberBreadCrumb(startPos, newEndPos, 1, Color.white);
				newEndPos.z = fix(newEndPos.z);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}
				
				startPos.y-=2;
				startPos.x -=1;
				oldPos = Vector3(startPos.x, startPos.y, oldPos.z);
				oldPos.z = fix(oldPos.z);
				coordinatesList.Add(oldPos);
			}
		
		}
	} else if (BotCompass.getInstance().getMovement() == 2){
		//decreases x breadcrumb ref position
		startPos.x -= 0.06f;
		endPos.x -= 0.06f;
		
		if(startPos.y < endPos.y){
			for(i = startPos.y ; i < endPos.y ; i ++){
			
				//lift positions to create breadCrumb above the clicked block.
				startPos.y = i + 1;
				newEndPos = startPos;
				newEndPos.y += 1;
				newEndPos.z -=1;
				
				climberBreadCrumb(startPos, newEndPos, 0, Color.white);
				newEndPos.x = fix(newEndPos.x);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}
				
				startPos.z -=1;
				oldPos = Vector3(oldPos.x, startPos.y, startPos.z);
				oldPos.x = fix(oldPos.x);
				coordinatesList.Add(oldPos);
			}
		} else if(startPos.y > endPos.y) {
			for(i = startPos.y ; i > endPos.y ; i --){
			
				//lift positions to create breadCrumb above the clicked block.
				newEndPos = startPos;
				startPos.y = i + 1;
				newEndPos.z -=1;
				
				climberBreadCrumb(startPos, newEndPos, 1, Color.white);
				newEndPos.x = fix(newEndPos.x);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}
				
				startPos.y-=2;
				startPos.z -=1;
				oldPos = Vector3(oldPos.x, startPos.y, startPos.z);
				oldPos.x = fix(oldPos.x);
				coordinatesList.Add(oldPos);
			} 
		}
	} else if (BotCompass.getInstance().getMovement() == 3){
		//decreases z breadcrumb ref position
		startPos.z -= 0.06f;
		endPos.z -= 0.06f;
		
		if(startPos.y < endPos.y){
			for(i = startPos.y ; i < endPos.y ; i ++){
				
				//lift positions to create breadCrumb above the clicked block.
				startPos.y = i + 1;
				newEndPos = startPos;
				newEndPos.y += 1;
				newEndPos.x +=1;
				
				climberBreadCrumb(startPos, newEndPos, 0, Color.white);
				newEndPos.z = fix(newEndPos.z);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}

				startPos.x +=1;
				oldPos = Vector3(startPos.x, startPos.y, oldPos.z);
				oldPos.z = fix(oldPos.z);
				coordinatesList.Add(oldPos);
			}
		} else if (startPos.y > endPos.y){
			for(i = startPos.y ; i > endPos.y ; i --){
			
				//lift positions to create breadCrumb above the clicked block.
				newEndPos = startPos;
				startPos.y = i + 1;
				newEndPos.x +=1;
				
				climberBreadCrumb(startPos, newEndPos, 1, Color.white);
				newEndPos.z = fix(newEndPos.z);
				ghostBot.transform.position = newEndPos;
				
				//if carrying box, update box position, and draw green breadcrumb above movement breadcrumb (white)
				if (carryingBox){
					boxStartPos = startPos;
					boxStartPos.y += 1;
					boxEndPos = newEndPos;
					boxEndPos.y += 1;
					boxCarried.transform.position = boxEndPos;
					climberBreadCrumb(boxStartPos, boxEndPos, 0, currentColor);
					movesList.Add(5);
				} else {
					movesList.Add(4);
				}
				
				startPos.y -=2;
				startPos.x +=1;
				oldPos = Vector3(startPos.x, startPos.y, oldPos.z);
				oldPos.z = fix(oldPos.z);
				coordinatesList.Add(oldPos);
			}
		
		}
	}				 			
}

//function to draw breadCrumb in a climb
//param 3: 0 for climb up, 1 for climb down
private function climberBreadCrumb(startPoint : Vector3, endPoint : Vector3, direction : int, color: Color){
    if (direction==0){
        makeBreadCrumb(Vector3(startPoint.x, startPoint.y, startPoint.z), Vector3(startPoint.x, endPoint.y, startPoint.z), color, false);
        makeBreadCrumb(Vector3(startPoint.x, endPoint.y, startPoint.z), Vector3(endPoint.x, endPoint.y, endPoint.z), color, false);

    } else if (direction==1){
        makeBreadCrumb(Vector3(startPoint.x, startPoint.y, startPoint.z), Vector3(endPoint.x, startPoint.y, endPoint.z), color, false);
        makeBreadCrumb(Vector3(endPoint.x, startPoint.y, endPoint.z), Vector3(endPoint.x, endPoint.y, endPoint.z), color, false);

    }
}

private function makeBreadCrumb( startPoint : Vector3, endPoint : Vector3 , color : Color, diagonalCrumb : boolean){
    var crumb : GameObject = GameObject.Instantiate(breadCrumb);
    crumb.transform.position = startPoint;
    crumb.renderer.material.shader = Shader.Find("Particles/Additive");
    if( startPoint != endPoint){
        var line : LineRenderer= crumb.GetComponent(LineRenderer);
        if( line != null ){
        	//var colorAdjusted : Color = color;
        	//colorAdjusted.a = 0.2f;
        	crumb.GetComponent(LineRenderer).SetColors(color, color);
            line.SetPosition(0,endPoint);
            line.SetPosition(1,startPoint);
            
            var arrow : LineRenderer;
            var arrowBase : GameObject;
            var arrow2 : LineRenderer;
            var arrowBase2 : GameObject;
            
            if (startPoint.y==endPoint.y) {
            	makeArrowStraight(crumb, endPoint, color);
            } else if (startPoint.x==endPoint.x && startPoint.z==endPoint.z){
            	climberCrumbList.Add(crumb);
            }
            
            if (diagonalCrumb){
            	makeArrowDiagonal(crumb, startPoint, endPoint, currentColor);
            }
        }
    }
}

/*
	This function draws the arrows for the functions makeArrowDiagonal and makeArrowStraight.
	Parameters:
	arrowOrientation: 0 for straight kind of arrow and 1 for diagonal kind of arrow (determines whether midpoint will be used or not)
	origin, dest : start and end points for arrow (only used in diagonal kinds of arrow, to determine where the midpoint is)
	crumb = breadCrumb the lineRenderer is attached to
	arrowBase, arrowBase2 : game objects used to render the two lines that compose an arrow
	UAX, UAY, UAZ = upperArrow X, Y and Z offsets, respectivelly. Offset of X, Y and Z coordinates to draw upper segment of an arrow
	BAX, BAY, BAZ = bottomArrow X, Y and Z offsets, respectivelly. Offset of X, Y and Z coordinates to draw bottom segment of an arrow
	MX, MY, MZ = midpoint X, Y and Z offsets, respectivelly. Offset of X, Y and Z coordinates to draw bottom segment of an arrow
	color = color of the arrow
*/
private function drawArrow(arrowOrientation : int, origin : Vector3, dest : Vector3, crumb : GameObject, arrowBase : GameObject, arrowBase2 : GameObject, 
	UAX : float, UAY : float, UAZ : float, BAX : float, BAY : float, BAZ : float, MX : float, MY : float, MZ : float, color : Color){
	
	var upperArrow : LineRenderer;
    var bottomArrow : LineRenderer;
   	var midPoint : Vector3;
   	
   	if (arrowOrientation==1){
   		midPoint = Vector3((origin.x + MX), (origin.y + MY), (origin.z + MZ));
   	}
			
	arrowBase.AddComponent.<LineRenderer>();
 	upperArrow = arrowBase.GetComponent(LineRenderer);
 	arrowBase.GetComponent(LineRenderer).SetColors(color, color);
    upperArrow.material = Resources.Load("Materials/BotPathLinearForArrow");
    upperArrow.SetWidth(0.33f, 0.33f);
	
	arrowBase2.AddComponent.<LineRenderer>();
	bottomArrow = arrowBase2.GetComponent(LineRenderer);
	arrowBase2.GetComponent(LineRenderer).SetColors(color, color);
    bottomArrow.material = Resources.Load("Materials/BotPathLinearForArrow");
    bottomArrow.SetWidth(0.33f, 0.33f);

	if (arrowOrientation == 1){
		upperArrow.SetPosition(0, Vector3((midPoint.x + UAX), (midPoint.y + UAY), (midPoint.z + UAZ)));
		upperArrow.SetPosition(1, midPoint);
		bottomArrow.SetPosition(1, midPoint);
		bottomArrow.SetPosition(0, Vector3((midPoint.x + BAX), (midPoint.y + BAY), (midPoint.z + BAZ)));
   	} else if (arrowOrientation == 0){
   		upperArrow.SetPosition(0, Vector3((dest.x+UAX), (dest.y+UAY), (dest.z + UAZ)));
    	upperArrow.SetPosition(1, dest);
    	bottomArrow.SetPosition(1, dest);
    	bottomArrow.SetPosition(0, Vector3((dest.x + BAX), (dest.y + BAY), (dest.z + BAZ)));
   	}
   	
   	var arrow = new Arrow(crumb, arrowBase, arrowBase2, arrowType);
	if(color == Color.white){
    	botArrowList.Add(arrow);
    } else {
    	boxArrowList.Add(arrow);
    }
}

/*
this function creates two gameObjects, each responsible for one segment of the 
lines that compose the arrow. Using only one GO to create two lines results in 
curved bad looking lines.
*/
private function makeArrowStraight(crumb : GameObject, endPoint : Vector3, color : Color){
	
    var arrowBase : GameObject = new GameObject();
    var arrowBase2 : GameObject = new GameObject();
	
	arrowBase.name="UpperArrowSegment";
	arrowBase2.name="BottomArrowSegment";

    if(BotCompass.getInstance().getMovement() == 0){
    	drawArrow(0, Vector3.zero, endPoint, crumb, arrowBase, arrowBase2, 0, 0.1f, -0.3f, 0, -0.1f, -0.3f, 0, 0, 0, color);
    } else if (BotCompass.getInstance().getMovement() == 1){
    	drawArrow(0, Vector3.zero, endPoint, crumb, arrowBase, arrowBase2, 0.3f, 0.1f, 0, 0.3f, -0.1f, 0, 0, 0, 0, color);
    } else if (BotCompass.getInstance().getMovement() == 2){
    	drawArrow(0, Vector3.zero, endPoint, crumb, arrowBase, arrowBase2, 0, 0.1f, 0.3f, 0, -0.1f, 0.3f, 0, 0, 0, color);
    } else if(BotCompass.getInstance().getMovement() == 3){
    	drawArrow(0, Vector3.zero, endPoint, crumb, arrowBase, arrowBase2, -0.3f, 0.1f, 0, -0.3f, -0.1f, -0, 0, 0, 0, color);
    }
}

private function makeArrowDiagonal(crumb : GameObject, origin : Vector3, dest : Vector3, color : Color){

	var arrowBase : GameObject = new GameObject();
    var arrowBase2 : GameObject = new GameObject();
    
    arrowBase.name="UpperArrowSegment";
	arrowBase2.name="BottomArrowSegment";
    
    if (origin.z < dest.z){ //interact with box in position z+1
		if (origin.y < dest.y){ //pick up box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0, -0.1f, -0.2f, 0, -0.2f, -0.1f, 0, 0.5f, 0.5f, color);
		} else { // put down box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0, 0.1f, -0.2f, 0, 0.2f, -0.1f, 0, -0.5f, 0.5f, color);
		}
	} else if (origin.z > dest.z){ //interact with box in position z-1
		if (origin.y < dest.y){ //pick up box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0, -0.2f, 0.1f, 0, -0.1f, 0.2f, 0, 0.5f, -0.5f, color);
		} else { //put down box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0, 0.2f, 0.1f, 0, 0.1f, 0.2f, 0, -0.5f, -0.5f, color);
		}
	
	} else if (origin.x < dest.x){ //interact with box in position x+1
		if (origin.y < dest.y){ //pick up box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, -0.2f, -0.1f, 0, -0.1f, -0.2f, 0, 0.5f, 0.5f, 0, color);
		} else { // put down box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, -0.2f, 0.1f, 0, -0.1f, 0.2f, 0, 0.5f, -0.5f, 0, color);
		}
	} else if (origin.x > dest.x){ //interact with box in position x-1
		if (origin.y < dest.y){ //pick up box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0.1f, -0.2f, 0, 0.2f, -0.1f, 0, -0.5f, 0.5f, 0, color);
		} else { //put down box
			drawArrow(1, origin, dest, crumb, arrowBase, arrowBase2, 0.1f, 0.2f, 0, 0.2f, 0.1f, 0, -0.5f, -0.5f, 0, color);
		}
	}
}

private function getColor( object : GameObject) : Color {
	
	var n : int = 0;
	for(var mov : MovableType in WorldManager.movableList){
		if(mov.obj == object){
			return colorList[n];
		}
		n ++;
	}
}


//GUI buttons
function OnGUI() {
    if (GUI.Button (Rect (20,40,70,64), "Undo")) {
       	undo();
    }
	/*if (GUI.Button (Rect (95,40,110,64), "Click to see\n coordinatesList")) {
       	printCoordinatesList();
    }
    if (GUI.Button (Rect (210,40,90,64), "Click to see\nArrows in list")) {
       	Debug.Log("bot: " + botArrowList.Count + ", boxes: " + boxArrowList.Count);
    }
    if (GUI.Button (Rect (305,40,110,64), "Click to see\nsee MovesList")) {
       	seeMovesList();
    }
    if (GUI.Button (Rect (420,40,110,64), "Click to see\n lastGhostBox\nList")) {
       	seeGhostBoxList();
    }
    if (GUI.Button (Rect (535,40,110,64), "Climber crumb\nelements")) {
       	climberList();
    }
    if (GUI.Button (Rect (650,40,110,64), "Carried Box\nlist")) {
       	showCarried();
    }*/
}

function showCarried(){
	Debug.Log(lastCarriedBoxList.Count);
}

function printCoordinatesList(){
	var n : int = 0;
	for (var pos : Vector3 in coordinatesList){
		Debug.Log("\n Position " + n + ": " + coordinatesList[n]);
		n += 1;
	}
}

function seeMovesList(){
	if (movesList.Count==0) {
		Debug.Log("empty");
	} else {
		for (var i = 0 ; i < movesList.Count ; i++){
			Debug.Log("pos: " + i + " kind of move: " + movesList[i]);
		}
	}
}

function seeGhostBoxList(){
	if (lastGhostBoxList.Count==0) {
		Debug.Log("empty");
	} else {
		for (var i = 0 ; i < lastGhostBoxList.Count ; i++){
			Debug.Log("pos: " + i);
		}
	}
}

function climberList(){
	if (climberCrumbList.Count==0) {
		Debug.Log("empty");
	} else {
		Debug.Log(climberCrumbList.Count);
	}
}

private function undo(){

	if (movesList.Count != 0 && movesList[movesList.Count-1] == 0){ //undo a horizontal move when not carrying a box
		
		movesList.RemoveAt(movesList.Count-1);
		undoArrowHandler(0);
		
		coordinatesList.RemoveAt(coordinatesList.Count-1);
		ghostBot.transform.position = coordinatesList[coordinatesList.Count-1];
		ghostBot.transform.position.y+=1;
 		clickedObjectPos = coordinatesList[coordinatesList.Count-1];
 		oldPos = coordinatesList[coordinatesList.Count-1];
 		
	} else if (movesList.Count != 0 && movesList[movesList.Count-1] == 1){ //undo a horizontal move when carrying a box
		
		movesList.RemoveAt(movesList.Count-1);
		undoArrowHandler(1);
		
		coordinatesList.RemoveAt(coordinatesList.Count-1);
		ghostBot.transform.position = coordinatesList[coordinatesList.Count-1];
		ghostBot.transform.position.y+=1;
 		clickedObjectPos = coordinatesList[coordinatesList.Count-1];
 		oldPos = coordinatesList[coordinatesList.Count-1];
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position = coordinatesList[coordinatesList.Count-1];
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position.y+=2;

	} else if (movesList.Count != 0 && movesList[movesList.Count-1] == 2){ //undo pick up move
	
		movesList.RemoveAt(movesList.Count-1);
	
		//return carried box to previous position before pick up, remove from the last picked up box queue.
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position = lastGhostBoxList[lastGhostBoxList.Count-1].transform.position;
		lastCarriedBoxList.RemoveAt(lastCarriedBoxList.Count-1);
		
		//player is no longer carrying a box
		carryingBox=false;
		
		//delete last arrow type 2 on list (from box pick-up)
		undoArrowHandler(2);	
			
		//delete last ghost box on list
		
		GameObject.Destroy(lastGhostBoxList[lastGhostBoxList.Count-1]);
		//lastGhostBoxList[lastGhostBoxList.Count-1].renderer.material.color.a=0;
		lastGhostBoxList.RemoveAt(lastGhostBoxList.Count-1);
		
		//sets collision in old box position to true again
		WorldManager.block[WorldManager.WorldToBlocks(boxCarried.transform.position).x , WorldManager.WorldToBlocks(boxCarried.transform.position).y , 
		WorldManager.WorldToBlocks(boxCarried.transform.position).z].hasCollision = true;

	} else if (movesList.Count != 0 && movesList[movesList.Count-1] == 3){ //undo put down move
	
		movesList.RemoveAt(movesList.Count-1);
		undoArrowHandler(2);	
		
		//set collision back to false on box's old position
		WorldManager.block[WorldManager.WorldToBlocks(lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position).x , WorldManager.WorldToBlocks(lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position).y, 
		WorldManager.WorldToBlocks(lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position).z].hasCollision = false;
		
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position = coordinatesList[coordinatesList.Count-1];
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position.y+=2;
		//player is carrying box again
		carryingBox =true;
		
	} else if(movesList.Count != 0 && movesList[movesList.Count-1] == 4){ //undo a climb up or climb down move when not carrying a box
	
		movesList.RemoveAt(movesList.Count-1);
		undoArrowHandler(0);
		
		coordinatesList.RemoveAt(coordinatesList.Count-1);
		ghostBot.transform.position = coordinatesList[coordinatesList.Count-1];
		ghostBot.transform.position.y+=1;
 		clickedObjectPos = coordinatesList[coordinatesList.Count-1];
 		oldPos = coordinatesList[coordinatesList.Count-1];
		
		GameObject.Destroy(climberCrumbList[climberCrumbList.Count - 1]);
		climberCrumbList.RemoveAt(climberCrumbList.Count -1);
		
	} else if(movesList.Count != 0 && movesList[movesList.Count-1] == 5){ //undo a climb up or climb down move when carrying a box
		
		movesList.RemoveAt(movesList.Count-1);
		undoArrowHandler(1);
		
		coordinatesList.RemoveAt(coordinatesList.Count-1);
		ghostBot.transform.position = coordinatesList[coordinatesList.Count-1];
		ghostBot.transform.position.y+=1;
 		clickedObjectPos = coordinatesList[coordinatesList.Count-1];
 		oldPos = coordinatesList[coordinatesList.Count-1];
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position = coordinatesList[coordinatesList.Count-1];
		lastCarriedBoxList[lastCarriedBoxList.Count-1].transform.position.y+=2;
		
		GameObject.Destroy(climberCrumbList[climberCrumbList.Count - 1]);
		climberCrumbList.RemoveAt(climberCrumbList.Count - 1);
		GameObject.Destroy(climberCrumbList[climberCrumbList.Count - 1]);
		climberCrumbList.RemoveAt(climberCrumbList.Count - 1);
	}
	
}

/*
function to handle arrow deletion
type 0 indicates delete bot movement arrow
type 1 indicates delete bot movement with box arrow above and
type 2 and 3 indicate delete diagonal arrow */
private function undoArrowHandler(moveType : int){

	var arrow : Arrow;
	var i : int;
	
	if(moveType == 0){
		
		arrow = botArrowList[botArrowList.Count-1]; 
		botArrowList.RemoveAt(botArrowList.Count-1);
		arrow.destroy();
			
	} else if(moveType == 1){
		
		arrow = botArrowList[botArrowList.Count-1]; 
		botArrowList.RemoveAt(botArrowList.Count-1);
		arrow.destroy();
		
		for (i = boxArrowList.Count-1 ; i > -1 ; i--){
		
			if (boxArrowList[i].getArrowType() == 1){
				arrow = boxArrowList[i];
				arrow.destroy();
				boxArrowList.RemoveAt(i);
				break;
			}
		}
		
	} else if(moveType == 2){
		
		for (i = boxArrowList.Count-1 ; i > -1 ; i--){
		
			if (boxArrowList[i].getArrowType() == 2 || boxArrowList[i].getArrowType() == 3){
				arrow = boxArrowList[i];
				arrow.destroy();
				boxArrowList.RemoveAt(i);
				break;
			}
		}
	}
}

class Arrow{
	
	var breadCrumb : GameObject;
	var upperArrowSegment : GameObject;
	var bottomArrowSegment : GameObject;
	
	/*0 for bot arrow, 1 for box level arrow, 2 for box pick up arrow and 3 for box put down arrow. Depending on the
	move to be deleted, if the arrow is a pick up type it means that the 
	box that was taken from that position shall be replaced*/
	var type : int; 
	
	function Arrow(breadCrumb : GameObject, uas : GameObject, bas : GameObject, type : int){
		this.breadCrumb = breadCrumb;
		this.upperArrowSegment = uas;
		this.bottomArrowSegment = bas;
		this.type = type;
	}
	
	function getArrowType(){
		return this.type;
	}
	
	function destroy(){
		GameObject.Destroy(this.breadCrumb);
		GameObject.Destroy(this.upperArrowSegment);
		GameObject.Destroy(this.bottomArrowSegment);
	}

}