//Point
//holds two integers to represent an x/y screen coordinate
//last modified: June 24 2010 - Drew Hicks

class Point{

	public var X: int;
	public var Y: int;
	
	function Point(x: int, y: int)
	{
		this.X = x;
		this.Y = y;
	}
	
	function GetX() : int
	{
		return X;
	}
	
	function GetY() : int
	{
		return Y;
	}
	
	function DistanceSqFrom(p : Point) : int
	{
		return ((this.X - p.X) * (this.X - p.X) + (this.Y - p.Y) * (this.Y - p.Y) );
	}
	
	static function Add(p1 : Point, p2 : Point) : Point
	{
		return new Point(p1.X + p2.X, p1.Y + p2.Y);
	}
	
	static function isEqual(p1 : Point, p2 : Point) : boolean
	{
		//Debug.Log(p1.X +" == " + p2.X + " && " + p1.Y + " == "+ p2.Y);
		return (p1.X == p2.X && p1.Y == p2.Y);
	}
	
	function toString()
	{
		return "(" + X + ", " + Y + ")";
	}
}