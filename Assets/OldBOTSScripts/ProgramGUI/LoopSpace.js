
class LoopSpace extends Workspace{
		
	var variable_value : String;
	var initValue : String = "0";
	var limitValue : String = "1";
	var op_space : OperatorSpace;
	var math_space : OperatorSpace;
	var default2Set : boolean;
	
	
	function LoopSpace(name : String, s_x: int, s_y: int, pGUI : ProgramGUI)
	{
		// 1 row, 3 columns, 65 space
		super(name, s_x, s_y, 3, 3, 65, pGUI);
		SetDefaultOperator(OPERATOR_TYPE.COMP_LT, "orangeTriangle", 4, this);	
	}
	
	/*
	 * Function displays the workspace for an For Loop. The containers
	 * are for var(x,y,z), condition(<,>,==), & operator(++,--,+=,-=).
	 */
	function Display(pieces: GUISkin, active : boolean)
	{
		var containerSkin = GUI.skin;
		GUI.skin = pieces;
		
		/*GUI.Box(Rect(containers[0].GetX(), containers[0].GetY()+offset, 55, 55),"var", "circleSocket");
		GUI.Box(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"cond", "triangleSocket");
		GUI.Box(Rect(containers[2].GetX(), containers[2].GetY()+offset, 55, 55),"math");*/
			
		GUI.Box(Rect(containers[0].GetX(), containers[0].GetY()+offset, 55, 55),"var", "varDefault");		
		
		//GUI.Box(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"=");
		var p1 : Point = containers[1];
		ButtonSource(containers[1],55,55,parentGUI.equal, "=", "greenTriangle").Display();
		GUI.Box(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"", "triangleScrews");
		 
		//GUI.Label(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"");
				
		//GUI.Box(Rect(containers[2].GetX(), containers[2].GetY()+offset, 55, 55),"value", "circleSocket");		
		GUI.Box(Rect(containers[3].GetX(), containers[3].GetY()+offset, 55, 55),"var", "varDefault");
		GUI.Box(Rect(containers[4].GetX(), containers[4].GetY()+offset, 55, 55),"cond", "triangleSocketInvert");
		
			
		
		//GUI.Box(Rect(containers[5].GetX(), containers[5].GetY()+offset, 55, 55),"value", "circleSocket");		
		GUI.Box(Rect(containers[6].GetX(), containers[6].GetY()+offset, 55, 55),"var", "varDefault");		
		GUI.Box(Rect(containers[7].GetX(), containers[7].GetY()+offset, 55, 55),"math", "triangleSocket");
		
		if(!default2Set){
			defaultSet = false;
			SetDefaultOperator(OPERATOR_TYPE.PLUS, "greenTriangle", 7, this);
			default2Set = true;
		}
		
		CheckTextFields();
		
		
		for(var j = 0; j < buttonList.length; j ++)
		{
			try{
				buttonList[j].SetRectangle(new Point(containers[j].GetX(), containers[j].GetY()+offset));
				buttonList[j].Display();
				buttonList[j].SetRectangle(new Point(containers[j].GetX(), containers[j].GetY()));
			}catch(Error){}
		}
		GUI.skin = containerSkin; 
	}
	
	function CheckTextFields()
	{	    
	    TextSanitizer.Numeric();
	    
		try{ 
			if(initValueIsVariable())
				GUI.Box(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55),"value", "circleSocket");	
			else{
				throw "Issue" ;
			}
		}catch(ArgumentOutOfRangeException){
			var tempString = initValue;
			initValue = GUI.TextField(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55), initValue, 3, "circleSocket");
			if((initValue.Split("-"[0]).length > 1 && initValue[0] != "-"[0]) || initValue.Split("-"[0]).length > 2)
				initValue = tempString;
		}
			
		try{ 
			if(limitValueIsVariable())
				GUI.Box(Rect(containers[5].GetX(), containers[5].GetY(), 55, 55),"value", "circleSocket");
			else{
				throw "Issue" ;
			}
		}catch(ArgumentOutOfRangeException){
			tempString = limitValue;
			limitValue = GUI.TextField(Rect(containers[5].GetX(), containers[5].GetY(), 55, 55), limitValue, 3, "circleSocket");
			if((limitValue.Split("-"[0]).length > 1 && limitValue[0] != "-"[0]) || limitValue.Split("-"[0]).length > 2)
				limitValue = tempString;
		}
	}
	
	function setInformation()
	{
		try {
			if (buttonList[0] != null)
				variable_value = parentGUI.varValues[buttonList[0].GetPPI()];
			else
				variable_value = "0";
				
				
			if (buttonList[4] != null)
				op_space = parentGUI.opSpaces[buttonList[4].GetContent().GetTargetIndex()];
			else
				op_space = parentGUI.opSpaces[7];
				
				
			if (buttonList[7] != null)
				math_space = parentGUI.opSpaces[buttonList[7].GetContent().GetTargetIndex()];
			else
				math_space = parentGUI.opSpaces[0];
				
				
//			op_space = parentGUI.opSpaces[buttonList[1].GetContent().GetTargetIndex()];
//			math_space = parentGUI.opSpaces[buttonList[2].GetContent().GetTargetIndex()];
		} 
		catch (Error) {
//			Debug.Log("Info not set");
		}
	}
	
	function setInitValue(aInitValue : String)
	{
		initValue = aInitValue;
	}
	
	function setLimitValue(aLimitValue : String)
	{
		limitValue = aLimitValue;
	}
	
	function IsLegalDrop(b : DraggableButton, pos : Point)
	{
		var i = super.IsLegalDrop(pos);
		if(i == -1 || i == 1)
		{
			return -1;
		}
		else if( b.style.Contains("Circle") && (i == 4 || i == 7))
		{
			return -1;
		}
		else if(i == 7 && !b.style.Contains("greenTriangle"))
		{
			return -1;
		}
		else if( i == 4 && !b.style.Contains("orangeTriangle"))
		{
			return -1;
		}
		else if ((i!= 4 && i != 7) && !b.style.Contains("Circle"))
		{
			return -1;
		}
		
		else
			return i;		
		
	}
	
	function initValueIsVariable() : boolean
	{
		try
		{
			//return containers[2].GetX() != buttonList[2].GetPosX() || containers[2].GetY() != buttonList[2].GetPosY();
			return (buttonList[2] != null);
		}
		catch (e)
		{
			return false;
		}
	}
	
	function limitValueIsVariable() : boolean
	{
		try
		{
			//return containers[5].GetX() != buttonList[5].GetPosX() || containers[5].GetY() != buttonList[5].GetPosY();
			return (buttonList[5] != null);
		}
		catch (e)
		{
			return false;
		}
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
            else
            {
            	if(j == 2)
              	{
              		try
		            {
		            	output += "{" + j + ", initValue, " + initValue;
		            	output += "}";
		            }catch(Error){ output += "{"+j+", blank}";}
              	}
              	else if(j == 5)
              	{
              		try
		            {
		            	output += "{" + j + ", limitValue, " + limitValue;
		            	output += "}";
		            }catch(Error){ output += "{"+j+", blank}";}
              	}
            }  
        }
        return output;
	}
	
			
}