//DraggableButton - represents the click+drag buttons for instructions, variables, functions, etc.
//Last modified by Drew Hicks 2/1/2013

class DraggableButton
{
	var location : Rect; //location at which the button wuill be drawn
	var pos = new Point(0,0); //top-left corner of location as a point (should be removed)
	
	var parentSpace : Workspace; //current parent Workspace object that contains the button
	var oldParentSpace : Workspace; //previous parent Workspace object
	var container_index : int; //index of the button within its parent Workspace
	
	var parent_piece_index : int; //index of the ButtonSource which spawned this button
	
	var posSlide : Point; //position of Slider/Bracket (if any)
	var oldSlide : Point; //old position of Slider/Bracket (if any)
	
	var offset = new Point(0,0); //offset of the button (texture dependent)
	var slideSet = new Point(0,0); //offset of the slider (texture dependent)

	var title : String; //text to be written on the button
	var style : String = "button"; //GUI Style with which to draw the button
	var icon: Texture2D; //icon to draw on the button, if any
	var moreInfo : Content;	 //info to show in the tooltip for this button
	
	var isOnMouse : boolean; //is this attached to the pointer?
	var dragSlider : boolean; //is the slider attached to the pointer?
	var sliderSet : boolean; //has the slider been drawn yet?
	
	var members : int = 1; //if there is a slider/bracket, 
	//how far from this button is it, in terms of indices in the parent workspace
	
	var clickTime: double; //doubleclick hack, might be unneeded now
	var clickLoc: Point; //doubleclick hack, might be unneeded now
	var doubleClickTime : double = 0.3; // doubleclick hack, might be unneeded now

	var windowID : int = -1; //if this button has a window (function, operator, variable), which window is it
	
	//var rightBracketOffset : int = 15; //magic number, please ignore
	var rightBracketOffset : int = 15; //magic number, please ignore
	var isFromLoad : boolean = false; //is this button loaded from a previous solution?
	
	//constructor with icon
	function DraggableButton(xy : Point, width : int, height : int, my_icon: Texture2D, myInfo : Content, style: String)
	{
		icon = my_icon;
		moreInfo = myInfo;
		pos = xy;
		SetRectangle(xy,width,height);
		isActive = false;
		isOnMouse = true;
		hasContent = true;
		dragSlider = false;
		sliderSet = false;
		shadeColor = Color.cyan + Color(0.02*pos.X, 0.03*pos.Y, 0.04, 0.5);
		this.style = style;		
		
	}
	
	//constructor with text
	function DraggableButton(xy : Point, width : int, height : int, my_text: String, myInfo : Content, style: String)
	{
		title = my_text;
		moreInfo = myInfo;
		pos = xy;
		
		SetRectangle(xy,width,height);
		isActive = false;
		isOnMouse = true;
		moreInfo.SetName(my_text);
		hasContent = true;
		dragSlider = false;
		sliderSet = false;
		shadeColor =  Color.cyan + Color(0.02*pos.X, 0.03*pos.Y, 0.04, 0.5);
		this.style = style;	
	
	}
	
	//functions to access the position of this button
	function GetPosX()
	{
	 	return pos.X;
	}	
	function GetPosY()
	{
	 	return pos.Y;
	}
	
	//access the moreInfo of this button
	function GetContent()
	{
		return moreInfo;
	}
	
	//get and set the parent of this button (only called by parent... why isn't this in the constructor?
	function SetPPI(ppi : int)
	{
		parent_piece_index = ppi; 
	}
	function GetPPI()
	{
		return parent_piece_index; 
	}
	
	//here to change the position
	function SetPosition(topLeft: Point)
	{
		pos = topLeft;
		location = new Rect (pos.X,pos.Y,location.width,location.height); 		
	}
	//or here to change the SIZE of the button
	function SetRectangle(topLeft : Point, width : int, height : int)
	{
		pos = topLeft;
		location = Rect (pos.X,pos.Y,width,height); 
	}
	
	//changes the parent workspace
	function SetWorkspace(newSpace : Workspace, placement : int)
	{
		if(parentSpace != null)
			oldParentSpace = parentSpace;
			
		parentSpace = newSpace;
		container_index = placement;
	}
	
	//returns the parent workspace
	function GetWorkspace() : Workspace
	{
		return parentSpace;
	}
	
	//sets the corresponding window ID
	function SetWindowID(id : int )
	{
		windowID = id;
	}
	
