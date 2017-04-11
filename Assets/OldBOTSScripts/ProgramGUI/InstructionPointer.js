class InstructionPointer{
	var miserableInfiniteLoop = 0;
	var inception = 0;

	var instructions : Array;
	
	var previousInstruction : int;
	var instructionToExecute : int;
	//var nextInstruction : int;
	var instructionsCompleted : boolean = false;
	
	var scope_stack : Array = new Array();
	
	var currentButton : DraggableButton;
	
	function InstructionPointer(inst : Array, depth : int)
	{
		instructions = (inst);		
		inception = depth;
		previousInstruction = 0;
		instructionToExecute = 0;
		AddScope(0,inst.length-1,false);
		
		currentButton = instructions[instructionToExecute];
		instructionsCompleted = false;
	}
	
	function MovePointer(index : int)
	{
		previousInstruction = instructionToExecute;
		instructionToExecute = index;
	}
	
	function AddScope(startIndex : int, endIndex : int, isLoop : boolean)
	{
		if (scope_stack.length < 100)
			scope_stack.Push(new Scope(startIndex,endIndex,isLoop));
	}
	
	function AddScope(me : Scope)
	{
		if (scope_stack.length < 100)
			scope_stack.Push(me);
	}
	
	function RemoveScope()
	{
		scope_stack.pop();
	}
	
	function GetScope() : Scope
	{
		return scope_stack[scope_stack.length - 1];
	}
	
	function IsInLoop() : boolean
	{
		return scope_stack[scope_stack.length - 1].Loop;
	}
	
	function GetNextInstruction()
	{		
		if (GetScope().End > instructionToExecute)
		{
			MovePointer( instructionToExecute + 1 );
		}
		else if (IsInLoop())
		{
			MovePointer( GetScope().Begin );
		}
		else
		{
			MovePointer( instructionToExecute + 1 );
		}
		//currentButton = instructions[instructionToExecute];
	}
	
	function ExecuteInstruction() : String
	{
		if(miserableInfiniteLoop > 100 || scope_stack.length > 100)
		{
			Debug.Log("Oh no!");
			return "Error";
		}
		
		currentButton = instructions[instructionToExecute];
		//if there is a button at "instructions[instructionToExecute]"
		if(currentButton != null)
		{
			//get the type of that button
			var _type : INSTRUCTION_TYPE = currentButton.GetContent().GetInstructionType();
			//create a string for any output
			var output : String;
			//for each type of button
			switch(_type)
			{
				//If the instruction is a Robot Action
				case INSTRUCTION_TYPE.ROBOT_ACTION : output = ExecuteRobot_Action(); break;
				//if the instruction modifies a variable
				case INSTRUCTION_TYPE.VARIABLE_ACTION : output = ExecuteVariable_Action(); break;
				//if the instruction begins a loop
				case INSTRUCTION_TYPE.LOOP_STRUCT : output = ExecuteLoop_Struct(); break;
				//if the instruction begins a branch statement
				case INSTRUCTION_TYPE.BRANCH_STRUCT : output = ExecuteBranch_Struct(); break;
				//if the instruction accesses a function space
				case INSTRUCTION_TYPE.FUNCTION_STRUCT : output = ExecuteFunction_Struct(); break;
				//if the instruction is a BREAK instruction
//				case INSTRUCTION_TYPE.ESCAPE : output = ExecuteEscape(); break;
				//if everything is ruined
				default: output = "Execution Failed\n"; ExecuteEmpty_Space(); break;
			}
			return output;
		}
		else{
			//if there is an empty space
			output = ExecuteEmpty_Space();
			return output; //Empty Space
		}	
	}
	
	function ExecuteEmpty_Space() : String
	{
		//Debug.Log("Execute Blank");
		
		GetNextInstruction();
		return ""; 
	}
	 
	function ExecuteRobot_Action() : String
	{
		//Debug.Log("Execute Robot Move");
		output = currentButton.GetContent().GetName()+"\n";
		GetNextInstruction();		
		return output;
	}
	
	function ExecuteVariable_Action() : String
	{
		//Debug.Log("Execute Variable Operation");
		
		var result : int;
		
		//TODO: Check for null arguments here
		if(currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].buttonList[0])
			var index1 : int = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].buttonList[0].parent_piece_index;
		else
			return "";
		
		Debug.Log(index1);
		Debug.Log(currentButton.GetWorkspace().parentGUI.varValues.length);
		p1 = parseInt(currentButton.GetWorkspace().parentGUI.varValues[index1]);
		
		var temp = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].numberValue; 		
		
		if (temp == "")		 
			p2 = 0;								
		else
			p2 = parseInt(temp);
			
		var opType : OPERATOR_TYPE = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].operator;
		
		switch(opType)
		{
			case OPERATOR_TYPE.ASSIGN_PLUSEQ:
				result = p1 += p2;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = result.ToString();
				break;
			case OPERATOR_TYPE.ASSIGN_MINUSEQ:
				result = p1 -= p2;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = result.ToString();
				break;
			case OPERATOR_TYPE.ASSIGN_EQ:
				result = p1 = p2;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = result.ToString();
				break;
			case OPERATOR_TYPE.PLUS:
				result = p1 + 1;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = result.ToString();
				break;
			case OPERATOR_TYPE.MINUS:
				result = p1 - 1;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = result.ToString();
				break;
		}
		
		GetNextInstruction();
		return "";
	}
	
	function ExecuteLoop_Struct() : String
	{
		//Debug.Log("Execute Loop");
	
		var pass : boolean = false;
		var first : boolean = true;
		var index1 : int;
		var opType : OPERATOR_TYPE;
		
		var currentLoopSpace : LoopSpace;
		
		var newScope : Scope = new Scope(currentButton.container_index, currentButton.members,true);
		Debug.Log("Scope: " + currentButton.container_index + " " + currentButton.members);
		
		if(IsInLoop() && GetScope().Begin == newScope.Begin && GetScope().End == newScope.End)
		{
			first = false;
		}
		else if((newScope.Begin == newScope.End) || !(GetScope().Begin <= newScope.Begin && GetScope().End >= newScope.End))
		{
			return "Error! Improper Use of Brackets.";
		}
		else
		{
			AddScope(newScope);
		}

		if(currentButton.title == "for")
		{
			currentLoopSpace = currentButton.GetWorkspace().parentGUI.loopSpaces[currentButton.GetContent().GetTargetIndex()];
			if(currentLoopSpace.buttonList[0] != null)
				index1 = currentLoopSpace.buttonList[0].GetPPI();
			else
				index1 = 9 + currentButton.windowID;
			
			if (index1 >= 9 && (currentLoopSpace.parentGUI.varValues.length <= index1 || currentLoopSpace.parentGUI.varValues[index1] == null))
			{
				currentLoopSpace.parentGUI.varValues[index1] = 0;
			}
			try{p1 = parseInt(currentLoopSpace.parentGUI.varValues[index1]);}
			catch(e){p1 = 0; Debug.Log("p1 is empty");}
			
			if(currentLoopSpace.buttonList[4] != null)
				opType = currentLoopSpace.buttonList[4].GetContent().GetOperatorType();
			else
				opType = OPERATOR_TYPE.COMP_LT;
			
			if(currentLoopSpace.limitValueIsVariable())
			{
				p2 = parseInt(currentLoopSpace.parentGUI.varValues[currentLoopSpace.buttonList[5].GetPPI()]);
			}
			else
			{
				try{p2 = parseInt(currentLoopSpace.limitValue);}
				catch(e){p2 = 0; Debug.Log("p2 is empty");}
			}
			
			if(first)
			{
				var initValue = -1;
				if(currentLoopSpace.initValueIsVariable())
				{
					initValue = parseInt(currentLoopSpace.parentGUI.varValues[currentLoopSpace.buttonList[2].GetPPI()]);
				}
				else
				{
					try{initValue = parseInt(currentLoopSpace.initValue);}
					catch(e){initValue = 0; Debug.Log("InitValue is empty");}
				}
				//do value setting math
				var initOpType = OPERATOR_TYPE.ASSIGN_EQ;
				Debug.Log("I would set the value to " + initValue + " here");
				p1 = initValue;
				currentButton.GetWorkspace().parentGUI.varValues[index1] = initValue.ToString();
				Debug.Log(p1 + " == " + initValue + " here");
			}		
		}			
		else if(currentButton.title == "while")
		{
			index1 = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].buttonList[0].parent_piece_index;
			try{p1 = parseInt(currentButton.GetWorkspace().parentGUI.varValues[index1]);}
			catch(e){p1 = 0; Debug.Log("p1 is empty");}		 								
			try{p2 = parseInt(currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].numberValue);}
			catch(e){p2 = 0; Debug.Log("p2 is empty");}
			opType = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].operator;
		}
		
		switch(opType)
		{
			case OPERATOR_TYPE.COMP_GT:
				Debug.Log(p1 + " > " + p2);
				pass = (p1 > p2);
				break;
			case OPERATOR_TYPE.COMP_LT:
				Debug.Log(p1 + " < " + p2);
				pass = (p1 < p2);
				break;
			case OPERATOR_TYPE.COMP_EQ:
				Debug.Log(p1 + " == " + p2);
				pass = (p1 == p2);
				break;
		}
		
		
		
		if(pass)
		{
					
			if(currentButton.title == "for")
			{
				var mathOpType;
				if (currentLoopSpace.buttonList[7] != null)
					mathOpType = currentLoopSpace.buttonList[7].GetContent().GetOperatorType();
				else
					mathOpType = OPERATOR_TYPE.PLUS;
					
				do_math(p1, mathOpType, index1);	
			}
			GetNextInstruction();
			Debug.Log("pass, going to " + instructionToExecute);				
			return ""; //"Condition True";							
		}
		else 
		{
			RemoveScope();
			
			//check to see if multiple scopes end at the same place			
			if (GetScope().Loop && GetScope().End == newScope.End)
			{
				MovePointer( GetScope().Begin );
				miserableInfiniteLoop++;
				Debug.Log("going to " + GetScope().Begin);	
				return "";			
			}
			else
			{
				MovePointer( newScope.End + 1 );
				var destInst = newScope.End + 1;
				Debug.Log("going to " + destInst);
				return "";
			}
			miserableInfiniteLoop = 0;
			return ""; 
		}		
	}
	
	function ExecuteBranch_Struct() : String
	{
		//Debug.Log("Execute Branch");
	
		var pass : boolean = false;
		var newScope : Scope = new Scope(currentButton.container_index, currentButton.members,true);
		if(!(GetScope().Begin <= newScope.Begin && GetScope().End >= newScope.End)) 
		{ 
			return "Error! Improper Use of Brackets."; 
		}
		
		if(currentButton.title == "if")
		{
			var index1 : int = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].buttonList[0].parent_piece_index;
			p1 = parseInt(currentButton.GetWorkspace().parentGUI.varValues[index1]);
			try
			{		 								
				p2 = parseInt(currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].numberValue);
			}
			catch(e)
			{
				var index2 : int = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].buttonList[2].parent_piece_index;
				p2 = parseInt(currentButton.GetWorkspace().parentGUI.varValues[index2]);
			}
	
			//gets operator type of the condition's space
			var opType : OPERATOR_TYPE = currentButton.GetWorkspace().parentGUI.opSpaces[currentButton.GetContent().GetTargetIndex()].operator;
			switch(opType)
			{
				case OPERATOR_TYPE.COMP_GT:
					//Debug.Log(p1 + " > " + p2);
					pass = p1 > p2;
					break;
				case OPERATOR_TYPE.COMP_LT:
					//Debug.Log(p1 + " < " + p2);
					pass = p1 < p2;
					break;
				case OPERATOR_TYPE.COMP_EQ:
					//Debug.Log(p1 + " == " + p2);
					pass = p1 == p2;
					break;
			}
			if(pass)
			{
				GetNextInstruction();
				return ""; //"Condition True\n";		
			}
			else {
				MovePointer( newScope.End+1 );
				return ""; //"Condition False\n";
			}
		}	
		return "";		
	}
	
	function ExecuteFunction_Struct() : String
	{	
		//Debug.Log("Execute Function");
		if (inception > 100)
			return "Error";
		
		AddScope(currentButton.container_index, currentButton.container_index,false);
		var result = currentButton.GetWorkspace().parentGUI.funcSpaces[currentButton.GetContent().GetTargetIndex()].ExecuteWorkspace(inception + 1);
		
		
		GetNextInstruction();
		RemoveScope();
		
		return result; //"Entering " + currentButton.title +"\n"+ result + "Exiting " + currentButton.title+ "\n";
	}
		
	function do_math(p1 : int, op_type : OPERATOR_TYPE, index : int)
	{
		//Debug.Log(op_type);
		var result : int;
		var p2 = 1;
		switch(op_type)
		{
			case OPERATOR_TYPE.ASSIGN_PLUSEQ:
				result = p1 += p2;
				currentButton.GetWorkspace().parentGUI.varValues[index] = result.ToString();
				break;
			case OPERATOR_TYPE.ASSIGN_MINUSEQ:
				result = p1 -= p2;
				currentButton.GetWorkspace().parentGUI.varValues[index] = result.ToString();
				break;
			case OPERATOR_TYPE.ASSIGN_EQ:
				result = p1 = p2;
				currentButton.GetWorkspace().parentGUI.varValues[index] = result.ToString();
				break;
			case OPERATOR_TYPE.PLUS:
				result = p1 + 1;
				currentButton.GetWorkspace().parentGUI.varValues[index] = result.ToString();
				break;
			case OPERATOR_TYPE.MINUS:
				result = p1 - 1;
				currentButton.GetWorkspace().parentGUI.varValues[index] = result.ToString();
				break;
		}
	}
	
	function HasNextInstruction(index : int) : boolean
	{			
		if (index < instructions.length && instructions[index] != null)
		{
			return true;
		}
		if (scope_stack.length > 1)
		{
			return true;
		}
		if (index == instructions.length)
		{
			instructionsCompleted = true;
			return false;
		}
		
		return HasNextInstruction(index +1);
	}
	
	function HasNextInstruction() : boolean
	{
		if (HasNextInstruction(instructionToExecute))
			return true;
		else
			return false;
	}
	
	function IsComplete()
	{
		if (instructionsCompleted)
		{
			return true;
		}
		if(miserableInfiniteLoop > 100)
		{
			//Debug.Log("Oh no!");
			return true;
		}		
		if (HasNextInstruction(instructionToExecute))
		{
			return false;
		}
			
		return (scope_stack.length == 1);
	}
}