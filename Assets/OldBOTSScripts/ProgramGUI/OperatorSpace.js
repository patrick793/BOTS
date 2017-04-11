
class OperatorSpace extends Workspace{
		
	var operator : OPERATOR_TYPE;
	var opReturn : OPERATOR_RETURN_TYPE;
	var numberValue : String = "";
	var acceptsOperator : boolean;
	
	function OperatorSpace(name : String, s_x: int, s_y: int, pGUI : ProgramGUI)
	{
		// 1 row, 3 columns, 65 space
		super(name, s_x, s_y, 1, 3, 65, pGUI);
		acceptsOperator = true;
		defaultSet = false;
		//operator = OPERATOR_TYPE.COMP_LT;
	}	
	
	function OperatorSpace(name : String, s_x: int, s_y: int, pGUI : ProgramGUI, OpCode : OPERATOR_TYPE)
	{
		// 1 row, 3 columns, 65 space
		super(name, s_x, s_y, 1, 3, 65, pGUI);
		operator = OpCode;
		InitControlButton();
		acceptsOperator = false;
	
	}
	function OperatorSpace(name : String, s_x: int, s_y: int, pGUI : ProgramGUI, OpCode : OPERATOR_TYPE, canChangeOperator : boolean)
	{
		// 1 row, 3 columns, 65 space
		super(name, s_x, s_y, 1, 3, 65, pGUI);
		operator = OpCode;
		InitControlButton();
		if(canChangeOperator)
			acceptsOperator = true;
		else
			acceptsOperator = false;
	
	}
	
	function InitControlButton ()
	{
		//operator or control statements
		switch (operator) 
		{
			case OPERATOR_TYPE.COMP_GT: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.compGT,">", "orangeTriangle"); opReturn = OPERATOR_RETURN_TYPE.BOOLEAN; break;
			case OPERATOR_TYPE.COMP_LT: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.compLT,"<", "orangeTriangle"); opReturn = OPERATOR_RETURN_TYPE.BOOLEAN; break;
			case OPERATOR_TYPE.COMP_EQ: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.compEQ,"==", "orangeTriangle"); opReturn = OPERATOR_RETURN_TYPE.BOOLEAN; break;
			case OPERATOR_TYPE.ASSIGN_PLUSEQ: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.plusEQ,"+=", "greenTriangle"); opReturn = OPERATOR_RETURN_TYPE.VARIABLE; break;
			case OPERATOR_TYPE.ASSIGN_MINUSEQ: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.minusEQ,"-=", "greenTriangle"); opReturn = OPERATOR_RETURN_TYPE.VARIABLE; break;
			case OPERATOR_TYPE.ASSIGN_EQ: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.equal,"=", "greenTriangle"); opReturn = OPERATOR_RETURN_TYPE.VARIABLE; break;
			case OPERATOR_TYPE.MINUS: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.minus,"- -", "greenTriangle"); opReturn = OPERATOR_RETURN_TYPE.VARIABLE; break;
			case OPERATOR_TYPE.PLUS: buttonList[1] = new ButtonSource(containers[1],55,55, parentGUI.plus,"++", "greenTriangle"); opReturn = OPERATOR_RETURN_TYPE.VARIABLE; break;
			default:
				Debug.Log("Couldnt Initiate Button");
		}		
	}

	function IsLegalDrop(b : DraggableButton, pos : Point)
	{					
		var i;
//		var tempRect = new Rect(160, 30, 100, 100);
		
		i = super.IsLegalDrop(pos);
		
//		if((operator == OPERATOR_TYPE.PLUS || operator == OPERATOR_TYPE.MINUS))
//		{
////			if(!tempRect.Contains(new Vector2(pos.GetX(), pos.GetY())))
//				i = super.IsLegalDrop(pos);
////			else
////				return -1;
//		}
//		else if (operator != OPERATOR_TYPE.PLUS && operator != OPERATOR_TYPE.MINUS)
//		{
//			i = super.IsLegalDrop(pos);
//		}
		
		if(i == 2 && (operator == OPERATOR_TYPE.PLUS || operator == OPERATOR_TYPE.MINUS))
			return -1;
		
		if(i == 1 && ((opReturn == OPERATOR_RETURN_TYPE.VARIABLE && b.style.Contains("greenTriangle")) || (opReturn == OPERATOR_RETURN_TYPE.BOOLEAN && b.style.Contains("orangeTriangle"))))
		{
			if (buttonList[2] != null)
				buttonList[2].parentSpace.Drop();
			else
				return i;
		}
		
		if(i != 1 && b.style.Contains("Circle"))
		{
			return i;
		}
		else 
		{
			return -1;
		}
				
	}
		
	/*
	 * Function displays the workspace for an operator. The container
	 * on the right side can be either a box or a text field.
	 */
	function Display(pieces: GUISkin, active : boolean) 
	{	
		var containerSkin = GUI.skin;
		if (acceptsOperator) { Display2(pieces, containerSkin); return; } 
		//GUI.skin = containerSkin;
		
		TextSanitizer.Numeric();
		
		
		GUI.skin = pieces;
		
		GUI.Box(Rect(containers[0].GetX(), containers[0].GetY(), 55, 55),"", "circleSocket");
		
		if(operator != OPERATOR_TYPE.PLUS && operator != OPERATOR_TYPE.MINUS){
			try{ 
				if(containers[2].GetX() == buttonList[2].GetPosX() && containers[2].GetY() == buttonList[2].GetPosY())
					GUI.Box(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55),"", "circleSocket");	
				else{
					throw "Issue" ;
				}
			}catch(ArgumentOutOfRangeException){
				numberValue = GUI.TextField(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55), numberValue,"circleSocket");
			}
		}
		
		for(var j = 0; j < buttonList.length; j ++)
		{
			try{buttonList[j].Display();}
			catch(Error){}
		}
