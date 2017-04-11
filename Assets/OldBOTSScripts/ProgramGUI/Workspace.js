class Workspace {
        
    var parentGUI : ProgramGUI;
    
    var scopeStyle : String  = "level1";
    var containers : Array;
    public var buttonList : Array;
    
    var start_x : int;
    var start_y : int;
    var offset : int = 0;
    var rows : int;
    var cols : int;
    var spacing : int;
    var defaultSet: boolean;
    public var name : String;
    var pointer : InstructionPointer;
    
    function Workspace(spaceName: String, s_x: int, s_y: int, rs: int, cs: int, space: int, pGUI : ProgramGUI)
    {
        start_x = s_x;
        start_y = s_y;
        rows = rs;
        cols = cs;
        spacing = space;
        name = spaceName;
        
        containers = new Array();
        buttonList = new Array();
        InitContainers();       
        parentGUI = pGUI;
    }
    
    function InitContainers()
    {
        var counter = 0;
        for( var i = 0; i < rows; i++)
        {
            for(var j = 0; j < cols; j++)
            {
                containers.push(new Point(start_x + j*spacing, start_y + i*(spacing+10)));
                buttonList[counter] = null;
                counter++;
            }
        }               
    }
    
    function ButtonCount()
    {
    	var count = 0;
    	for(var i = 0; i < buttonList.length; i++)
    	{
    		if(buttonList[i] != null)
    		{
    			count++;
    		}
    	}
    	return count;
    }
    
    function AddButton( newButton : DraggableButton, pos : int ) : DraggableButton
    {       
        if(!newButton)
        	return;
        	
        newButton.SetPosition(containers[pos]);
        buttonList[pos] = newButton;            
        
        for(var t = 0; t<buttonList.length; t++)
        {
            try{
                buttonList[t].Display();
            }catch(ArrayIndexOutOfBoundError){
            }
        }
        var output : String = name + " " + pos + " contains " + newButton.moreInfo._name;
//        Debug.Log(output);
        parentGUI.AddStringToLog(output);
        
        return newButton;
    }
    
    function Display(pieces: GUISkin, active : boolean) 
    {       
        oldskin = GUI.skin;
        GUI.skin = pieces;
        for(var i = 0; i < containers.length; i ++)
        {
        	GUI.Box(Rect(containers[i].GetX(), containers[i].GetY()+offset, 55, 55),"");
        }                            
        
        for(var j = 0; j < buttonList.length; j ++)
        {
            var button : DraggableButton = buttonList[j];
            try
            {
                //SetRectangle is for moreInfo purposes generally ignorable
                //button.SetPosition(new Point(containers[j].GetX(), containers[j].GetY()+offset));
                button.SetPosition(new Point(containers[j].GetX(), containers[j].GetY()));
                button.Display();
                
                //Display sliders
                if(button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.BRANCH_STRUCT)
                {
                    button.DrawSlider(spacing, offset, active);
                }
                else if(button.GetContent().GetInstructionType() == INSTRUCTION_TYPE.LOOP_STRUCT)
                {
                    button.DrawSlider(spacing, offset, active);
                }
                    
            }catch(Error){}
        }
        GUI.skin = oldskin;           
    }
  
    function SetInstPoint(depth : int)
    {
    	pointer = new InstructionPointer(buttonList, depth);
    }
    
    function ExecuteNextInstruction(depth : int) : String
    {
        var output : String = "";
        //do any memory operations associated with the instruction (such as math, or changing the next instruction)
        //then, get the robot action associated with the instruction (if any) and store it in result
        var result : String = pointer.ExecuteInstruction();
        
        return result;
    }

	//this is only used when executing an entire workspace as one action
	//essentially, only used for Functions
	function ExecuteWorkspace(depth : int) : String
    {
        var output : String = "";
        var pointer : InstructionPointer = new InstructionPointer(buttonList, depth);

        while (!pointer.IsComplete())
        {
            var result : String = pointer.ExecuteInstruction();
            if(result.Contains("Error"))
            {
                return result;
            }
            else
            {
                output += result;
            }
        }
        return output;

    }
    
    function PickUp(button : DraggableButton) : boolean
    {
        if (parentGUI.PickUp(button))
        {
            try
            {
                    buttonList[button.container_index] = null;
            }catch(Error)
            {
                    Debug.Log("Error: PickUp could not find the container index " + button.container_index +" specified.");
            }
            parentGUI.AddStringToLog("name " + button.container_index + " is empty.");
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function Drop(button : DraggableButton) : boolean
    {
        if (parentGUI.Drop(button))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function IsLegalDrop(pos : Point)
    {
        var max_distance = 100;
        var distances = new Array();
        for(var i = 0; i < containers.length; i++) 
        {
        	//Debug.Log("Mouse: "+pos.X + ", "  +pos.Y + 
        	 //" Valid Location: " + containers[i].X + ", " + containers[i].Y);
            var dx = Mathf.Pow(pos.X-containers[i].X, 2);
            var dy = Mathf.Pow(pos.Y-containers[i].Y, 2);   
            var dist = Mathf.Sqrt(dx + dy);
            distances[i] = dist;
        }
        
        var cheapest_index = 0;
        var cheapest_move = distances[0];
        for(var j = 0; j < distances.length; j++)
        {
            if(cheapest_move > distances[j])
            {
                cheapest_move = distances[j];
            	cheapest_index = j;
            }
        }
        
        if (cheapest_move <= max_distance && !isFull(cheapest_index))
        {
            return cheapest_index;
        }
        return -1;
    }

    function isFull(index : int) : boolean
    {
        try
        {
            if(buttonList[index])
            {
                var button : DraggableButton = buttonList[index];
                return false;
            }
        }
        catch(InvalidCastException) 
    	{
            return true;
    	}
        return false;
    }
    
    /* this default button does not have an inside space as other operators do.  
	 * currently the default is only used in ifs and while loops which don't 
	 * look at the inner space.
	 * Default set to Less than button.
	 */
		
	function SetDefaultOperator( o: OPERATOR_TYPE, s : String, pos : int, w : Workspace)
	{
		if(defaultSet)
		{
			return;
		}		
		var t: Texture2D;
		var c: Content;
		switch(o)
		{			
			case OPERATOR_TYPE.COMP_GT: 
				t = parentGUI.compGT; 
				c = new Content(">");
				break;
			case OPERATOR_TYPE.COMP_LT: 
				t = parentGUI.compLT;
				c = new Content("<");	
				break; 
			case OPERATOR_TYPE.COMP_EQ: 
				t = parentGUI.compEQ;
				c = new Content("==");		
				break; 
			case OPERATOR_TYPE.ASSIGN_PLUSEQ: 
				t = parentGUI.plusEQ; 
				c = new Content("+=");	
				break;
			case OPERATOR_TYPE.ASSIGN_MINUSEQ: 
				t = parentGUI.minusEQ; 
				c = new Content("-=");
				break;
			case OPERATOR_TYPE.ASSIGN_EQ: 
				t = parentGUI.equal; 
				c = new Content("=");
				break;
			case OPERATOR_TYPE.MINUS: 
				t = parentGUI.minus; 
				c = new Content("--");
				break;
			case OPERATOR_TYPE.PLUS: 
				t = parentGUI.plus;
				c = new Content("++");
				break;
			default: 
//				if(s == "orangeTriangle")
//				{
//					
//				}
//				else if(s == "greenTriangle")
//				{
//				
//				}
//				else
					Debug.Log("I broke");
			break;
		}
		
		c.SetOperatorType(o);
		c.SetInstructionType(INSTRUCTION_TYPE.OPERATOR);
		var button : DraggableButton = AddButton(new DraggableButton(new Point(containers[pos].GetX(), containers[pos].GetY()),55,55, t, c, s), pos);
		//button.SetPPI(-1);
		buttonList[pos].SetWorkspace(w,pos);		
		defaultSet = true;
	}
	
	function ToString() : String
	{
		var output : String = "";
		for(var j = 0; j < buttonList.length; j ++)
        {
            if(buttonList[j] != null)
            {
	            var button : DraggableButton = buttonList[j];
	            try
	            {
	            	output += "{" + j + ", " + button.ToString();
	            	output += "}";
	            }catch(Error){ output += "{"+j+", blank}";}   
            }        
        }
        return output;
	}
}