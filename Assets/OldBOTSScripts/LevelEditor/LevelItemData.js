var offset : float;
var itemName : String;

var x : int = 0;
var y : int = 0;
var z : int = 0;

var init_x : int = 0;
var init_y : int = 0;
var init_z : int = 0;

var held = false;

function Update () 
{
	
}

function ResetPosition()
{
	x = init_x;
	y = init_y;
	z = init_z;
}

function GetPositionPoint() : Point
{
	var returnPoint : Point = new Point(x, z);
	return returnPoint;
}

function SetHeld(flag : boolean)
{
	held = flag;
}

function toString() : String
{
	var output = "";
	output += x + " " + y + " " + z + " | " + init_x + " " + init_y + " " + init_z + " ";
	return output;
}