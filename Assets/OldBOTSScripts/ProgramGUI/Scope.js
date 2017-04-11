
class Scope{
	public var Begin: int;
	public var End: int;
	public var Loop: boolean;
	public var First : boolean = true;
	
	function Scope(x: int, y: int, loop: boolean)
	{
		this.Begin = x;
		this.End = y;
		this.Loop = loop;
		this.First = true;
	}
	
	function GetBegin() : int
	{
		return Begin;
	}
	
	function GetEnd() : int
	{
		return End;
	}

	function GetLoop() : boolean
	{
		return Loop;
	}
}