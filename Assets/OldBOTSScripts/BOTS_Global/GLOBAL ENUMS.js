enum SIZE
{
  SMALL = 0, 
  MEDIUM = 1, 
  LARGE = 2,
}

enum INSTRUCTION_TYPE
{
	ROBOT_ACTION = 0,
	VARIABLE_ACTION = 1,
	LOOP_STRUCT = 2,
	BRANCH_STRUCT = 3,
	FUNCTION_STRUCT = 4,
	VARIABLE = 5,
	ESCAPE = 6,
	OPERATOR = 7,
	NOT_AN_INSTRUCTION = 8,
}

enum OPERATOR_TYPE
{
	COMP_GT = 0,
	COMP_LT = 1,
	COMP_EQ = 2,
	ASSIGN_PLUSEQ = 3,
	ASSIGN_MINUSEQ = 4,
	ASSIGN_EQ =5,
	PLUS = 6,
	MINUS = 7,
	ROBOT_FORWARD,
	ROBOT_BACKWARD,
	ROBOT_LEFT,
	ROBOT_RIGHT,
	ROBOT_ACTIVATE,
	ROBOT_PICKUP,
	ROBOT_JUMP,
	NOT_AN_OPERATOR,
}
enum OPERATOR_RETURN_TYPE
{
	BOOLEAN = 0,
	VARIABLE = 1,
};