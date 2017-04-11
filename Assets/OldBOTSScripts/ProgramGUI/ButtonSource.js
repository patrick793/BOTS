//ButtonSource
//Holds information about an instruction
//Clicking it creates a new instruction button to be dragged into the workspace
//Last Modified June 24 2010 - Drew Hicks

class ButtonSource
{
	var MAX_COPIES : int = 10;
	var location : Rect;
	var icon: Texture2D;
	var index: int;
	
	var parentSpace : Workspace;
	
	var pos : Point;
	var offset = new Point(0,0);
	var copies : int;
	
	var title : String;
	var isActive : boolean;
	var hasContent : boolean;
	
	var style : String;
	
	var moreInfo : Content = new Content();
	
	var clickDisable = false;
	var clickTime: double;
	var clickLoc: Point;
	var doubleClickTime : double = 0.3;
	
	function ButtonSource(xy : Point, width : int, height : int, my_space : Workspace, my_icon : Texture2D, i: int, style : String)
	{
		icon = my_icon;
		index = i;
		Init(xy, width, height, my_space);
		copies = MAX_COPIES;
		this.style = style;
		
	}
	
	function ButtonSource(xy : Point, width : int, height : int, my_space : Workspace, my_text : String, i: int, style : String)
	{
		title = my_text;
		moreInfo.SetName(title);
		index = i;
		Init(xy, width, height, my_space);
		copies = MAX_COPIES;
		this.style = style;
	}
	
	function ButtonSource(xy : Point, width : int, height : int, my_text : String, style : String)
	{
		title = my_text;
		moreInfo.SetName(title);
		SetRectangle(xy,width,height);
		isActive = false;
		copies = MAX_COPIES;
		this.style = style;
	}
	
	function ButtonSource(xy : Point, width : int, height : int, my_icon : Texture2D, my_text : String, style : String)
	{
		icon = my_icon;
		title = my_text;
		moreInfo.SetName(title);
		SetRectangle(xy,width,height);
		isActive = false;
		copies = MAX_COPIES;
		this.style = style;
	}
	
	function Init(xy : Point, width : int, height : int, my_space : Workspace)
	{
		SetRectangle(xy,width,height);
		isActive = false;
		moreInfo.SetDescription("Default description of whatever this button does");
		moreInfo.SetTargetIndex(index);
		hasContent = true;
		parentSpace = my_space;
	}
	
	function GetContent() : Content
	{
		return moreInfo;
	}
	
	function SetContentDescription(d : String)
	{
		moreInfo.SetDescription(d);
	}
	
	function SetContentName(v: String)
	{
		moreInfo.SetName(v);
		hasContent = true;
	}
	
	function GetInfoString() : String
	{
		var info : String = "";
		try{
			info += "Name: "+moreInfo.GetName() +"\n\n"; 
		}catch(Error) {};
		try{
			 info += "Description: " + moreInfo.GetDescription() + "\n\n";
		}
		catch(Error) {};
		
		return info;
	}
	
	function SetMax(m : int) {
		if (m > 0) {
			copies = m;
		}
	}
	
	function Display(): boolean
	{
		/*//Button Pressed 
		if(!isActive && Draw(true))
		{
			isActive = true;
			return true;
		}//Button no longer pressed
		else if(isActive && !Input.GetMouseButton(0)){
			isActive = false;
		}

		Draw(false);
		return false;	*/
		
		var mouseDown = Input.GetMouseButton(0);
		if (!mouseDown)
		{
			Draw(true);
			clickLoc = null;
			clickDisable = false;
			return false;			
		}
		else if (mouseDown)
		{
			if (Draw(true))
			{
				if(!clickLoc)
				{
					if (!clickDisable && (Time.time - clickTime) < doubleClickTime && moreInfo.GetInstructionType() == INSTRUCTION_TYPE.FUNCTION_STRUCT) //see if i double clicked
            			parentSpace.parentGUI.ShowButtonSpace( new DraggableButton(new Point(-100,-100), 55, 55, icon, moreInfo.Clone(), style) );
					
					clickLoc = new Point( Input.mousePosition.x,  Input.mousePosition.y);
					clickTime = Time.time;
				}

			}
			
			if (clickLoc)
			{
				curMouse = new Point( Input.mousePosition.x,  Input.mousePosition.y);
				
				if (clickLoc.DistanceSqFrom(curMouse) >= 100 && !clickDisable) 
				{
					clickLoc = null;
					clickDisable = true;					
					return true;
				}
			}
			return false;
		}
		return false;
	}
	
	function Draw(repeat : boolean) : boolean
	{
		if (repeat)
		{
			if (icon != null)
				return GUI.RepeatButton(location,icon,style);
			else
				return GUI.RepeatButton(location,title,style);
		}
		else
		{
			if (icon != null)
				return GUI.Button(location,icon,style);
			else
				return GUI.Button(location,title,style);
		}
		
	}
	
	function SetRectangle(topLeft : Point, width : int, height : int)
	{
		pos = topLeft;
		location = Rect (pos.X,pos.Y,width,height); 
	}
		
	public function CopyButton() : DraggableButton
	{
		/*if (!parentSpace.parentGUI.isTutorialLevel && 
		parentSpace.parentGUI.levelInstructions.GetButtonIndex(parentSpace.parentGUI.buttonControl) != index)
			return null;*/
		
		var myButton : DraggableButton;
		if (icon != null)
			myButton = new DraggableButton(pos, 55, 55, icon, moreInfo.Clone(), style);
		else 
			myButton = new DraggableButton(pos, 55, 55, title, moreInfo.Clone(), style);
		
		myButton.offset.X = Input.mousePosition.x - (parentSpace.parentGUI.tabs_group.x + location.x);
		myButton.offset.Y = (Screen.height - Input.mousePosition.y)- (parentSpace.parentGUI.tabs_group.y + location.y);
//		Debug.Log(location);
		copies--;	
		
		myButton.SetPPI(index);

		myButton.SetWorkspace(parentSpace, -1); 
		myButton.moreInfo.SetTargetIndex(parentSpace.parentGUI.NewButtonSpace(this));
		//Debug.Log("my original target is" + index);	

		return myButton;	
	}
	
	function CopyButton(height : int, width : int) : DraggableButton
	{
		/*if (!parentSpace.parentGUI.isTutorialLevel && 
		parentSpace.parentGUI.levelInstructions.GetButtonIndex(parentSpace.parentGUI.buttonControl) != index)
			return null;*/
		
		var myButton : DraggableButton;
		if (icon != null)
			myButton = new DraggableButton(pos, height, width, icon, moreInfo.Clone(), style);
		else 
			myButton = new DraggableButton(pos, height, width, title, moreInfo.Clone(), style);
		
		myButton.offset.X = Input.mousePosition.x - (parentSpace.parentGUI.tabs_group.x + location.x);
		myButton.offset.Y = (Screen.height - Input.mousePosition.y)- (parentSpace.parentGUI.tabs_group.y + location.y);
//		Debug.Log(location);
		copies--;	
		
		myButton.SetPPI(index);

		myButton.SetWorkspace(parentSpace, -1); 
		myButton.moreInfo.SetTargetIndex(parentSpace.parentGUI.NewButtonSpace(this));
		//Debug.Log("my original target is" + index);	

		return myButton;	
	}
	
	function Attach()
	{
	}
	
	function GetWorkspace() : Workspace
	{
		return parentSpace;
	}
	
	function IsHovered(group_pos : Vector2)
	{
		var newRect = new Rect(location.x + group_pos.x, location.y + group_pos.y, location.height, location.width);
		return newRect.Contains(new Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y));
	}
}