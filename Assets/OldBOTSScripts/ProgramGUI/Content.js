class Content
{
	var _name : String;
	var _targetIndex : int;
	var _description : String;
	var _type : INSTRUCTION_TYPE = INSTRUCTION_TYPE.NOT_AN_INSTRUCTION;
	var _op : OPERATOR_TYPE = OPERATOR_TYPE.NOT_AN_OPERATOR;;
	var _instruction : Instruction;
	
	function Content()
	{
		_type = INSTRUCTION_TYPE.NOT_AN_INSTRUCTION;
		_op = OPERATOR_TYPE.NOT_AN_OPERATOR;
	}
	
	function Content(n : String)
	{
		_name = n;
	}
	
	function SetName(n: String)
	{
		_name = n;
	}
	
	function GetName() : String
	{
		return _name;
	}
	
	function SetDescription(d: String)
	{
		_description = d;
	}
	
	function GetDescription() : String
	{
		return _description;
	}
	
	function SetInstructionType(it: INSTRUCTION_TYPE)
	{
		//Debug.Log("Setting Type!" + it);
		_type = it;
	}
	
	function GetInstructionType() : INSTRUCTION_TYPE
	{
		var t : INSTRUCTION_TYPE = _type;
		return t;
	}
	
	function SetOperatorType(op: OPERATOR_TYPE)
	{
		_op = op;
	}
	
	function GetOperatorType() : OPERATOR_TYPE
	{
		return _op;
	}
	
	function SetInstruction(inst: Instruction)
	{
		_instruction = inst;
	}
	
	function GetInstruction() : Instruction
	{
		return _instruction;
	}
	
	function SetTargetIndex(i: int)
	{
		_targetIndex = i;
	}
	
	function GetTargetIndex() : int
	{
		return _targetIndex;
	}
	
	function Clone() : Content
	{
		var cloneCont = new Content(_name);
		cloneCont.SetDescription(_description);
		cloneCont.SetInstructionType(_type);
		cloneCont.SetTargetIndex(_targetIndex);
		cloneCont.SetOperatorType(_op);
		cloneCont.SetInstruction(_instruction);
		return cloneCont;
	}
}