//		var temp : OPERATOR_TYPE = buttonList[1].moreInfo.GetOperatorType();
//		if(temp == OPERATOR_TYPE.ASSIGN_EQ)
//			GUI.Label(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"", "triangleScrews");
//		else
//			GUI.Label(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"");
		GUI.skin = containerSkin;
	}
	
	/*
	 * Function displays the workspace for a condition button. The container
	 * on the right side can be either a box or a text field. The space also 
	 * has a variable operator.
	 */
	function Display2(pieces: GUISkin, containerSkin: GUISkin)
	{
		TextSanitizer.Numeric();
		
		GUI.skin = pieces;
		
		GUI.Box(Rect(containers[0].GetX(), containers[0].GetY()+offset, 55, 55),"", "circleSocket");
		
		if(opReturn == OPERATOR_RETURN_TYPE.VARIABLE)
		{
			GUI.Box(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"", "triangleSocket");
			SetDefaultOperator(operator, "greenTriangle", 1, this);	
		}
		else
		{
			GUI.Box(Rect(containers[1].GetX(), containers[1].GetY()+offset, 55, 55),"", "triangleSocketInvert");
			SetDefaultOperator(operator, "orangeTriangle", 1, this);	
		}
		
		if(operator != OPERATOR_TYPE.PLUS && operator != OPERATOR_TYPE.MINUS)
		{
			try
			{ 
				if(buttonList[2] != null)//containers[2].GetX() == buttonList[2].GetPosX() && containers[2].GetY() == buttonList[2].GetPosY())
				{
					GUI.Box(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55),"", "circleSocket");	
					numberValue = parentGUI.varValues[buttonList[2].parent_piece_index];
				}
				else
				{
					throw "Issue" ;
				}
			}
			catch(ArgumentOutOfRangeException)
			{
				numberValue = GUI.TextField(Rect(containers[2].GetX(), containers[2].GetY(), 55, 55), numberValue,"circleSocket");
			}
		}
		
		try 
		{			
			operator = buttonList[1].GetContent().GetOperatorType();		
		}
		catch(Error) 
		{ 
			
		}
		
		
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
	
	function ToString() : String
	{
		var output : String = "";
		for(var j = 0; j < buttonList.length; j ++)
        {
            if(buttonList[j] != null)
            {
	            var button = buttonList[j];
	            try
	            {
	            	output += "{" + j + ", " + button.ToString();
	            	output += "}";
	            }catch(Error){ output += "{"+j+", blank}";}   
            }
            else
            {
            	if(j == 2 && numberValue != "")
              	{
              		try
		            {
		            	output += "{" + j + ", numberValue, " + numberValue;
		            	output += "}";
		            }catch(Error){ output += "{"+j+", blank}";}
              	}
            }     
        }
        return output;
	}
	
	function SetOpCode(OpCode : OPERATOR_TYPE)
	{
		operator = OpCode;
		InitControlButton();
		//acceptsOperator = false;
	}
	
	function setNumberValue(aNumberValue : String)
	{
		numberValue = aNumberValue;
	}
	
}