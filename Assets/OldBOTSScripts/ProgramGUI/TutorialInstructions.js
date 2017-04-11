//TutorialInstructions
//Holds information about tutorial levels

class TutorialInstructions
{
	var styleArray = new Array();
	var indexArray = new Array();
	var instructionsArray = new Array();
	var targetWindowArray = new Array();
	var targetWindowIDArray = new Array();
	var targetIndexArray = new Array();
	
	var functionLimit : int = -1;
	var forLoopLimit : int = -1;
	
	function TutorialInstructions()
	{
	
	}
	
	
// ACCESSORS	
	function GetStyle(instructionIndex : int) : String
	{
		return styleArray[instructionIndex];
	}
	function GetButtonIndex(instructionIndex : int) : int
	{
		return indexArray[instructionIndex];
	}
	function GetInstruction(instructionIndex : int)
	{
		//Debug.Log("called with " + instructionIndex);
		return instructionsArray[instructionIndex];
	}
	function GetTargetIndex(instructionIndex : int)
	{
		return targetIndexArray[instructionIndex];
	}
	function GetTargetWindow(instructionIndex : int)
	{
		return targetWindowArray[instructionIndex];
	}
	function GetTargetWindowID(instructionIndex : int)
	{
		return targetWindowIDArray[instructionIndex];
	}
	function GetSize() : int
	{
		return instructionsArray.length;
	}
	
	function GetFunctionLimit()
	{
		return functionLimit;
	}
	function GetForLoopLimit()
	{
		return forLoopLimit;
	}
	
	

	
	function AddStyle(style : String)
	{
		styleArray.Add(style);
	}
	function AddButtonIndex(buttonIndex : int)
	{
		indexArray.Add(buttonIndex);
	}
	function AddTargetIndex(targetIndex : int)
	{
		targetIndexArray.Add(targetIndex);
	}
	function AddInstruction(instruction : String)
	{
		instruction = instruction.Replace('%', '\n');
		instructionsArray.Add(instruction);
	}
	function AddTargetWindow(window : String)
	{
		switch(window)
		{
			case "AddVar":
				targetWindowArray.Add(0);
				break;
			case "AddFunc":
				targetWindowArray.Add(1);
				break;
			case "EditVar":
				targetWindowArray.Add(2);
				break;
			case "EditOp" : 	
				targetWindowArray.Add(3);				
				break; 
			case "EditLoop" :
				targetWindowArray.Add(4);
				break;
			case "EditFunc" :
				targetWindowArray.Add(5);
				break;
			default :
				targetWindowArray.Add(-1);
				break;
		}
	}
	function AddTargetWindowID(windowID : int)
	{
		targetWindowIDArray.Add(windowID);
	}
	
	function SetFunctionLimit(funcLimit : int)
	{
		functionLimit = funcLimit;
	}
	function SetForLoopLimit(limit : int)
	{
		forLoopLimit = limit;
	}

}