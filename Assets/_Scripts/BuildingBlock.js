class BuildingBlock{

	//image
	var blockName : String;
	//var image : image

	//program

	//points to be filled with blocks (assuming start is at 0,0 and robot facing is in +x dir)
	var points : List.<Vector3> = new List.<Vector3>();
	
	//any additional points that need to be marked "occupied" (jumping, carrying, etc)
	var clearance : List.<Vector3> = new List.<Vector3>();

	//objects to be placed (assuming start is 0,0, etc)
	var objPoints : List.<Vector3> = new List.<Vector3>();
	var objNames : List.<String> = new List.<String>();

	//finish
	var finish : Vector3 = Vector3.zero;
	var facing : int = 0;
	
	//Program
	var lines : int;
	var program : String;
	var toggle : boolean = false;
	var toggleTarget : boolean = false;
	
	//picture
	var icon : GUIContent;
	
	//constructor
	function BuildingBlock(the_points : List.<Vector3>, the_name : String, the_finish : Vector3, the_facing : int)
	{
		this.points = the_points;
		this.blockName = the_name;
		this.finish = the_finish;
		this.facing = the_facing;
		icon = new GUIContent(Resources.Load("Block GUI/"+blockName) as Texture2D);
	}
	
	function AddItem(name : String, point : Vector3)
	{
		objPoints.Add(point);
		objNames.Add(name);
	}
	
	function RotateArray(rot : int, list : List.<Vector3>) : List.<Vector3>
	{
		var output = new List.<Vector3>();
		var newPoint : Vector3;
		var hold : int = 0;
//		Debug.Log("spinning it " + rot);
		if(rot == 0) //Z,-X
		{
			for (point in list)
			{
				newPoint = new Vector3();
				newPoint.x = point.z;
				newPoint.y = point.y;
				newPoint.z = point.x;
				output.Add(newPoint);
			}
			return output;
		}
		else if (rot == 1) //X,Z
		{
			for (point in list)
			{
				newPoint = new Vector3();
				newPoint.x = point.x;
				newPoint.y = point.y;
				newPoint.z = -1 * point.z;
				output.Add(newPoint);
			}
			return output;
		}
		else if (rot == 2) //-Z,X
		{
			for (point in list)
			{
				newPoint = new Vector3();
				newPoint.x = point.z * -1;
				newPoint.y = point.y;
				newPoint.z = point.x * -1;
				output.Add(newPoint);
			}
			return output;
		}
		else if (rot == 3) //-X,-Z
		{
			for (point in list)
			{
				newPoint = new Vector3();
				newPoint.x = point.x * -1;
				newPoint.y = point.y;
				newPoint.z = point.z;
				output.Add(newPoint);
			}
			return output;
		}
	}

	function RotatePoints(rot : int) : List.<Vector3>
	{
		return RotateArray(rot, points);
	}
	
	function RotateClearance(rot : int) : List.<Vector3>
	{
		return RotateArray(rot, clearance);
	}
	
	function RotateItems(rot : int)
	{
		return RotateArray(rot, objPoints);
	}
	
	function RotateFinish(rot : int) : Vector3
	{
		var newList = new List.<Vector3>();
		newList.Add(finish);
		newList = RotateArray(rot, newList);
		return newList[0];
	}
}