	//sets the position of the slider/bracket
	function SetPosSlide(posX : int, posY : int, fromLoad : boolean)
	{
		posSlide = new Point(parseInt(posX - rightBracketOffset), parseInt(posY));
		
		slideSet = new Point(parseInt(posX), parseInt(posY));
		
		members = parentSpace.IsLegalDrop(posSlide);
		if(fromLoad)
		{
			isFromLoad = true;
			sliderSet = true;
			dragSlider = false;
			oldSlide = new Point(parseInt(posX), parseInt(posY));
			posSlide.X = parentSpace.containers[members].X + 43;
			posSlide.Y = parentSpace.containers[members].Y - 10;

		}
	}
	
	//function uses UNITY GUI to draw on the screen; Doing so, we return the 
	function Draw(repeat : boolean) : boolean
	{
		//Debug.Log("repeat: "+repeat);
		if (repeat)
		{
			if (icon != null)
			{
				return GUI.RepeatButton(location,icon, style);
			}
			else
			{
				return GUI.RepeatButton(location, title, style);
			}
		}
		else
		{
			if (icon != null)
			{
				return GUI.Button(location,icon, style);
			}
			else
			{
				return GUI.Button(location,title, style);
			}
		}
	}	
	
	//the update-loop for the button		
	function Display()
	{
		//if I am not in a workspace, I should not draw
		if(parentSpace == null)
			return;
		
		//doubleclick hack - may be unneeded now	
		mouseDown = Input.GetMouseButton(0);

		if (!mouseDown)
		{
			Draw(true);
			if(clickLoc)
			{
				clickLoc = null;
			}
			
			if (isOnMouse)
			{
				isOnMouse = false;
				parentSpace.Drop(this);
				CheckSlider();
			}
		}
		else if(!isOnMouse) //if the button is not being held
		{
			if (Draw(true) && mouseDown)
			{
				if(!clickLoc)
				{
					if ((Time.time - clickTime) < doubleClickTime) //see if i double clicked
            			parentSpace.parentGUI.ShowButtonSpace(this);
					
					clickLoc = new Point( Input.mousePosition.x,  Input.mousePosition.y);
					clickTime = Time.time;
				}
			}
			
			if (clickLoc)
			{
				curMouse = new Point( Input.mousePosition.x,  Input.mousePosition.y);
				
				if (clickLoc.DistanceSqFrom(curMouse) >= 100 && parentSpace.PickUp(this)) 
				{
					isOnMouse = true;
					offset.X = MouseInput.GetPosition().X - pos.X;
					offset.Y = MouseInput.GetPosition().Y - pos.Y;
				}
			}
			
		}
		else if (isOnMouse)
		{
			SetPosition(new Point(MouseInput.GetPosition().X - offset.X, MouseInput.GetPosition().Y - offset.Y));
			Draw(false);
			
			//fix for mac/windows mouse incompatibilities
			if (!Input.GetMouseButton(0))
			{
				isOnMouse = false;
				parentSpace.Drop(this);
				CheckSlider();
			}
		}
	}
		
	function Display(xOffset : int, yOffset : int)
	{
		mouseDown = Input.GetMouseButton(0);
		if (!mouseDown)
		{
			
			Draw(true);
			if(clickLoc)
			{
				Debug.Log("mouse up!");
				clickLoc = null;
			}
			
			if (isOnMouse)
			{
				isOnMouse = false;
				parentSpace.Drop(this);
				
				if(!sliderSet){
					SetPosSlide(pos.X+54+location.width, pos.Y-10, false);
					sliderSet = true;
					
				}

				CheckSlider();
			}
		}
		
		else if(!isOnMouse) //if the button is not being held
		{
			if (Draw(true) && mouseDown)
			{
				
				if(!clickLoc)
				{
					
					if ((Time.time - clickTime) < doubleClickTime) //see if i double clicked
            			parentSpace.parentGUI.ShowButtonSpace(this);
					clickLoc = new Point(Input.mousePosition.x,  Input.mousePosition.y);
					clickTime = Time.time;
				}
			}
			
			if (clickLoc)
			{
				curMouse = new Point( Input.mousePosition.x,  Input.mousePosition.y);
				
				if (clickLoc.DistanceSqFrom(curMouse) >= 100 && parentSpace.PickUp(this)) 
				{
					Debug.Log("POP");
					isOnMouse = true;
					offset.X = MouseInput.GetPosition().X - pos.X;
					offset.Y = MouseInput.GetPosition().Y - pos.Y;
				}
			}
			
		}
		
		else if (isOnMouse)
		{
			SetPosition(new Point(MouseInput.GetPosition().X - offset.X-xOffset, MouseInput.GetPosition().Y - offset.Y-yOffset));
			Draw(false);
			if (!Input.GetMouseButton(0))
			{
				
				isOnMouse = false;
				parentSpace.Drop(this);
				
				if(!sliderSet){
					SetPosSlide(pos.X+54+location.width, pos.Y-10, false);
					sliderSet = true;
					
				}
				CheckSlider();
			}
		}
	}
	
