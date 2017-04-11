//Point
//holds two integers to represent an x/Z screen coordinate
//last modified: June 24 2010 - Drew Hicks

class Point3D{

	public var X: float;
	public var Z: float;
	var height : int;
	var isOccupied : boolean;
	var isEndLevel : boolean;
	
	function Point3D(x: float, z: float)
	{
		isEndLevel = false;
		this.X = x;
		this.Z = z;
	}
	
	function GetX() : float
	{
		return X;
	}
	
	function GetZ() : float
	{
		return Z;
	}
	
	function GetHeight() : int
	{
		return height;	
	}
	
	function SetHeight(i : int)
	{
	 	height = i;  	
	}
	
	function SetOccupied(occupy : boolean)
	{
	 	isOccupied = occupy;	
	}
	
	function SetEndLevel(theEnd : boolean)
	{
		isEndLevel = theEnd;	
		
	}
}