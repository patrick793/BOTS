// Instruction Class
//Contains all of the information about an instruction
//for the robot or program to execute

class Instruction
{
	var instruction_type : INSTRUCTION_TYPE;

    var param1 : int; //value or index of first parameter
	var param2 : int; //value or index of second parameter
	
	var isP1index : boolean; //is the first parameter an index to a variable
	var isP2index : boolean; //is the second parameter an index to a variable
	
	var operator : OPERATOR_TYPE;
	
	var target_index : int; //index of the end of the loop/branch
}