	/**
	 * Function needs mouse to button offset fixed
	 */
	function DrawSlider(spacing : int, dif : int, active : boolean)
	{	
		
		GUI.Label(Rect(pos.X+47, pos.Y-10 + dif, 30, 75), "" , "LeftSlider");
		
		if(dragSlider) //removed tutorial restriction
		{	
			GUI.Button(Rect(MouseInput.GetPosition().X - slideSet.X, MouseInput.GetPosition().Y - slideSet.Y+dif, 30, 75), "", "RightSlider_a");
			if (!Input.GetMouseButton(0))
			{
				dragSlider = false;

				SetPosSlide(MouseInput.GetPosition().X - slideSet.X-15, MouseInput.GetPosition().Y - slideSet.Y, false);
				members = parentSpace.IsLegalDrop(posSlide);
				if(members > container_index) 
				{
					posSlide.X = parentSpace.containers[members].X + 43;
					posSlide.Y = parentSpace.containers[members].Y - 10;
				}	
				else 
				{
					SetPosSlide(oldSlide.X, oldSlide.Y, false);
				}
			}
		}
		else
		{
			if(isFromLoad)
			{
				if(GUI.RepeatButton(Rect(posSlide.X, posSlide.Y+dif, 30, 75), "", "RightSlider") && active)
				{
					dragSlider = true;
					slideSet.X = MouseInput.GetPosition().X - posSlide.X;
					slideSet.Y = MouseInput.GetPosition().Y - posSlide.Y;	
					oldSlide = posSlide;		
				}
			}
			else if(GUI.RepeatButton(Rect(posSlide.X, posSlide.Y+dif, 30, 75), "", "RightSlider") && active)
			{
				dragSlider = true;
				slideSet.X = MouseInput.GetPosition().X - posSlide.X;
				slideSet.Y = MouseInput.GetPosition().Y - posSlide.Y;	
				oldSlide = posSlide;		
			}
		}
		
	}
	
	//function corrects the position of the slider after each draw call where the button has been moved.
	function CheckSlider()
	{
		if(parentSpace == null)
			return;
			
		if(!sliderSet){
			SetPosSlide(pos.X+54+location.width, pos.Y-10, true);
			sliderSet = true;
		}
		//Check for if move block below bracket
		if(parentSpace != null && members <= container_index || parentSpace != oldParentSpace)
		{
			members = container_index + 1;
			SetPosSlide(pos.X+54+location.width, pos.Y-10, true);
		}
		
		//Check for bracket at end of row
		if(parentSpace != null && container_index % 5 == 4 && container_index+1 < parentSpace.containers.length && members <= container_index+1)
		{
			//members = container_index + 1;
			posSlide.X = parentSpace.containers[container_index + 1].X + 43;
			posSlide.Y = parentSpace.containers[container_index + 1].Y - 10;
		}
		
		//Check for bracket at end of space
		if(parentSpace != null && container_index == parentSpace.containers.length - 1)
		{
			members = container_index;
			posSlide.X = parentSpace.containers[container_index].X + 43;
			posSlide.Y = parentSpace.containers[container_index].Y - 10;				
		}
	}	
	
	
	
	function ToString() : String
	{
		var append = "";
        var type : INSTRUCTION_TYPE = GetContent().GetInstructionType();
        if (type == INSTRUCTION_TYPE.FUNCTION_STRUCT)
        {
        	append = ", funcspace " + GetContent().GetTargetIndex();
        }
        else if (type == INSTRUCTION_TYPE.VARIABLE)
        {
        	append = ", varvalue " + GetContent().GetTargetIndex();
        }
        else
        {
        	switch (GetContent().GetName())
            {
        		case "for":        		
        			//get whatever loop space
        			//output
        			append = ", loopspace " + GetContent().GetTargetIndex();
        			append += ", rtBracketPos " + (posSlide.X - rightBracketOffset)+ " " + posSlide.Y;
        			break;
//        		case "++":
//        		case "--":
//        		case "+=":
//        		case "-=":
//        		case "=":
//        		case "==":
//        		case ">":
//        		case "<":
				case "while":
        		case "if":
        			append = ", opspace " + GetContent().GetTargetIndex();
        			append += ", rtBracketPos " + posSlide.X + " " + posSlide.Y;
        			break;
        		case "set":
        			//get whatever op space
        			//output
        			append = ", opspace " + GetContent().GetTargetIndex();
        			break;
        		default:
        			append = "";
        			break;
            }
        }
        
		return moreInfo.GetName() + append;
	}
	
		//here to change the position
	function SetRectangle(topLeft: Point)
	{
		pos = topLeft;
		location = new Rect (pos.X,pos.Y,location.width,location.height); 		
	}
}